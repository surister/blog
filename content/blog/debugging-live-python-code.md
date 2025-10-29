---
title: 'Debugging live code with CPython 3.14'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'Blueprint showcasing available components'
tags: [ 'python', 'Antlr4', 'software' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Monologue Expert' }, { 'name': 'Anon' } ]
show_preview: true
published: false
date: '2025-06-23'
comment_links: [ { 'name': 'reddit', 'href': '' }, { 'name': 'hacker news', 'href': '' } ]
---

Debugging a live Python process got incredibly easy, but
when I read the [Python 3.14 notes](https://docs.python.org/3/whatsnew/3.14.html)
I didn't pay much attention to [PEP 768: Safe external debugger interface for 
CPython](https://peps.python.org/pep-0768/), not every PEP sparks enough
interest to me to spend 1-2 days going pep-deep, and I was honestly eclipsed
by the new Template strings and the Multiple interpreters in the standard library.

It was not until I saw
[_♱☠︎︎ Pablo Galindo 𓃵♱_](https://github.com/pablogsal), a core CPython and one
of its authors live at PyConES explaining and demoing it that I became convinced
that everyone should have a look at this, since it changes the way we debug 
Python.

_Maybe_ in the future we will not be debugging like I will show you in this 
article, since the ergonomics is a bit raw, but it'll definitely be the
foundation into which Python debuggers will work.


## How it was before?

Before Python 3.14, there was not a standard way of externally accessing an 
interpreter's memory and state, or an interpreter provided way of executing code
at a **safe** point. Code could be run on critical interpreter operations like
memory allocation or reference counting. [EXPAND THIS A LITTLE BIT]

It needed deep knowledge of the CPython internals and still, things could 
easily go wrong, debugging a **running** process was unsafe, using tools like 
memray carried some risk of borking your program, making debugging in production
not for the faint of heart.

With the new PEP, this risk is pretty much gone, since now we'll be debugging
with the interpreter and not against it.

## How to debug a process.

We have a new function in the sys module: [sys.remote_exec(pid, path)]{.h}
where [pid]{.h} is the id of the process we want to debug, and [path]{.h}
is the file name of the debugging script. Both Python versions have to be
the exact same.

When you run [remote_exec]{.h} it will load the file, send it to the target 
 process, and at some point, when it's deemed safe, it'll be executed.

:CustomImage{src="/img/debug/remote_exec.svg"}

Let's see a practical example, we'll debug a simple script:

Our client increases a counter inside an infinite loop, when the counter
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
process, its considered a privileged operation, so you need to run this with 
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
for [remote_exec]{.h}

```shell
sudo python -m pdb -p 194725
```

## Debugging the CrateDB driver

Now we can write different 