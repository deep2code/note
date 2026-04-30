# zerolog：Go语言超高性能日志库的完全指南

> 在Go语言日志库中，追求极致性能的首选是zerolog。它是目前Go语言最快的日志库，比标准库快200倍，比logrus快50倍。本文带你深入了解zerolog。

---

## 一、zerolog简介

### 1.1 为什么选择zerolog？

zerolog是rs/zerolog团队开发的超高性能日志库，特点：

| 特性 | 说明 |
|------|------|
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

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/rs/zerolog
```

### 2.2 最简示例

```go
package main

import (
    "github.com/rs/zerolog"
    "os"
)

func main() {
    // 创建日志输出到stdout
    log := zerolog.New(os.Stdout).With().Timestamp().Logger()
    
    log.Info().Str("name", "world").Msg("Hello")
}
```

**输出**：

```json
{"level":"info","name":"world","time":1705312800,"message":"Hello"}
```

---

## 三、基础用法

### 3.1 日志级别

```go
log.Debug().Msg("debug message")
log.Info().Msg("info message")
log.Warn().Msg("warn message")
log.Error().Msg("error message")
log.Fatal().Msg("fatal message")  // 会panic
log.Panic().Msg("panic message") // 会panic
```

### 3.2 字段添加

```go
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
```

### 3.3 格式化输出

```go
// Console格式（人类可读）
console := zerolog.ConsoleWriter{Output: os.Stdout}
log := zerolog.New(console).With().Timestamp().Logger()

log.Info().Str("name", "world").Msg("Hello")

// 输出：
// 2024/01/15 10:30:00 INFO Hello name=world
```

---

## 四、高级特性

### 4.1 全局日志

```go
// 设置全局日志
zerolog.SetGlobalLevel(zerolog.InfoLevel)

// 全局日志别名
func Info() *zerolog.Event {
    return zerolog.Info()
}

// 使用
zerolog.Info().Str("name", "world").Msg("Hello")
```

### 4.2 上下文

```go
// 创建带上下文的日志
logger := log.With().
    Str("app", "myapp").
    Str("version", "1.0.0").
    Logger()

logger.Info().Str("name", "world").Msg("Hello")
// 输出: {"app":"myapp","version":"1.0.0","level":"info","name":"world","message":"Hello"}
```

### 4.3 条件日志

```go
// 仅DEBUG级别输出
log.Debug().Msg("debug info")

// 条件日志
if log.Debug().Enabled() {
    log.Debug().Str("expensive", compute()).Msg("debug")
}
```

### 4.4 错误日志

```go
err := errors.New("something went wrong")
log.Error().Err(err).Msg("operation failed")

// 输出包含堆栈
log.Error().
    Stack().
    Err(err).
    Msg("operation failed")
```

---

## 五、实战技巧

### 5.1 初始化

```go
package main

import (
    "github.com/rs/zerolog"
    "os"
)

var log = zerolog.New(os.Stdout).With().Timestamp().Logger()

func init() {
    // 设置日志级别
    zerolog.SetGlobalLevel(zerolog.InfoLevel)
    
    // JSON输出
    // zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
}
```

### 5.2 文件输出

```go
file, _ := os.OpenFile(
    "app.log",
    os.O_CREATE|os.O_WRONLY|os.O_APPEND,
    0644,
)
log := zerolog.New(file).With().Timestamp().Logger()
```

### 5.3 日志轮转

```go
import "gopkg.in/natefinch/lumberjack.v2"

logger := zerolog.New(
    lumberjack.Logger{
        Filename:   "app.log",
        MaxSize:   100,  // MB
        MaxBackups: 30,
        MaxAge:     7,
    },
).With().Timestamp().Logger()
```

---

## 六、与zap/logrus对比

| 特性 | zerolog | zap | logrus |
|------|--------|-----|------|-------|
| 性能 | 最快 | 快 | 慢 |
| API风格 | 链式 | 结构化 | 结构化 |
| JSON | 原生 | 原生 | 需配置 |
| Console | ✓ | ✓ | ✓ |
| 内存分配 | 0 | 4 | 28 |

**选择建议**：
- 极致性能 -> zerolog
- 平衡性能 -> zap
- 快速开发 -> logrus

---

zerolog是Go语言日志库的"性能王者"：

1. **极致性能**：零分配日志
2. **JSON原生**：高效序列化
3. **链式API**：优雅流畅
4. **生产验证**：高频服务验证

追求极致性能的首选！

---

>