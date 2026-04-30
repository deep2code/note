# Python标准库 - queue模块完全参考手册

## 1. 模块简介

`queue` 模块提供了多种队列实现，包括 FIFO 队列、LIFO 队列和优先级队列。这些队列都是线程安全的，适用于多线程编程。

## 2. 核心功能

### 2.1 FIFO 队列

```python
from queue import Queue

# 创建队列
q = Queue()

# 添加元素
q.put('item1')
q.put('item2')

# 获取元素
print(q.get())  # 输出: item1
print(q.get())  # 输出: item2
```

### 2.2 LIFO 队列（栈）

```python
from queue import LifoQueue

# 创建栈
stack = LifoQueue()

# 压栈
stack.put('item1')
stack.put('item2')

# 弹栈
print(stack.get())  # 输出: item2
print(stack.get())  # 输出: item1
```

### 2.3 优先级队列

```python
from queue import PriorityQueue

# 创建优先级队列
pq = PriorityQueue()

# 添加元素（数字越小优先级越高）
pq.put((3, '低优先级任务'))
pq.put((1, '高优先级任务'))
pq.put((2, '中优先级任务'))

# 获取元素
print(pq.get())  # 输出: (1, '高优先级任务')
```

`queue` 模块提供了线程安全的队列实现，适用于多线程编程和任务调度等场景。