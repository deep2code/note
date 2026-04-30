# Python标准库 - statistics模块完全参考手册

## 1. 模块简介

`statistics` 模块提供了基本的统计计算功能，包括均值、中位数、方差、标准差等。它是 Python 3.4 引入的标准库模块。

## 2. 核心功能

### 2.1 集中趋势度量

```python
import statistics

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 均值
print(statistics.mean(data))  # 输出: 5.5

# 中位数
print(statistics.median(data))  # 输出: 5.5

# 众数
print(statistics.mode([1, 2, 2, 3, 3, 3, 4]))  # 输出: 3
```

### 2.2 离散程度度量

```python
import statistics

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# 方差
print(statistics.variance(data))

# 标准差
print(statistics.stdev(data))

# 总体方差
print(statistics.pvariance(data))

# 总体标准差
print(statistics.pstdev(data))
```

`statistics` 模块提供了基本的统计计算功能，适用于简单的数据分析场景。对于更复杂的统计分析，建议使用 `numpy` 或 `scipy` 库。