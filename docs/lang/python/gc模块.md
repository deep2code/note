# Python标准库 - gc模块完全参考手册

## 1. 模块简介

`gc` 模块提供了垃圾回收器的接口。Python 使用引用计数和循环垃圾回收来管理内存，`gc` 模块允许你控制垃圾回收器的行为。

## 2. 核心功能

### 2.1 基本操作

```python
import gc

# 获取垃圾回收统计信息
print(gc.get_stats())

# 手动运行垃圾回收
collected = gc.collect()
print(f"回收了 {collected} 个对象")

# 获取垃圾回收阈值
print(gc.get_threshold())
```

### 2.2 控制垃圾回收

```python
import gc

# 禁用垃圾回收
gc.disable()

# 执行一些操作...

# 重新启用垃圾回收
gc.enable()

# 设置垃圾回收阈值
gc.set_threshold(700, 10, 10)
```

`gc` 模块提供了对 Python 垃圾回收器的控制，适用于需要精细内存管理的场景。