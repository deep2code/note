# Python标准库 - types模块完全参考手册

## 1. 模块简介

`types` 模块提供了用于创建和操作各种类型的工具函数和类。它包含了许多与 Python 类型系统相关的工具。

## 2. 核心功能

### 2.1 创建动态类型

```python
import types

# 创建简单的类
MyClass = type('MyClass', (), {'x': 1})
obj = MyClass()
print(obj.x)  # 输出: 1

# 创建带有方法的类
def greet(self):
    return f"Hello, {self.name}!"

Person = type('Person', (), {'name': 'World', 'greet': greet})
p = Person()
print(p.greet())  # 输出: Hello, World!
```

### 2.2 创建动态函数

```python
import types

# 创建动态函数
code = compile('x + y', '<string>', 'eval')
func = types.FunctionType(code, {'x': 1, 'y': 2})

# 创建 Lambda 函数
add = types.LambdaType(code, {'x': 1, 'y': 2})
```

### 2.3 类型检查

```python
import types

# 检查函数类型
def my_func():
    pass

print(isinstance(my_func, types.FunctionType))  # 输出: True

# 检查方法类型
class MyClass:
    def my_method(self):
        pass

obj = MyClass()
print(isinstance(obj.my_method, types.MethodType))  # 输出: True
```

`types` 模块提供了与 Python 类型系统相关的工具，适用于动态类型创建和类型检查等高级场景。