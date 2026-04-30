# zap：Go语言高性能日志库的完全指南

> 在Go语言日志库中，zap是Uber开源的高性能日志库，以其超高的性能著称。相比logrus，zap性能提升10-100倍，被大量高性能服务采用。本文带你深入了解zap。

---

## 一、zap简介

### 1.1 为什么选择zap？

zap是Uber开源的高性能日志库，特点：

| 特性 | 说明 |
|------|------|
| 超高性能 | 比logrus快10-100倍 |
| 结构化日志 | JSON格式输出 |
| 多种编码 | JSON、Console |
| 原子操作 | 线程安全 |

性能对比：

| 库 | 序列化 | 写入 | 相对性能 |
|------|--------|------|----------|
| logrus | 慢 | 慢 | 1x |
| zap | 快 | 快 | 10-100x |
| zerolog | 很快 | 很快 | 50-200x |

---

## 二、快速开始

### 2.1 安装

```bash
go go get go.uber.org/zap
```

### 2.2 最简示例

```go
package main

import (
    "go.uber.org/zap"
)

func main() {
    // 创建logger
    logger, _ := zap.NewProduction()
    defer logger.Sync()
    
    // 记录日志
    logger.Info("Hello zap!", zap.String("app", "demo"))
}
```

输出（JSON格式）：

```json
{"level":"info","msg":"Hello zap!","app":"demo","ts":1705312800.123,"caller":"demo.go:15"}
```

---

## 三、日志级别

### 3.1 级别概念

zap定义了6个日志级别：

```go
zap.DebugLevel  // -1 调试
zap.InfoLevel   // 0  信息
zap.WarnLevel  // 1  警告
zap.ErrorLevel // 2  错误
zap.DPanicLevel // 3  恐慌（开发）
zap.PanicLevel // 4  恐慌（生产）
zap.FatalLevel // 5  致命
```

### 3.2 使用级别

```go
logger.Debug("debug message", zap.Any("data", data))
logger.Info("info message", zap.String("key", "value"))
logger.Warn("warning message", zap.Error(err))
logger.Error("error message", zap.Stack("stack"))
```

---

## 四、配置与构造

### 4.1 开发模式

```go
// development: 带文件行号、堆栈跟踪
logger, _ := zap.NewDevelopment()
```

### 4.2 生产模式

```go
// production: JSON格式、高性能
logger, _ := zap.NewProduction()
```

### 4.3 自定义配置

```go
config := zap.Config{
    Level:            zap.NewAtomicLevelAt(zap.InfoLevel),
    Encoding:         "json",
    OutputPaths:       []string{"stdout"},
    ErrorOutputPaths: []string{"stderr"},
    EncoderConfig: zapcore.EncoderConfig{
        TimeKey:        "ts",
        LevelKey:       "level",
        NameKey:       "logger",
        CallerKey:      "caller",
        MessageKey:     "msg",
        StacktraceKey:  "stacktrace",
        LineEnding:     zapcore.DefaultLineEnding,
        EncodeLevel:   zapcore.LowercaseLevelEncoder,
        EncodeTime:    zapcore.ISO8601TimeEncoder,
        EncodeDuration: zapcore.SecondsDurationEncoder,
    },
}
logger, _ := config.Build()
```

---

## 五、字段记录

### 5.1 常用字段

```go
// 基本类型
zap.String("key", "value")
zap.Int("age", 25)
zap.Bool("flag", true)
zap.Float64("score", 98.5)

// 复杂类型
zap.Any("data", data)
zap.Error(err)
zap.Stack("stack")
zap.Duration("latency", time.Second)

// 数组
zap.Strings("tags", []string{"a", "b"})
```

### 5.2 结构性日志

```go
// 记录结构体
type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
}

logger.Info("user info", zap.Reflect("user", user))
```

### 5.3 命名空间

```go
logger.Info("request",
    zap.Namespace("request"),
    zap.String("id", "123"),
    zap.String("method", "GET"),
)

// 输出: {"request":{"id":"123","method":"GET"}}
```

---

## 六、采样与缓冲

### 6.1 采样

```go
// 高频日志采样
logger = zap.New(zapcore.NewCore(
    zapcore.NewJSONEncoder(encoderConfig),
    writer,
    zap.NewAtomicLevelAt(zap.InfoLevel),
)).WithOptions(zap.WrapCore(func(core zapcore.Core) zapcore.Core {
    return zapcore.NewSampler(core, time.Second, 3, 1)
}))
```

### 6.2 缓冲写入

```go
// 使用缓冲
writer := &zapcore.BufferedWriteSyncer{
    WS: zapcore.AddSync(os.Stdout),
    Size: 256 * 1024,  // 256KB
}
```

---

## 七、实战技巧

### 7.1 全局logger

```go
var log *zap.Logger

func InitLogger() error {
    var err error
    if os.Getenv("DEBUG") != "" {
        log, err = zap.NewDevelopment()
    } else {
        log, err = zap.NewProduction()
    }
    return err
}

func Info(msg string, fields ...zap.Field) {
    log.Info(msg, fields...)
}

func Error(msg string, fields ...zap.Field) {
    log.Error(msg, fields...)
}
```

### 7.2 日志轮转

```go
import "gopkg.in/natefinch/lumberjack.v2"

logger, _ := zap.NewProduction(zap.AddStacktrace(
    zapcore.AddSync(&lumberjack.Logger{
        Filename:   "/var/log/app.log",
        MaxSize:   100,
        MaxBackups: 30,
        MaxAge:    7,
    }),
))
```

---

## 八、与logrus对比

| 特性 | zap | logrus |
|------|-----|-------|
| 性能 | 10-100x | 1x |
| JSON输出 | 原生 | 需配置 |
| API风格 | 字段参数 | 结构化 |
| 依赖大小 | 小 | 中 |

**选择建议**：
- 高性能服务 -> zap
- 快速开发 -> logrus

---

zap是Go语言高性能日志库的"首选"：

1. **超高性能**：10-100倍于logrus
2. **结构化日志**：JSON格式
3. **多种编码**：JSON、Console
4. **生产验证**：Uber千万级服务验证

掌握zap，让日志记录不再是性能瓶颈！

---

>