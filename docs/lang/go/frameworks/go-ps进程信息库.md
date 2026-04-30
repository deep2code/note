# go-ps：Go语言进程信息查看利器

> 在Linux/macOS运维中，查看进程信息是基础操作。Go语言标准库缺少获取进程信息的API，而go-ps库——由HashiCorp出品的进程信息库——提供了跨平台的进程信息获取能力。本文带你深入了解。

---

## 一、go-ps简介

### 1.1 为什么需要go-ps？

Go标准库的`os`包只提供了有限的进程信息：

```go
os.Getpid()   // 获取当前进程ID
os.Getppid()  // 获取父进程ID
os.Getwd()    // 获取工作目录
```

对于更详细的进程信息（内存、CPU、命令行等），无能为力。

### 1.2 go-ps的能力

go-ps提供了完整的进程信息：

| 信息 | 说明 |
|------|------|
| PID | 进程ID |
| PPID | 父进程ID |
| Executable | 可执行文件名 |
| Command | 命令行参数 |
| Env | 环境变量 |
| User | 进程所有者 |

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/mitchellh/go-ps/v3
```

### 2.2 最简示例

```go
package main

import (
    "fmt"
    "github.com/mitchellh/go-ps/v3"
)

func main() {
    // 获取当前进程
    process, _ := ps.FindProcess(os.Getpid())
    fmt.Printf("Process: %s (PID: %d)\n", process.Executable(), process.PID())
    
    // 列出所有进程
    processes, _ := ps.Processes()
    fmt.Printf("Total processes: %d\n", len(processes))
    for _, p := range processes {
        fmt.Printf("  [%d] %s\n", p.PID(), p.Executable())
    }
}
```

**输出示例**：

```
Process: go (PID: 12345)
Total processes: 502
  [0] launchd
  [1] kernel_task
  [123] Finder
  [456] Safari
  [12345] go
```

---

## 三、核心API

### 3.1 Process接口

```go
type Process interface {
    PID() int              // 进程ID
    PPID() int             // 父进程ID
    Executable() string    // 可执行文件名
    Path() string         // 可执行文件路径
}
```

### 3.2 查找进程

```go
// 按PID查找
process, err := ps.FindProcess(12345)
if err == nil {
    fmt.Println(process.Executable())
}

// 根据进程名查找（自定义实现）
func findByName(name string) ([]Process, error) {
    all, _ := ps.Processes()
    var result []Process
    for _, p := range all {
        if strings.Contains(p.Executable(), name) {
            result = append(result, p)
        }
    }
    return result, nil
}
```

### 3.3 进程列表

```go
// 获取所有进程
processes, err := ps.Processes()

// 获取当前进程树
func printProcessTree(pid int, processes []Process, indent int) {
    for _, p := range processes {
        if p.PPID() == pid {
            fmt.Printf("%s├─%s (%d)\n", strings.Repeat("  ", indent), p.Executable(), p.PID())
            printProcessTree(p.PID(), processes, indent+1)
        }
    }
}
```

---

## 四、跨平台支持

go-ps支持多平台：

| 平台 | 实现 | 说明 |
|------|------|------|
| Linux | 读取/proc | 基于Linux procfs |
| macOS | libproc | 基于Darwin libproc |
| Windows | Windows API | 基于Win32 API |

**无需平台判断**，同一份代码自动适配：

```go
// 代码无需修改，自动适配当前平台
processes, _ := ps.Processes()
for _, p := range processes {
    fmt.Println(p.PID(), p.Executable())
}
```

---

## 五、实战应用

### 5.1 进程监控

```go
// 监控特定进程是否存在
func isProcessRunning(name string) bool {
    processes, _ := ps.Processes()
    for _, p := range processes {
        if p.Executable() == name {
            return true
        }
    }
    return false
}

// 定时检查并重启
func monitorProcess(name string) {
    ticker := time.NewTicker(5 * time.Second)
    defer ticker.Stop()
    
    for range ticker.C {
        if !isProcessRunning(name) {
            fmt.Printf("[%s] process not found, starting...\n", time.Now())
            // 启动进程
            cmd := exec.Command(name)
            cmd.Start()
        }
    }
}
```

### 5.2 进程树展示

```go
// 打印进程树
func PrintProcessTree() {
    processes, err := ps.Processes()
    if err != nil {
        log.Fatal(err)
    }
    
    // 构建PID到进程的映射
    pmap := make(map[int]ps.Process)
    for _, p := range processes {
        pmap[p.PID()] = p
    }
    
    // 找到根进程（PPID=0或PPID=1）
    var printTree func(ppid int, indent int)
    printTree = func(ppid int, indent int) {
        for _, p := range processes {
            if p.PPID() == ppid {
                fmt.Printf("%s%d %s\n", strings.Repeat("  ", indent), p.PID(), p.Executable())
                printTree(p.PID(), indent+1)
            }
        }
    }
    
    // 从init(1)开始打印
    printTree(1, 0)
}
```

### 5.3 资源清理

```go
// 杀死僵尸进程
func killZombies() {
    processes, _ := ps.Processes()
    for _, p := range processes {
        // 简单的判定：进程名为 defunct
        if p.Executable() == "defunct" {
            fmt.Printf("Killing zombie: %d\n", p.PID())
            syscall.Kill(p.PID(), syscall.SIGKILL)
        }
    }
}
```

---

## 六、注意事项

### 6.1 权限问题

| 平台 | 权限要求 |
|------|----------|
| Linux | 读取/proc无需root |
| macOS | 部分信息需要root |
| Windows | 管理员权限更完整 |

### 6.2 性能考量

```go
// ❌ 错误：频繁调用
for {
    processes, _ := ps.Processes()  // 每次都扫描
    // ...
    time.Sleep(time.Second)
}

// ✓ 正确：缓存结果
processes, _ := ps.Processes()  // 一次扫描
for _, p := range processes {
    // 使用缓存...
}
```

---

## 七、类似库对比

| 库 | 说明 |
|----|------|
| go-ps | 最流行的进程信息库 |
| procfs | Linux专属，更详细 |
| gopsutil | 综合系统信息库 |

**选择建议**：
- 简单进程信息 -> go-ps
- Linux深度信息 -> procfs
- 综合系统信息 -> gopsutil

---

go-ps是Go语言获取进程信息的首选库：

1. **跨平台**：Linux/macOS/Windows自动适配
2. **简单易用**：API直观
3. **轻量级**：无外部依赖
4. **HashiCorp维护**：质量有保障

掌握go-ps，让你的Go程序也能"看到"系统进程！

---

>