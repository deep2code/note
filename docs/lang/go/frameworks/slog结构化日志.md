# slog：Go 1.21+ 结构化日志完全指南

> Go 1.21 引入了标准库slog，这是Go官方首次提供结构化日志支持。slog弥补了Go标准库日志的短板，与第三方日志库形成互补。本文带你深入了解slog。

---

## 一、slog简介

### 1.1 什么是slog？

slog是Go 1.21+ 引入的标准库日志包，特点：

| 特性 | 说明 |
|------|------|
| 标准库 | 无需第三方依赖 |
| 结构化 | JSON格式输出 |
| 可插拔 | 自定义Handler |
| 级别支持 | Debug-Error |

### 1.2 定位

slog不是要替代logrus/zap，而是提供基础能力：

```
标准库log -> slog (标准库)
第三方库 -> logrus/zap (更丰富)
```

---

## 二、快速开始

### 2.1 最简示例

```go
package main

import (
    "log/slog"
    "os"
)

func main() {
    // 输出到stdout
    slog.Info("hello", "name", "world")
}
```

**输出**：

```
2024/01/15 10:30:00 INF hello name=world
```

### 2.2 基础日志

```go
slog.Debug("debug message", "key", "value")
slog.Info("info message", "key", "value")
slog.Warn("warning message", "key", "value")
slog.Error("error message", "key", "value")
```

---

## 三、日志级别

### 3.1 Level定义

```go
type Level int8

const (
    LevelDebug Level = -4
    LevelInfo  Level = 0
    LevelWarn  Level = 4
    LevelError Level = 8
)
```

### 3.2 设置级别

```go
// 设置全局级别
slog.SetDefault(slog.New(
    slog.HandlerOptions{Level: slog.LevelInfo}.NewJSONHandler(os.Stdout),
))
```

### 3.3 条件日志

```go
slog.Log(context.Background(), slog.LevelDebug, "debug", "key", "value")
```

---

## 四、Handler

### 4.1 JSON Handler

```go
handler := slog.NewJSONHandler(os.Stdout, nil)
logger := slog.New(handler)

logger.Info("hello", "name", "world")
// {"time":"2024-01-15T10:30:00Z","level":"INFO","msg":"hello","name":"world"}
```

### 4.2 Text Handler

```go
handler := slog.NewTextHandler(os.Stdout, nil)
logger := slog.New(handler)

logger.Info("hello", "name", "world")
// time=2024-01-15T10:30:00Z level=INFO msg=hello name=world
```

### 4.3 自定义Handler

```go
type CustomHandler struct {
    opts *slog.HandlerOptions
}

func (h *CustomHandler) Handle(ctx context.Context, r slog.Record) error {
    // 自定义处理
    return nil
}
```

---

## 五、Attr与Value

### 5.1 基础Attr

```go
slog.String("key", "value")
slog.Int("key", 123)
slog.Bool("key", true)
slog.Float64("key", 3.14)
slog.Duration("key", time.Second)
slog.Time("key", time.Now())
```

### 5.2 复杂Attr

```go
slog.Any("key", map[string]int{"a":1})
slog.Group("group", "key1", "value1", "key2", "value2")
```

---

## 六、实战技巧

### 6.1 Logger封装

```go
type Logger struct {
    *slog.Logger
}

func NewLogger() *Logger {
    return &Logger{slog.NewJSONHandler(os.Stdout, nil)}
}

func (l *Logger) With(key string, value interface{}) *Logger {
    return &Logger{l.Logger.With(key, value)}
}

var logger = NewLogger()

logger.Info("hello", "name", "world")
```

### 6.2 ctx传递

```go
func handleRequest(ctx context.Context) {
    ctx = slog.WithContext(ctx, logger)
    
    // 子请求
    handleSubRequest(ctx)
}

func handleSubRequest(ctx context.Context) {
    slog.InfoContext(ctx, "sub request")
}
```

### 6.3 分组输出

```go
slog.Info("hello",
    "user", slog.Group("user", "id", 1, "name", "zhangsan"),
)

// {"msg":"hello","user":{"id":1,"name":"zhangsan"}}
```

---

## 七、与第三方库对比

| 特性 | slog | logrus | zap |
|------|------|-------|------|-----|
| 依赖 | 无 | 第三方 | 第三方 |
| 性能 | 中 | 低 | 高 |
| Handler | 基础 | 丰富 | 丰富 |
| 级别 | 4级 | 7级 | 7级 |

**选择建议**：
- 简单需求 -> slog
- 复杂需求 -> zap
- 快速开发 -> logrus

---

slog是Go 1.21+ 的结构化日志新选择：

1. **标准库**：无需依赖
2. **结构化**：JSON输出
3. **可扩展**：Handler自定义
4. **未来可期**：持续改进

标准库日志的新里程碑！

---

>

---

