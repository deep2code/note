# Python标准库 - timeit模块完全参考手册

## 1. 模块简介

`timeit` 模块提供了测量代码执行时间的功能。它通过多次执行代码来消除系统负载等因素的影响，提供更准确的性能测量结果。

## 2. 核心功能

### 2.1 命令行使用

```bash
# 测量代码执行时间
python -m timeit "[x**2 for x in range(1000)]"
```

### 2.2 编程接口

```python
import timeit

# 测量代码执行时间
execution_time = timeit.timeit("[x**2 for x in range(1000)]", number=1000)
print(f"执行时间: {execution_time} 秒")

# 使用 setup
code = """
result = []
for x in range(1000):
    result.append(x**2)
"""
execution_time = timeit.timeit(code, number=1000)
print(f"执行时间: {execution_time} 秒")
```

### 2.3 Timer 类

```python
from timeit import Timer

t = Timer("[x**2 for x in range(1000)]")
print(t.timeit(number=1000))

# 重复测量多次
print(t.repeat(repeat=3, number=1000))
```

`timeit` 模块是测量 Python 代码执行时间的标准工具，提供了简单且准确的性能测量方法。