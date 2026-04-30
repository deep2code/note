# Python标准库 - array模块完全参考手册

## 1. 模块简介

`array` 模块提供了一种高效的数组类型，用于存储相同类型的数值数据。与列表相比，数组占用更少的内存，并且提供了更快的元素访问速度。

## 2. 核心功能

### 2.1 创建数组

```python
import array

# 创建一个整数数组（类型码 'i' 表示有符号整数）
a = array.array('i', [1, 2, 3, 4, 5])

# 创建一个浮点数数组（类型码 'd' 表示双精度浮点数）
b = array.array('d', [1.1, 2.2, 3.3])
```

### 2.2 类型码

| 类型码 | C 类型 | Python 类型 | 字节数 |
|--------|--------|------------|--------|
| 'b' | signed char | int | 1 |
| 'B' | unsigned char | int | 1 |
| 'h' | signed short | int | 2 |
| 'H' | unsigned short | int | 2 |
| 'i' | signed int | int | 2 或 4 |
| 'I' | unsigned int | int | 2 或 4 |
| 'l' | signed long | int | 4 |
| 'L' | unsigned long | int | 4 |
| 'q' | signed long long | int | 8 |
| 'Q' | unsigned long long | int | 8 |
| 'f' | float | float | 4 |
| 'd' | double | float | 8 |

### 2.3 常用方法

#### 2.3.1 基本操作

```python
# 访问元素
print(a[0])  # 输出: 1

# 修改元素
a[0] = 10
print(a)  # 输出: array('i', [10, 2, 3, 4, 5])

# 切片操作
print(a[1:3])  # 输出: array('i', [2, 3])

# 长度
print(len(a))  # 输出: 5
```

#### 2.3.2 数组操作

```python
# 追加元素
a.append(6)
print(a)  # 输出: array('i', [10, 2, 3, 4, 5, 6])

# 扩展数组
a.extend([7, 8, 9])
print(a)  # 输出: array('i', [10, 2, 3, 4, 5, 6, 7, 8, 9])

# 插入元素
a.insert(1, 11)
print(a)  # 输出: array('i', [10, 11, 2, 3, 4, 5, 6, 7, 8, 9])

# 删除元素
a.pop()  # 删除并返回最后一个元素
print(a)  # 输出: array('i', [10, 11, 2, 3, 4, 5, 6, 7, 8])

# 移除指定值
a.remove(11)
print(a)  # 输出: array('i', [10, 2, 3, 4, 5, 6, 7, 8])
```

#### 2.3.3 搜索和计数

```python
# 查找元素索引
print(a.index(5))  # 输出: 4

# 计数元素出现次数
print(a.count(2))  # 输出: 1
```

#### 2.3.4 数组转换

```python
# 转换为列表
print(a.tolist())  # 输出: [10, 2, 3, 4, 5, 6, 7, 8]

# 从列表创建数组
new_array = array.array('i', [1, 2, 3])
print(new_array)  # 输出: array('i', [1, 2, 3])
```

#### 2.3.5 字节操作

```python
# 转换为字节
bytes_data = a.tobytes()
print(bytes_data)  # 输出: b'\n\x00\x00\x00\x02\x00\x00\x00\x03\x00\x00\x00\x04\x00\x00\x00\x05\x00\x00\x00\x06\x00\x00\x00\x07\x00\x00\x00\x08\x00\x00\x00'

# 从字节创建数组
new_array = array.array('i')
new_array.frombytes(bytes_data)
print(new_array)  # 输出: array('i', [10, 2, 3, 4, 5, 6, 7, 8])
```

## 3. 实际应用场景

### 3.1 数值计算

```python
# 高效存储大量数值数据
import array

# 存储100000个整数
large_array = array.array('i', range(100000))
print(f"数组长度: {len(large_array)}")
print(f"数组占用内存: {large_array.buffer_info()[1] * large_array.itemsize} 字节")
```

### 3.2 数据序列化

```python
# 序列化数组数据
import array
import pickle

# 创建数组
arr = array.array('d', [1.1, 2.2, 3.3, 4.4, 5.5])

# 序列化
with open('array_data.pkl', 'wb') as f:
    pickle.dump(arr, f)

# 反序列化
with open('array_data.pkl', 'rb') as f:
    loaded_arr = pickle.load(f)

print(loaded_arr)  # 输出: array('d', [1.1, 2.2, 3.3, 4.4, 5.5])
```

### 3.3 二进制数据处理

```python
# 处理二进制数据
import array

# 从二进制数据创建数组
binary_data = b'\x01\x00\x00\x00\x02\x00\x00\x00\x03\x00\x00\x00'
arr = array.array('i')
arr.frombytes(binary_data)
print(arr)  # 输出: array('i', [1, 2, 3])

# 转换为二进制数据
binary_result = arr.tobytes()
print(binary_result)  # 输出: b'\x01\x00\x00\x00\x02\x00\x00\x00\x03\x00\x00\x00'
```

## 4. 性能比较

### 4.1 内存占用

```python
import array
import sys

# 列表占用内存
list_data = list(range(100000))
print(f"列表占用内存: {sys.getsizeof(list_data)} 字节")

# 数组占用内存
array_data = array.array('i', range(100000))
print(f"数组占用内存: {array_data.buffer_info()[1] * array_data.itemsize} 字节")
```

### 4.2 访问速度

```python
import array
import time

# 测试列表访问速度
list_data = list(range(1000000))
start = time.time()
for i in range(len(list_data)):
    _ = list_data[i]
end = time.time()
print(f"列表访问时间: {end - start:.6f} 秒")

# 测试数组访问速度
array_data = array.array('i', range(1000000))
start = time.time()
for i in range(len(array_data)):
    _ = array_data[i]
end = time.time()
print(f"数组访问时间: {end - start:.6f} 秒")
```

## 5. 代码优化建议

1. **选择合适的类型码**：根据数据范围选择最小的类型码，以节省内存。
2. **批量操作**：使用 `extend()` 而不是多次 `append()` 来添加多个元素。
3. **避免频繁转换**：尽量避免在数组和列表之间频繁转换。
4. **使用缓冲区协议**：对于需要与C扩展交互的场景，利用数组的缓冲区协议。

## 6. 常见问题与解决方案

### 6.1 类型错误

**问题**：尝试存储与类型码不匹配的数据。

**解决方案**：确保存储的数据类型与数组的类型码匹配。

```python
import array

# 正确示例
a = array.array('i', [1, 2, 3])

# 错误示例（将浮点数存储到整数数组）
try:
    a = array.array('i', [1.1, 2.2, 3.3])
except TypeError as e:
    print(f"错误: {e}")
```

### 6.2 内存不足

**问题**：创建过大的数组导致内存不足。

**解决方案**：对于非常大的数据集，考虑使用 `numpy` 库或分块处理。

`array` 模块是Python标准库中一个高效的数值数组实现，适用于需要存储大量相同类型数值数据的场景。它提供了与列表类似的接口，但占用更少的内存，并且在某些操作上速度更快。

### 优点
- 内存占用小
- 访问速度快
- 支持二进制数据转换
- 与C扩展兼容性好

### 缺点
- 只能存储相同类型的数据
- 功能相对简单，不如 `numpy` 强大

在需要高效处理数值数据的场景中，`array` 模块是一个轻量级且实用的选择。