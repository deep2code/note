# Python标准库 - decimal模块完全参考手册

## 1. 模块简介

`decimal` 模块提供了十进制浮点运算的支持。与二进制浮点数相比，十进制浮点数更适合财务计算和其他需要精确十进制表示的场景。

## 2. 核心功能

### 2.1 基本操作

```python
from decimal import Decimal, getcontext

# 创建 Decimal 对象
a = Decimal('0.1')
b = Decimal('0.2')
print(a + b)  # 输出: 0.3

# 设置精度
getcontext().prec = 6
result = Decimal('1') / Decimal('7')
print(result)  # 输出: 0.142857
```

### 2.2 财务计算

```python
from decimal import Decimal

# 财务计算示例
price = Decimal('19.99')
quantity = Decimal('3')
tax_rate = Decimal('0.08')

subtotal = price * quantity
tax = subtotal * tax_rate
total = subtotal + tax

print(f"小计: {subtotal}")
print(f"税费: {tax}")
print(f"总计: {total}")
```

`decimal` 模块提供了精确的十进制浮点运算，特别适合财务计算和其他需要精确十进制表示的场景。