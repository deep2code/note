# Python标准库 - enum模块完全参考手册

## 1. 模块简介

`enum` 模块提供了枚举类型的支持。枚举是一组命名常量的集合，用于表示一组相关的离散值。

## 2. 核心功能

### 2.1 基本枚举

```python
from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3

# 使用枚举
print(Color.RED)  # 输出: Color.RED
print(Color.RED.name)  # 输出: RED
print(Color.RED.value)  # 输出: 1
```

### 2.2 自动赋值

```python
from enum import Enum, auto

class Status(Enum):
    PENDING = auto()
    APPROVED = auto()
    REJECTED = auto()

print(Status.PENDING.value)  # 输出: 1
print(Status.APPROVED.value)  # 输出: 2
```

### 2.3 唯一枚举

```python
from enum import Enum, unique

@unique
class Direction(Enum):
    NORTH = 1
    SOUTH = 2
    EAST = 3
    WEST = 4
```

`enum` 模块提供了强大的枚举类型支持，使代码更具可读性和可维护性。