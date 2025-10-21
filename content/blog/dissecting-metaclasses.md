---
title: 'Dissecting metaclasses: How Django models work.'
image: 'https://images.pexels.com/photos/15587985/pexels-photo-15587985/free-photo-of-a-cat-sitting-on-top-of-some-rocks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
description: 'no way'
tags: [ 'python', 'pycones', 'software', 'talk', 'metaclasses', 'django' ]
authors: [ { 'name': 'Ivan', 'job_title': 'Database Environment Engineer' }]
show_preview: false
published: true
date: '2025-10-16'
---

::Alert
---
"type": "success"
"icon": "mdi-note"
"text": "This is the content of a talk for PyconES 2025, this does not read like a normal blog post."
---
::

## [Introduction]{.text-h3}

Title: [Dissecting metaclasses: How Django models work.]{.text-blue}<br>
Speaker: [Iván Sánchez]{.text-blue}<br>
Current job: [Database Ecosystem Engineer @ CrateDB]{.text-blue} <br>
Previous job: [Senior Software Engineer @ Frontiers]{.text-blue}

## What's our objective

The Objective for this talk is to learn a little bit more about [Python's Metaclasses]{.font-weight-bold}
and ultimately try to understand how Django leverages them to define its API.

Classes that you normally write:

```python
class HttpResponse:
    def __init__(self, data: bytes):
        self._data = data
        self._text = data.decode(errors="ignore")

        self.status_code = self.extract_status_code()
        self.headers, self.body = self.extract_headers_and_body()

    def extract_status_code(self):
        """
        Parse the first line of the HTTP 
        response to get the status code.
        Example: b"HTTP/1.1 404 Not Found" → 404
        """
        try:
            first_line = self._text.splitlines()[0]
            parts = first_line.split(" ")

            if len(parts) >= 2 and parts[1].isdigit():
                return int(parts[1])
        except Exception:
            pass
        return None

    def extract_headers_and_body(self):
        """
        Splits headers and body using
        the blank line separator.
        """
        try:
            header_text, _, body = self._text.partition("\r\n\r\n")

            header_lines = header_text.split("\r\n")[1:]
            headers = {}
            for line in header_lines:
                if ":" in line:
                    key, value = line.split(":", 1)
                    headers[key.strip()] = value.strip()

            return headers, body
        except Exception:
            return {}, ""

    @property
    def text(self):
        """Return the body as text."""
        return self.body

    def __repr__(self):
        code = self.status_code
            if self.status_code is not None else "?"
        return f"<Response [status_code={code}]>"
```

What you can write in Django:

```python
from django.db import models


class User(models.Model):
    id = models.IntegerField()
    username = models.CharField()
    password = models.CharField()

    class Meta:
        ordering = ["id"]
        db_table = 'user_model_pki2020'
```

## The Python data model.

### Objects

Everything in Python is an object; all data in python is represented by objects that have 
an **identity**, **type** and a **value.**

```python
>>>class T: pass
>>>T
<class '__main__.T'>
>>>id(T)
101646720

>>>t = T()
>>>t
<__main__.T object at 0x7c57c5b9b710>
>>>id(t)
136716421281552

>>>def t(a, b): return a + b
>>>t
<function t at 0x7c5806dda5c0>
>>>id(t)
136717514155456

>>>t = 'Almondiga'
>>>t
'Almondiga'
>>>id(t)
136716420602800

>>>t = 12
>>>t
12
>>>id(t)
136717545266712
```

### Protocols
All objects in Python have [already defined](https://github.com/python/cpython/blob/525dcfe5236ee21b234cad16d2a3d5769e77e0ec/Objects/typeobject.c#L11226) protocols, usually called **d-under methods** or
**magic methods**. They allow us to customize/inject behaviour in different points of executions.

Every object has _some_ of them:

```python
>>>def t(a, b): return a + b
>>>dir(t)
['__annotations__', '__builtins__', '__call__', '__class__',
 '__closure__', '__code__', '__defaults__', '__delattr__',
 '__dict__', '__dir__', '__doc__', '__eq__', '__format__',
 '__ge__', '__get__', '__getattribute__', '__getstate__',
 '__globals__', '__gt__', '__hash__', '__init__', '__init_subclass__',
 '__kwdefaults__', '__le__', '__lt__', '__module__', '__name__',
 '__ne__', '__new__', '__qualname__', '__reduce__', '__reduce_ex__',
 '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__',
 '__type_params__']
>>>t.__code__.co_varnames
('a', 'b')
```

Typically, we override them when constructing classes

```python
class Bird:
    def __init__(self, can_fly):
        self.can_fly = can_fly


# This class is lying to me!, it's not returning a `NoT` object.
class Dog:
    def __new__(cls, *args, **kwargs):
        return Bird(can_fly=True)


mike = Dog()
print(mike)
print(mike.can_fly)
# <__main__.Bird object at 0x7c2a203da5a0>
# True
```

In python, [type is 👑]{.text-h3}

[type]{.h} is a **metaclass**, and by default, **every** object in python uses it.

```python
>>>type
<class 'type'>

>>>type('string')
<class 'str'>

>>>type(type('string'))
<class 'type'>

>>>type(str)
<class 'type'>

>>>class T: pass
>>>type(T)
<class 'type'>

>>>def t(): pass
>>>type(t)
<class 'type'>
```

## What happens when we instantiate?
When [mike = Dog()]{.h} is run, [PyObject_Call]{.h} extracts `Dog's` type (its metaclass) [tp_call]{.h} which for
type is [type_call](https://github.com/python/cpython/blob/525dcfe5236ee21b234cad16d2a3d5769e77e0ec/Objects/typeobject.c#L2407){.h}.

![](/img/metaclass/meta.svg){maxwidth=600}

In Python terms, when a class is instantiated, the class's type [`__call__`]{.h} method gets called and
[type]{.h} call method calls [`__new__`]{.h} and then [`__init__`]{.h}

```python
class Bird:
    def __init__(self, can_fly):
        print('Im being called: __init__')
        self.can_fly = can_fly

    def __new__(cls, *args, **kwargs):
        print('Im being called: __new__')
        return super().__new__(cls)


birb = Bird(True)
print(birb)

# Im being called: __new__
# Im being called: __init__
# <__main__.Bird object at 0x7ab5d4dd6840>
```

If we pass a custom metaclass:

```python
class MetaBirdBroken(type):
    def __call__(cls, *args, **kwargs):
        print('Im being called: __call__')
        return


class Bird(metaclass=MetaBirdBroken):
    def __init__(self, can_fly):
        print('Im being called: __init__')
        self.can_fly = can_fly

    def __new__(cls, *args, **kwargs):
        print('Im being called: __new__')
        return super().__new__(cls)


birb = Bird(True)
print(birb)
# Im being called: __call__
# None
```

So, what is a metaclass?

A metaclass is the machinery to create classes.

* The default metaclass for all objects is [type]{.h}
* The metaclass for type, is type.
* You can create a metaclass by inheriting from [type]{.h}
* You can pass a custom metaclass by the [metaclass]{.h} keyword in class definition.
* When a class is created, the class type's call method is executed.
* type call method calls new and init.

## Use cases for metaclasses

"_The potential uses for metaclasses are boundless. Some ideas that have been explored include enum,
logging, interface checking, automatic delegation, automatic property creation, proxies, frameworks,
and automatic resource locking/synchronization._" - Python data model

### [Mixins: MutableMapping]{.h}

By implementing: [`__getitem__`]{.h}, [`__setitem__`]{.h}, [`__delitem__`]{.h}, 
[`__iter__`]{.h} and [`__len__`]{.h}

We get: [`__contains__`]{.h}, [`__reversed__`]{.h}, [`index`]{.h},
[`count`]{.h}, [`append`]{.h}, [`clear`]{.h}, [`reverse`]{.h}, [`extend`]{.h}, [`pop`]{.h}, 
[`remove`]{.h}, [`__idadd__`]{.h}.

Methods are implemented in Python, method implementation constraint is implemented with [ABCMeta]{.h},
a metaclass.

```python
from typing import MutableMapping

from crate import client


class SqlDict(MutableMapping):
    def __init__(
            self,
            name: str,
            conn_str: str = 'localhost:4200'
    ):
        self.table_name = name
        self.cursor = client.connect(conn_str).cursor()
        self.cursor.execute(
            f"""CREATE TABLE IF NOT EXISTS
            {self.table_name} (d OBJECT)"""
        )

    def __iter__(self):
        self.cursor.execute(f"select * from {self.table_name}")
        r = self.cursor.fetchall()
        return iter(r[0][0].keys())

    def __len__(self):
        self.cursor.execute(f"select count(*) from {self.table_name}")
        return self.cursor.fetchone()[0]

    def __setitem__(self, key, value):
        self.cursor.execute(f"update {self.table_name}"
                            f" set d['{key}'] = {str(value)!r}")

        if self.cursor._result['rowcount'] == 0:
            # Key does not exist:
            values = '{' + f'"{key}" = {repr(value)}' + '}'
            self.cursor.execute(f"insert into {self.table_name}"
                                f" (d) values ({values})")
        self.cursor.execute(f"refresh table {self.table_name}")

    def __getitem__(self, key):
        self.cursor.execute(f"select d['{key}']"
                            f" from {self.table_name}")
        return self.cursor.fetchone()[0]

    def __delitem__(self, key):
        self.cursor.execute(f"DELETE FROM {self.table_name} ")

    def __repr__(self):
        return (f'{self.__class__.__qualname__}'
                f'({tuple(self.items())})')
```

This effectively gives us a sharded/distributed dictionary that we can just plug in anywhere a
dict is used.

### Tracking subclasses: Plugin system

Every class that inherits from [MusicFile]{.h} is automatically tracked at 
class creation time. Also [RegistryMeta.create_for]{.h} gives us a 
cheap dynamic dispatch.

```python
from __future__ import annotations

import abc
import os
from abc import abstractmethod
from typing import Dict, List, Type


class RegistryMeta(abc.ABCMeta):
    """Metaclass that tracks subclasses that declare `extensions`."""
    registry: Dict[str, Type["MusicFile"]] = {}

    def __new__(cls, name, bases, namespace, **kwargs):
        new_cls = super().__new__(cls, name, bases, namespace)

        exts: List[str] = namespace.get("extensions", []) or []
        for ext in exts:
            key = ext.lower()
            if not key.startswith("."):
                raise ValueError(f"{name}.extensions must"
                                 f" include leading dots (got {ext!r})")
            if key in cls.registry:
                raise ValueError(
                    f"Extension {key!r} already handled by"
                    f" {cls.registry[key].__name__}; "
                    f"{name} tried to register it again."
                )
            cls.registry[key] = new_cls
        return new_cls

    @classmethod
    def create_for(cls, path: str, **kwargs) -> "MusicFile":
        _, ext = os.path.splitext(path)
        ext = ext.lower()
        try:
            obj = cls.registry[ext]
        except KeyError:
            raise ValueError(f"No handler registered "
                             f"for extension {ext!r}") from None
        return obj(path, **kwargs)


class MusicFile(metaclass=RegistryMeta):
    """Base type for music file handlers."""
    extensions: List[str]

    def __init__(self, path: str):
        self.path = path

    @classmethod
    def is_supported(cls, extension: str):
        return extension in cls.registry


    @abstractmethod
    def play(self) -> None:
        ...

# ----- CLIENT LIBRARY -----
class Mp3File(MusicFile):
    extensions = [".mp3"]

    def play(self):
        print(f"[mp3] Playing {self.path}")

class FlacFile(MusicFile):
    extensions = [".flac"]

    def play(self) -> None:
        print(f"[FLAC] Playing {self.path}")


class OggFile(MusicFile):
    extensions = [".ogg", ".oga"]

    def play(self) -> None:
        print(f"[OGG] Playing {self.path}")


def open_music(path: str) -> MusicFile:
    return RegistryMeta.create_for(path)


# --- Demo ---

if __name__ == "__main__":
    for path in ["track.mp3", "album.flac", "podcast.oga"]:
        handler = open_music(path)
        handler.play()

    print(MusicFile.is_supported('.mp3'))
    print(MusicFile.is_supported('.mp4'))

    class Mp4File(MusicFile):
        extensions = [".mp4"]

        def play(self) -> None:
            ...

    print(MusicFile.is_supported('.mp4'))
```

## Django models!

We are going to shorten them because... [django.db.models.Model]{.h} is packed, [see](https://github.com/django/django/blob/main/django/db/models/base.py#L94)

```python
from django.db import models


class User(models.Model):
    id = models.IntegerField()
    username = models.CharField()
    password = models.CharField()

    class Meta:
        ordering = ["id"]
```

What we are going to care about right now is:

1. Validating and extracting values from Meta.
2. Inheritance of fields/columns

Simple Model framework pattern:

```python
class Column:
    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return f'Column(id={self.name})'

class Columns(list):
    pass

class ModelMetaOptions:
    """In django this is called just `Options`"""
    supported_opts_from_meta = [
        'db_table',
        'app_label',
        'get_latest_by',
    ]

    def __init__(self, *, meta, model):
        self.meta = meta
        self.model = model

        self._populate_from_meta()
        self._set_up_columns()

    def _populate_from_meta(self):
        """
        Populates Options values from the Meta class given on
        the __init__, only options from supported_opts_from_meta
        are populated, raises Value error if there is an option
        in Meta that is not defined in supported_opts..
        """
        opts = self.meta.__dict__.copy()
        for attr in self.meta.__dict__:
            if attr.startswith('_'):
                # We do not support dunder options, and don't
                # care about default class attrs like __doc__
                del opts[attr]

            if attr in self.supported_opts_from_meta:
                setattr(self, attr, getattr(self.meta, attr))
                del opts[attr]

        if opts:
            raise ValueError(f'Invalid Meta options exists: {opts}')

    def _set_up_columns(self):
        """
        Populates Options values from the given model on the __init__,
         we also inherit columns from the parent classes
        if they are models.
        """
        # Columns defined in the current model.
        new_columns = [
            column for column in
            self.model.__dict__.values() if isinstance(column, Column)
        ]

        new_columns = Columns(new_columns)

        # Set columns from base classes (including parents).
        for base in self.model.mro()[1:]:

            # We ignore the first one because it is itself,
            # otherwise it conflicts.
            if hasattr(base, '_meta'):
                for column in base._meta.columns:
                    if column in new_columns:
                        raise ValueError(
                            f"Column '{column}' from {self.model}"
                            f" clashes with parent model {base}"
                        )
                new_columns.extend(base._meta.columns)

        self.columns = new_columns


class ModelBase(type):
    """Metaclass for all models."""

    def __new__(cls, name, bases, attrs, **kwargs):
        super_new = super().__new__

        # Also ensure initialization is only performed 
        # for subclasses of Model (excluding Model class itself).
        parents = [b for b in bases if isinstance(b, ModelBase)]
        if not parents:
            return super_new(cls, name, bases, attrs)

        _new_class = super_new(cls, name, bases, attrs, **kwargs)
        _new_class._prepare_class()
        return _new_class
    
    def _prepare_class(cls):
        meta = getattr(cls, 'Meta', None)
        if not meta:
            raise Exception(f'{cls} does not have Meta class')

        opts = ModelMetaOptions(meta=meta, model=cls)
        setattr(cls, '_meta', opts)

class Model(metaclass=ModelBase):
    pass


class Order(Model):
    id = Column('from_order')

    class Meta:
        db_table = '2'

class Order2(Order):
    ids = Column('from_order2')

    class Meta:
        db_table = 'some'

order = Order2()

print(order._meta.columns)
# [Column(id=from_order2), Column(id=from_order)]

class Order3(Order):
    class Meta:
        some_bad_opt = True
# ValueError: Invalid Meta options exists: {'some_bad_opt': True}
```