# logrus：Go语言日志库的实战指南
> 在Go语言开发中，日志是排查问题的第一手段。一个好的日志库应该满足：高性能、易用、可配置、可扩展。logrus正是这样一款库——它不仅是GitHub上最受欢�的Go日志库，还被Kubernetes、Docker等顶级项目采用。
## 一、logrus简介
### 1.1 为什么选择logrus？
Go标准库提供了`log`包，功能基本但过于简单：
// 标准库log
log.Println("message")  // 只输出到stderr，无法配置级别
log.Printf("user: %s", user)  // 无法结构化日志
logrus提供了更强大的能力：
| 日志级别 | Debug、Info、Warn、Error、Fatal、Panic |
| 结构化日志 | JSON格式支持日志分析 |
| 可插拔钩子 | 可自定义输出到文件、数据库、云服务 |
| 线程安全 | 协程安全 |
| 字段记录 | 统一的日志字段 |
### 1.2 安装
```bash
go get github.com/sirupsen/logrus
## 二、基础用法
    log "github.com/sirupsen/logrus"
    log.Info("Hello logrus!")
    log.Warn("This is a warning")
    log.Error("This is an error")
输出：
INFO[0000] Hello logrus! ansi=<0m>
WARN[0000] This is a warning ansi=<0m>
ERROR[0000] This is an error ansi=<0m>
### 2.2 日志级别
logrus提供六个日志级别：
log.Trace("Trace message")  // 最详细
log.Debug("Debug message") // 调试信息
log.Info("Info message")   // 一般信息
log.Warn("Warn message")  // 警告
log.Error("Error message") // 错误
log.Fatal("Fatal message") // 致命错误（会exit）
log.Panic("Panic message") // 恐慌（会panic）
**设置全局级别**：
// 设置日志级别为Info（不输出Debug）
log.SetLevel(log.InfoLevel)
### 2.3 格式化输出
// 文本格式（默认）
log.SetFormatter(&log.TextFormatter{
    FullTimestamp: true,
    TimestampFormat: "2006-01-02 15:04:05",
// JSON格式（适合日志收集）
log.SetFormatter(&log.JSONFormatter{
    TimestampFormat: "2006-01-02T15:04:05Z07:00",
**JSON格式输出**：
```json
{"level":"info","msg":"login success","time":"2024-01-15T10:30:00+08:00","userId":1001}
## 三、高级特性
### 3.1 字段记录
结构化日志的核心：使用`WithField`添加通用字段。
// 单字段
log.WithField("userId", 1001).Info("login success")
// 多字段（推荐）
log.WithFields(log.Fields{
    "userId":  1001,
    "username": "zhangsan",
    "ip":      "192.168.1.100",
}).Info("login success")
**实际应用场景**：
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
### 3.2 性能优化：避免每次分配
**❌ 错误示范**：每次都创建新实例
func badLog() {
    log.WithFields(log.Fields{
        "userId": userId,
    }).Info("login")  // 每次都分配新对象
**✓ 正确示范**：复用logger实例
// 创建专用logger
var userLog = log.WithFields(log.Fields{
    "module": "user",
func goodLog(userId int) {
    userLog.WithField("userId", userId).Info("login")
### 3.3 自定义输出
logrus支持自定义Hooks将日志发送到任何地方：
// 1. 文件Hook示例
type FileHook struct {
    file *os.File
func (hook *FileHook) Levels() []log.Level {
    return log.AllLevels
func (hook *FileHook) Fire(entry *log.Entry) error {
    msg := entry.Message + "\n"
    hook.file.WriteString(msg)
// 2. 注册Hook
log.AddHook(&FileHook{file: f})
## 四、实战技巧
### 4.1 日志轮转
推荐使用第三方库`lumberjack`：
    "github.com/natefinch/lumberjack"
log.SetOutput(&lumberjack.Logger{
    Filename:   "/var/log/app.log",
    MaxSize:   100,   // MB
    MaxBackups: 30,    // 保留30个
    MaxAge:    7,     // 保留7天
    Compress:  true,   // 压缩
### 4.2 隐藏敏感信息
生产环境中需要过滤敏感信息：
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
### 4.3 性能建议
| 建议 | 说明 |
| 用`log.SetLevel()`控制输出 | 生产环境关闭Debug |
| 用`sync.Pool`复用对象 | 高并发场景 |
| JSON格式可使用`msgpack` | 更快的序列化 |
| 日志写入用缓冲IO | 减少系统调用 |
## 五、与标准库对比
| 特性 | logrus | 标准库log |
|------|-------|----------|
| 日志级别 | ✓ | ✗ |
| 结构化日志 | ✓ | ✗ |
| 可扩展Hooks | ✓ | ✗ |
| 性能 | 高 | 很高 |
| 依赖 | 第三方 | 标准库 |
- 小项目、快速开发 -> 标准库log
- 中大型项目、需要日志分析 -> logrus
- 超高性能场景 -> zerolog
logrus是Go语言日志库的"事实标准"：
1. **简单易用**：API直观，上手快
2. **功能强大**：级别、字段、Hooks
3. **生态丰富**：与Kubernetes、Docker集成
4. **生产验证**：千万级服务验证
掌握logrus，让你的日志记录更高效、排查问题更轻松！

---

# zerolog：Go语言超高性能日志库的完全指南
> 在Go语言日志库中，追求极致性能的首选是zerolog。它是目前Go语言最快的日志库，比标准库快200倍，比logrus快50倍。本文带你深入了解zerolog。
## 一、zerolog简介
### 1.1 为什么选择zerolog？
zerolog是rs/zerolog团队开发的超高性能日志库，特点：
| 超高性能 | 200倍于标准库 |
| 零分配 | 最小内存分配 |
| JSON输出 | 原生JSON格式 |
| 链式API | 流畅的API |
性能对比：
| 库 | 操作/纳秒 | 分配 |
|------|-----------|------|
| 标准库 | 1200 | 12 |
| logrus | 2200 | 28 |
| zap | 400 | 4 |
| **zerolog** | **80** | **0** |
### 2.1 安装
```bash
go get github.com/rs/zerolog
### 2.2 最简示例
    "github.com/rs/zerolog"
    // 创建日志输出到stdout
    log := zerolog.New(os.Stdout).With().Timestamp().Logger()
    log.Info().Str("name", "world").Msg("Hello")
```json
{"level":"info","name":"world","time":1705312800,"message":"Hello"}
## 三、基础用法
### 3.1 日志级别
log.Debug().Msg("debug message")
log.Info().Msg("info message")
log.Warn().Msg("warn message")
log.Error().Msg("error message")
log.Fatal().Msg("fatal message")  // 会panic
log.Panic().Msg("panic message") // 会panic
### 3.2 字段添加
// 单字段
log.Info().Str("name", "zhangsan").Msg("user created")
log.Info().Int("age", 25).Msg("user info")
log.Info().Bool("active", true).Msg("user status")
log.Info().Float64("score", 98.5).Msg("user score")
// 多字段（推荐）
log.Info().
    Str("name", "zhangsan").
    Int("age", 25).
    Msg("user created")
// 接口字段
log.Log().Interface("data", map[string]int{"a":1}).Msg("data")
### 3.3 格式化输出
// Console格式（人类可读）
console := zerolog.ConsoleWriter{Output: os.Stdout}
log := zerolog.New(console).With().Timestamp().Logger()
log.Info().Str("name", "world").Msg("Hello")
// 输出：
// 2024/01/15 10:30:00 INFO Hello name=world
## 四、高级特性
### 4.1 全局日志
// 设置全局日志
zerolog.SetGlobalLevel(zerolog.InfoLevel)
// 全局日志别名
func Info() *zerolog.Event {
    return zerolog.Info()
// 使用
zerolog.Info().Str("name", "world").Msg("Hello")
### 4.2 上下文
// 创建带上下文的日志
logger := log.With().
    Str("app", "myapp").
    Str("version", "1.0.0").
    Logger()
logger.Info().Str("name", "world").Msg("Hello")
// 输出: {"app":"myapp","version":"1.0.0","level":"info","name":"world","message":"Hello"}
### 4.3 条件日志
// 仅DEBUG级别输出
log.Debug().Msg("debug info")
// 条件日志
if log.Debug().Enabled() {
    log.Debug().Str("expensive", compute()).Msg("debug")
### 4.4 错误日志
err := errors.New("something went wrong")
log.Error().Err(err).Msg("operation failed")
// 输出包含堆栈
log.Error().
    Stack().
    Err(err).
    Msg("operation failed")
## 五、实战技巧
### 5.1 初始化
    "github.com/rs/zerolog"
var log = zerolog.New(os.Stdout).With().Timestamp().Logger()
func init() {
    // 设置日志级别
    zerolog.SetGlobalLevel(zerolog.InfoLevel)
    // JSON输出
    // zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
### 5.2 文件输出
file, _ := os.OpenFile(
    "app.log",
    os.O_CREATE|os.O_WRONLY|os.O_APPEND,
    0644,
log := zerolog.New(file).With().Timestamp().Logger()
### 5.3 日志轮转
import "gopkg.in/natefinch/lumberjack.v2"
logger := zerolog.New(
    lumberjack.Logger{
        Filename:   "app.log",
        MaxSize:   100,  // MB
        MaxBackups: 30,
        MaxAge:     7,
    },
).With().Timestamp().Logger()
## 六、与zap/logrus对比
| 特性 | zerolog | zap | logrus |
|------|--------|-----|------|-------|
| 性能 | 最快 | 快 | 慢 |
| API风格 | 链式 | 结构化 | 结构化 |
| JSON | 原生 | 原生 | 需配置 |
| Console | ✓ | ✓ | ✓ |
| 内存分配 | 0 | 4 | 28 |
- 极致性能 -> zerolog
- 平衡性能 -> zap
zerolog是Go语言日志库的"性能王者"：
1. **极致性能**：零分配日志
2. **JSON原生**：高效序列化
3. **链式API**：优雅流畅
4. **生产验证**：高频服务验证
追求极致性能的首选！