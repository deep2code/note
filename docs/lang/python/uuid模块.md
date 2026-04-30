# Python标准库 - uuid模块完全参考手册

## 1. 模块简介

`uuid` 模块提供了 UUID（通用唯一识别码）的生成功能。UUID 是128位的数字，用于唯一标识信息，在分布式系统中广泛使用。

## 2. 核心功能

### 2.1 生成 UUID

```python
import uuid

# 生成基于时间的 UUID
uuid1 = uuid.uuid1()
print(f"UUID1: {uuid1}")

# 生成基于命名空间和名称的 UUID
uuid3 = uuid.uuid3(uuid.NAMESPACE_DNS, 'example.com')
print(f"UUID3: {uuid3}")

# 生成随机 UUID
uuid4 = uuid.uuid4()
print(f"UUID4: {uuid4}")

# 生成基于 SHA-1 的 UUID
uuid5 = uuid.uuid5(uuid.NAMESPACE_DNS, 'example.com')
print(f"UUID5: {uuid5}")
```

### 2.2 UUID 格式转换

```python
import uuid

# 生成 UUID
u = uuid.uuid4()

# 转换为字符串
uuid_str = str(u)
print(f"字符串: {uuid_str}")

# 转换为十六进制
uuid_hex = u.hex
print(f"十六进制: {uuid_hex}")

# 转换为字节
uuid_bytes = u.bytes
print(f"字节: {uuid_bytes}")

# 从字符串创建 UUID
u2 = uuid.UUID(uuid_str)
print(f"从字符串创建: {u2}")
```

### 2.3 应用场景

```python
import uuid

# 生成唯一文件名
def generate_unique_filename(extension):
    return f"{uuid.uuid4()}.{extension}"

filename = generate_unique_filename('txt')
print(f"唯一文件名: {filename}")

# 生成数据库主键
def generate_primary_key():
    return str(uuid.uuid4())

primary_key = generate_primary_key()
print(f"主键: {primary_key}")
```

`uuid` 模块提供了生成 UUID 的标准方法，适用于需要唯一标识符的各种场景，如数据库主键、文件名、会话标识等。