# Python标准库 - shutil模块完全参考手册

## 1. 模块简介

`shutil` 模块提供了高级的文件操作功能，包括文件复制、移动、删除和压缩等。它是对 `os` 模块的补充，提供了更方便的文件操作接口。

## 2. 核心功能

### 2.1 文件复制

```python
import shutil

# 复制文件
shutil.copy('source.txt', 'dest.txt')

# 复制文件并保留元数据
shutil.copy2('source.txt', 'dest.txt')

# 复制整个目录
shutil.copytree('source_dir', 'dest_dir')
```

### 2.2 文件移动和删除

```python
import shutil

# 移动文件
shutil.move('source.txt', 'dest.txt')

# 删除目录
shutil.rmtree('dir_to_remove')
```

### 2.3 磁盘操作

```python
import shutil

# 获取磁盘使用情况
total, used, free = shutil.disk_usage('/')
print(f"总空间: {total // (2**30)} GB")
print(f"已使用: {used // (2**30)} GB")
print(f"可用空间: {free // (2**30)} GB")
```

`shutil` 模块提供了高级的文件操作功能，是处理文件和目录的利器。