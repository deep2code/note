# errors：Go语言错误处理的完全指南

> 在Go语言中，错误处理是编程的核心部分。errors包是Go官方维护的错误处理库，提供了可包装、可诊断的错误处理能力。本文带你深入了解errors包。

---

## 一、errors简介

### 1.1 为什么需要errors？

Go 1.13之前，错误处理只有基础的`error`接口：

```go
type error interface {
    Error() string
}
```

这种方式无法携带上下文，错误原因不明。errors包解决了这个问题：

| 特性 | 说明 |
|------|------|
| 错误包装 | 携带原始错误 |
| 错误解包 | 获取原始错误 |
| 错误链 | 完整的错误链路 |
| 文件行号 | 准确的错误位置 |

---

## 二、快速开始

### 2.1 安装

```bash
# Go 1.13+ 标准库自带
import "errors"
```

### 2.2 创建错误

```go
import "errors"

// 基础错误
err := errors.New("something went wrong")

// 带格式的错误
err := errors.Errorf("failed to %s", operation)
```

---

## 三、错误包装

### 3.1 Wrap包装

```go
import "fmt"
import "github.com/pkg/errors"

func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("read file failed: %w", err)
    }
    return data, nil
}
```

### 3.2 Wrap vs.Errorf

| 方式 | 说明 |
|------|------|
| `fmt.Errorf` | Go 1.13+ 标准库 |
| `errors.Wrap` | pkg/errors库 |

```go
// 标准库方式（推荐）
fmt.Errorf("read failed: %w", err)

// pkg/errors方式
errors.Wrap(err, "read failed")
```

### 3.3 多次包装

```go
func process() error {
    if err := step1(); err != nil {
        return fmt.Errorf("step1 failed: %w", err)
    }
    if err := step2(); err != nil {
        return fmt.Errorf("step2 failed: %w", err)
    }
    return nil
}

// 错误链: step2 failed: step1 failed: original error
```

---

## 四、错误解包

### 4.1 Is判断

```go
import "errors"

// 判断错误类型
if errors.Is(err, os.ErrNotExist) {
    // 文件不存在
}

if errors.Is(err, os.ErrPermission) {
    // 权限错误
}
```

### 4.2 As类型转换

```go
import "errors"

// 自定义错误
type ValidationError struct {
    Field string
    Msg  string
}

func (e *ValidationError) Error() string {
    return e.Field + ": " + e.Msg
}

// 错误类型转换
var ValidationErr *ValidationError
if errors.As(err, &ValidationErr) {
    fmt.Println("Validation failed:", ValidationErr.Field)
}
```

### 4.3 完整解包示例

```go
func handleError(err error) {
    // 1. 检查是否为定义的错误
    if errors.Is(err, ErrNotFound) {
        fmt.Println("Resource not found")
        return
    }
    
    // 2. 检查错误类型
    var validationErr *ValidationError
    if errors.As(err, &validationErr) {
        fmt.Printf("Validation error on %s: %s\n", 
            validationErr.Field, validationErr.Msg)
        return
    }
    
    // 3. 打印错误链
    fmt.Println("Error chain:")
    for {
        fmt.Printf("  - %v\n", err)
        if !errors.Unwrap(err) {
            break
        }
        err = errors.Unwrap(err)
    }
}
```

---

## 五、堆栈跟踪

### 5.1 Using pkg/errors

```go
import "github.com/pkg/errors"

func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, errors.Wrap(err, "read file failed")
    }
    return data, nil
}

func main() {
    err := readFile("notexist.txt")
    if err != nil {
        // 打印完整堆栈
        fmt.Printf("%+v\n", err)
    }
}
```

### 5.2 堆栈输出

```
read file failed: open notexist.txt: No such file or directory
main.readFile
    /path/to/main.go:15
main.main
    /path/to/main.go:21
runtime.goexit
    /path/to/runtime.go:...
```

---

## 六、实战技巧

### 6.1 错误判断函数

```go
func IsNotFound(err error) bool {
    return errors.Is(err, os.ErrNotExist)
}

func IsPermission(err error) bool {
    return errors.Is(err, os.ErrPermission)
}

func IsTimeout(err error) bool {
    errors.Is(err, os.ErrDeadlineExceeded)
    var netError net.Error
    if errors.As(err, &netError) {
        return netError.Timeout()
    }
    return false
}
```

### 6.2 统一错误处理

```go
type ErrorCode int

const (
    ErrCodeNotFound ErrorCode = iota
    ErrCodePermission
    ErrCodeInvalid
    ErrCodeInternal
)

type AppError struct {
    Code    ErrorCode
    Message string
    Err    error
}

func (e *AppError) Error() string {
    return e.Message
}

func (e *AppError) Unwrap() error {
    return e.Err
}

// 判断错误码
func GetErrorCode(err error) ErrorCode {
    var appErr *AppError
    if errors.As(err, &appErr) {
        return appErr.Code
    }
    return ErrCodeInternal
}
```

### 6.3 错误日志

```go
func logError(err error) {
    fmt.Printf("ERROR: %v\n", err)
    
    // 记录到日志系统
    logger.Error("error occurred",
        "error", err.Error(),
        "stack", fmt.Sprintf("%+v", err))
}
```

---

## 七、Go 1.20+ 特性

### 7.1 Join错误

```go
// 组合多个错误
err := errors.Join(
    os.ErrNotExist,
    os.ErrPermission,
)

// 判断是否包含某个错误
if errors.Is(err, os.ErrNotExist) {
    // ...
}
```

### 7.2 错误行为

```go
type CustomError struct {
    Code int
}

func (e *CustomError) Error() string {
    return fmt.Sprintf("error %d", e.Code)
}

func (e *CustomError) Is(target error) bool {
    // 自定义相等判断
    if target == os.ErrNotExist {
        return e.Code == 404
    }
    return false
}
```

---

## 八、与其他库对比

| 特性 | errors标准库 | pkg/errors |
|------|-----------|----------|
| 错误包装 | ✓ | ✓ |
| 堆栈跟踪 | ✗ | ✓ |
| 错误解包 | ✓ | ✓ |
| 依赖 | 无 | 第三方 |

---

errors是Go语言错误处理的"基石"：

1. **标准库**：Go 1.13+ 自带
2. **错误包装**：%w动词
3. **错误解包**：Is/As方法
4. **完整链路**：错误追踪

掌握errors，让错误处理更智能！

---

>