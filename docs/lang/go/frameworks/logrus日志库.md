# logrus：Go语言日志库的实战指南

> 在Go语言开发中，日志是排查问题的第一手段。一个好的日志库应该满足：高性能、易用、可配置、可扩展。logrus正是这样一款库——它不仅是GitHub上最受欢�的Go日志库，还被Kubernetes、Docker等顶级项目采用。

---

## 一、logrus简介

### 1.1 为什么选择logrus？

Go标准库提供了`log`包，功能基本但过于简单：

```go
// 标准库log
log.Println("message")  // 只输出到stderr，无法配置级别
log.Printf("user: %s", user)  // 无法结构化日志
```

logrus提供了更强大的能力：

| 特性 | 说明 |
|------|------|
| 日志级别 | Debug、Info、Warn、Error、Fatal、Panic |
| 结构化日志 | JSON格式支持日志分析 |
| 可插拔钩子 | 可自定义输出到文件、数据库、云服务 |
| 线程安全 | 协程安全 |
| 字段记录 | 统一的日志字段 |

### 1.2 安装

```bash
go get github.com/sirupsen/logrus
```

---

## 二、基础用法

### 2.1 最简示例

```go
package main

import (
    log "github.com/sirupsen/logrus"
)

func main() {
    log.Info("Hello logrus!")
    log.Warn("This is a warning")
    log.Error("This is an error")
}
```

输出：

```
INFO[0000] Hello logrus! ansi=<0m>
WARN[0000] This is a warning ansi=<0m>
ERROR[0000] This is an error ansi=<0m>
```

### 2.2 日志级别

logrus提供六个日志级别：

```go
log.Trace("Trace message")  // 最详细
log.Debug("Debug message") // 调试信息
log.Info("Info message")   // 一般信息
log.Warn("Warn message")  // 警告
log.Error("Error message") // 错误
log.Fatal("Fatal message") // 致命错误（会exit）
log.Panic("Panic message") // 恐慌（会panic）
```

**设置全局级别**：

```go
// 设置日志级别为Info（不输出Debug）
log.SetLevel(log.InfoLevel)
```

### 2.3 格式化输出

```go
// 文本格式（默认）
log.SetFormatter(&log.TextFormatter{
    FullTimestamp: true,
    TimestampFormat: "2006-01-02 15:04:05",
})

// JSON格式（适合日志收集）
log.SetFormatter(&log.JSONFormatter{
    TimestampFormat: "2006-01-02T15:04:05Z07:00",
})
```

**JSON格式输出**：

```json
{"level":"info","msg":"login success","time":"2024-01-15T10:30:00+08:00","userId":1001}
```

---

## 三、高级特性

### 3.1 字段记录

结构化日志的核心：使用`WithField`添加通用字段。

```go
// 单字段
log.WithField("userId", 1001).Info("login success")

// 多字段（推荐）
log.WithFields(log.Fields{
    "userId":  1001,
    "username": "zhangsan",
    "ip":      "192.168.1.100",
}).Info("login success")
```

**实际应用场景**：

```go
func handleRequest(w http.ResponseWriter, r *http.Request) {
    requestId := r.Header.Get("X-Request-ID")
    userId := getUserId(r)
    
    log.WithFields(log.Fields{
        "requestId": requestId,
        "method":    r.Method,
        "url":       r.URL.Path,
    }).Info("request started")
    
    // 业务处理...
    
    log.WithFields(log.Fields{
        "requestId": requestId,
        "userId":    userId,
    }).Info("request completed")
}
```

### 3.2 性能优化：避免每次分配

**❌ 错误示范**：每次都创建新实例

```go
func badLog() {
    log.WithFields(log.Fields{
        "userId": userId,
    }).Info("login")  // 每次都分配新对象
}
```

**✓ 正确示范**：复用logger实例

```go
// 创建专用logger
var userLog = log.WithFields(log.Fields{
    "module": "user",
})

func goodLog(userId int) {
    userLog.WithField("userId", userId).Info("login")
}
```

### 3.3 自定义输出

logrus支持自定义Hooks将日志发送到任何地方：

```go
// 1. 文件Hook示例
type FileHook struct {
    file *os.File
}

func (hook *FileHook) Levels() []log.Level {
    return log.AllLevels
}

func (hook *FileHook) Fire(entry *log.Entry) error {
    msg := entry.Message + "\n"
    hook.file.WriteString(msg)
    return nil
}

// 2. 注册Hook
log.AddHook(&FileHook{file: f})
```

---

## 四、实战技巧

### 4.1 日志轮转

推荐使用第三方库`lumberjack`：

```go
import (
    "github.com/natefinch/lumberjack"
)

log.SetOutput(&lumberjack.Logger{
    Filename:   "/var/log/app.log",
    MaxSize:   100,   // MB
    MaxBackups: 30,    // 保留30个
    MaxAge:    7,     // 保留7天
    Compress:  true,   // 压缩
})
```

### 4.2 隐藏敏感信息

生产环境中需要过滤敏感信息：

```go
type SafeFormatter struct{}

func (f *SafeFormatter) Format(entry *log.Entry) ([]byte, error) {
    // 过滤敏感字段
    if _, ok := entry.Data["password"]; ok {
        entry.Data["password"] = "***"
    }
    if _, ok := entry.Data["token"]; ok {
        entry.Data["token"] = "***"
    }
    
    return json.Marshal(entry)
}
```

### 4.3 性能建议

| 建议 | 说明 |
|------|------|
| 用`log.SetLevel()`控制输出 | 生产环境关闭Debug |
| 用`sync.Pool`复用对象 | 高并发场景 |
| JSON格式可使用`msgpack` | 更快的序列化 |
| 日志写入用缓冲IO | 减少系统调用 |

---

## 五、与标准库对比

| 特性 | logrus | 标准库log |
|------|-------|----------|
| 日志级别 | ✓ | ✗ |
| 结构化日志 | ✓ | ✗ |
| 可扩展Hooks | ✓ | ✗ |
| 性能 | 高 | 很高 |
| 依赖 | 第三方 | 标准库 |

**选择建议**：
- 小项目、快速开发 -> 标准库log
- 中大型项目、需要日志分析 -> logrus
- 超高性能场景 -> zerolog

---

logrus是Go语言日志库的"事实标准"：

1. **简单易用**：API直观，上手快
2. **功能强大**：级别、字段、Hooks
3. **生态丰富**：与Kubernetes、Docker集成
4. **生产验证**：千万级服务验证

掌握logrus，让你的日志记录更高效、排查问题更轻松！

---

>