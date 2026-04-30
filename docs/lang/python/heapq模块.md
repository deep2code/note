# Python标准库 - heapq模块完全参考手册

## 1. 模块简介

`heapq` 模块提供了堆队列算法的实现。堆是一种特殊的树形数据结构，其中父节点的值总是小于或等于子节点的值（最小堆）。

## 2. 核心功能

### 2.1 基本操作

```python
import heapq

# 创建堆
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)

# 弹出最小元素
print(heapq.heappop(heap))  # 输出: 1

# 将列表转换为堆
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)
print(nums)  # 输出: [1, 1, 2, 3, 5, 9, 4, 6]
```

### 2.2 获取最大/最小元素

```python
import heapq

nums = [3, 1, 4, 1, 5, 9, 2, 6]

# 获取3个最大元素
print(heapq.nlargest(3, nums))  # 输出: [9, 6, 5]

# 获取3个最小元素
print(heapq.nsmallest(3, nums))  # 输出: [1, 1, 2]
```

`heapq` 模块提供了高效的堆队列算法实现，适用于优先队列、Top K 问题等场景。