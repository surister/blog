---
title: 'Debugging live code with CPython 3.14'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'debugging', 'remote_exec', 'live debugging', 'python 3.14' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Ecosystem Engineer' } ]
show_preview: true
published: false
date: '2025-06-23'
comment_links: [  ]
---

Debugging a live Python process just got incredibly easier, but
when I read the [Python 3.14 notes](https://docs.python.org/3/whatsnew/3.14.html)
I didn't pay much attention to [PEP 768: Safe external debugger interface for 
CPython](https://peps.python.org/pep-0768/), not every PEP sparks enough
interest to me to spend 1-2 days going pep-deep, and I was honestly eclipsed
by the new Template strings and the Multiple interpreters in the standard library.

It was not until I saw
[_♱☠︎︎ Pablo Galindo 𓃵♱_](https://github.com/pablogsal), a core CPython and one
of PEP's authors live at PyConES that I understood the importance of this,
since it changes the way we will be debugging Python.

_Maybe_ in the future we will not be debugging as I show you in this 
post, since the ergonomics is a bit raw, but it'll definitely be the
foundation into which Python debuggers will work.


## How bad was it before?

Before Python 3.14, there was not a standard way of accessing a Python process' memory.
You can, of course, read the memory of any given process if you have the necessary permissions.
For example, on Linux you can inspect /proc/[{pid}]/mem to read the process’s memory,
but this is os-dependant; painful. Then you have to locate where the current
state of the interpreter ([PyRuntime]{.h}) is, and the actual parts of the state that 
you want to access. Then you have to somehow run your code in a safe place, running
it in the middle of critical operations like memory allocation or reference counting
could mess up the entire execution.

This means that in order to write a Python debugger you had to have very deep knowledge
of CPython internals and be very careful, debugging a **running** process was unsafe,
using tools like memray carried some risk of borking your program, making debugging
in production not for the faint of heart.

With the new PEP, this risk is pretty much gone, since now we'll be debugging
with the interpreter and not against it. Without going into details (that you can 
read in the PEP), the complications of reading a CPython memory is now outsourced 
to Pablo's and the CPython's team coffe machines and Friday nights, new structs
have been added that store more meta information about debugging state and
locations of critical internal structures (offsets) and now part of the CPython 
execution loop is to check whether there is a pending debugging piece of code
to execute, as this is checked in a consistent state, running it is also safe.

## How to debug a process.

For us pythoners-code-debuggers it's all just an API change (addition).
We have a new function in the sys module: [sys.remote_exec(pid, path)]{.h}
where [pid]{.h} is the id of the process we want to debug, and [path]{.h}
is the file name of the debugging script. Both Python versions have to be
the same.

When you run [remote_exec]{.h} it will load the file, send it to the target 
 process, and at some point, when it's deemed safe, it'll be executed.

:CustomImage{src="/img/debug/remote_exec.svg"}

Let's see a practical example, we'll debug a simple script that
increases a counter inside an infinite loop, when the counter
is divisible by five, it will silently raise an exception.

```python true [client.py]
import sys
import time, os

if __name__ == '__main__':
    print(sys.version, 'pid:', os.getpid())
    c = 0
    not_divisible_by = 5
    
    while True:
        c += 1
        print('My cool counter! iteration nº', c)
        try:
            if not c % not_divisible_by:
                raise Exception(f'We cannot have numbers'
                                f' that are divisible by {c}')
        except Exception as e:
            exception = e

        time.sleep(1)
```
---
:CustomImage{src="/img/debug/first.gif" roundedBottom='true'}

Our client debugger will just print 'Hello from the execution' for now.

```python [client_debugger.py]
print('Hello from the execution')
```

Now, we run [sys.remote_exec]{.h}, as this will read memory from another 
process, it is a privileged operation, so you need to run this with 
[sudo]{.h}.


```python true
sudo uv run python -c \
 "import sys; sys.remote_exec(136886, 'client_debugger.py')"
```
---
:CustomImage{src="/img/debug/second.gif" roundedBottom='true'}

The output of the debugging script will show up in the target process, and as
you can see, the process does not stop.

Now, to access the target process's variables, you need to import the module.

```python true
import __main__ as debug

print("Hello from the target process")
print(debug)
print(f"Current iteration is: {debug.c}")
```
---
:CustomImage{src="/img/debug/third.gif" roundedBottom='true'}

You can pretty much do anything at this point, like adding new variables,
changing variables values, anything. Technically, this could be used to do 
hot-patching, but I wouldn't recommend it.

```python true
import __main__ as debug

print("Hello from the target process")
print(debug)
print(f"Current iteration is: {debug.c}")
print(f"Last exception is: {debug.exception}")
print("Resetting c")
debug.c = 0
```
---
:CustomImage{src="/img/debug/fourth.gif" roundedBottom='true'}

You could get fancier and write a pseudo-REPL script:

```python true
#!/usr/bin/env python3.14
import argparse
import os
import sys
import tempfile

def exec_code(pid, code: str) -> None:
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(('import __main__ as d;'+code).encode('utf-8'))
        os.chmod(tmp.name, 0o644) # Make it readable.
        sys.remote_exec(pid, tmp.name)


def main():
    print("Debug repl (type 'exit' or Ctrl+C to quit)")

    parser = argparse.ArgumentParser()
    parser.add_argument("--pid",
                        required=True, 
                        type=int,
                        help="Process ID")

    args = parser.parse_args()

    print('Debugging module is available as "d", e.g. print(d)')

    while True:
        try:
            user_input = input(">>> ")
            if user_input.strip().lower() == 'exit':
                print("\nTa luego!")
                break

            exec_code(args.pid, user_input)

        except KeyboardInterrupt:
            print("\nTa luego!")
            break
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    main()
```
---
:CustomImage{src="/img/debug/sixth.gif" roundedBottom='true'}

A similar thing could be achieved by running [pdb]{.h} which added support
for [sys.remote_exec(...)]{.h}

```shell
sudo python -m pdb -p 194725
```

## Debugging the CrateDB driver

Now we can write different 