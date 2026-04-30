# Python标准库 - pickle模块完全参考手册

## 1. 模块简介

`pickle` 模块提供了 Python 对象的序列化和反序列化功能。它可以将 Python 对象转换为字节流，也可以将字节流还原为 Python 对象。

## 2. 核心功能

### 2.1 基本操作

```python
import pickle

# 序列化对象
data = {'name': '张三', 'age': 25, 'city': '北京'}
serialized = pickle.dumps(data)
print(serialized)

# 反序列化对象
deserialized = pickle.loads(serialized)
print(deserialized)
```

### 2.2 文件操作

```python
import pickle

# 保存到文件
data = {'name': '张三', 'age': 25}
with open('data.pkl', 'wb') as f:
    pickle.dump(data, f)

# 从文件加载
with open('data.pkl', 'rb') as f:
    loaded_data = pickle.load(f)
print(loaded_data)
```

## 3. 安全警告

**警告**: pickle 模块不安全。不要反序列化来自不可信来源的数据，因为这可能导致任意代码执行。

`pickle` 模块提供了强大的对象序列化功能，但需要注意安全性问题，不要处理来自不可信来源的数据。