# Python标准库 - csv模块完全参考手册

## 1. 模块简介

`csv` 模块提供了读写 CSV（逗号分隔值）文件的功能。CSV 是一种常见的数据交换格式，广泛用于数据存储和传输。

## 2. 核心功能

### 2.1 读取 CSV 文件

```python
import csv

# 读取 CSV 文件
with open('data.csv', 'r', newline='', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
```

### 2.2 写入 CSV 文件

```python
import csv

# 写入 CSV 文件
with open('output.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['姓名', '年龄', '城市'])
    writer.writerow(['张三', '25', '北京'])
    writer.writerow(['李四', '30', '上海'])
```

### 2.3 使用字典读写

```python
import csv

# 写入字典数据
with open('dict_output.csv', 'w', newline='', encoding='utf-8') as f:
    fieldnames = ['姓名', '年龄', '城市']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerow({'姓名': '张三', '年龄': '25', '城市': '北京'})
    writer.writerow({'姓名': '李四', '年龄': '30', '城市': '上海'})

# 读取字典数据
with open('dict_output.csv', 'r', newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

## 3. 实际应用场景

### 3.1 数据导出

```python
import csv

def export_to_csv(data, filename):
    """将数据导出到 CSV 文件"""
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(data)

# 测试
data = [
    ['姓名', '年龄', '城市'],
    ['张三', '25', '北京'],
    ['李四', '30', '上海']
]
export_to_csv(data, 'export.csv')
```

### 3.2 数据导入

```python
import csv

def import_from_csv(filename):
    """从 CSV 文件导入数据"""
    data = []
    with open(filename, 'r', newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            data.append(row)
    return data

# 测试
data = import_from_csv('export.csv')
print(data)
```

`csv` 模块是处理 CSV 文件的标准工具，提供了简单易用的接口来读写 CSV 数据。