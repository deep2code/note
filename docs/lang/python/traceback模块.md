# Python标准库 - traceback模块完全参考手册

## 1. 模块简介

`traceback` 模块提供了提取、格式化和打印 Python 程序堆栈跟踪信息的功能。它对于调试和错误处理非常有用。

## 2. 核心功能

### 2.1 打印异常信息

```python
import traceback

try:
    1 / 0
except Exception as e:
    # 打印完整的堆栈跟踪
    traceback.print_exc()
```

### 2.2 获取异常信息

```python
import traceback
import sys

try:
    1 / 0
except Exception as e:
    # 获取异常信息
    exc_type, exc_value, exc_traceback = sys.exc_info()
    
    # 格式化异常信息
    formatted = traceback.format_exception(exc_type, exc_value, exc_traceback)
    print(''.join(formatted))
```

### 2.3 格式化堆栈

```python
import traceback

# 获取当前堆栈
stack = traceback.extract_stack()
print(stack)

# 格式化堆栈
formatted = traceback.format_list(stack)
print(''.join(formatted))
```

`traceback` 模块提供了强大的异常处理和调试功能，是开发和维护 Python 程序的重要工具。