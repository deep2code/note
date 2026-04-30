# Go 中常见 Panic 原因深度剖析

## 1. 数组/切片索引越界

**Index Out of Range**

这是Go中最常见的panic原因。当访问数组/切片的索引超出其长度范围时，运行时会直接触发panic。

```go
arr := []int{1, 2, 3}
fmt.Println(arr[5]) // panic: index out of range
```

**避坑建议**：访问前检查索引是否满足 `0 ≤ idx < len(s)`，或使用循环遍历（如for range）。

---

## 2. 空指针解引用

**Nil Pointer Dereference**

声明指针变量但未初始化（默认值为nil），却尝试访问其字段或方法。

```go
var p *Person
p.Name = "Tom" // panic: nil pointer dereference
```

**避坑建议**：使用指针前检查是否为nil，或使用`new()`初始化。

---

## 3. 通道关闭后发送

**Send on Closed Channel**

向已关闭的通道发送数据会导致panic。

```go
ch := make(chan int)
close(ch)
ch <- 1 // panic: send on closed channel
```

**避坑建议**：发送前判断通道是否已关闭，或使用`select`+`ok`判断。

---

## 4. 类型断言失败

**Type Assertion**

类型断言失败且未使用ok模式时，会触发panic。

```go
var i interface{} = "hello"
n := i.(int) // panic: interface conversion
```

**避坑建议**：使用带ok的模式：

```go
n, ok := i.(int)
if !ok {
    // 处理失败
}
```

---

## 5. 除零错误

**Integer Divide by Zero**

整数除以零会导致panic。

```go
a := 10
b := 0
c := a / b // panic: integer divide by zero
```

**避坑建议**：除法运算前检查除数是否为0。

---

## 6. 字典键不存在

**Key Not Found in Map**

直接访问map中不存在的键会返回零值，不会panic。但如果赋值给nil指针则会panic。

```go
m := make(map[string]int)
var p *int = &m["key"] // panic: invalid memory address or nil pointer dereference
```

---

## 7. 切片长度为负

**Negative Slice Length**

创建负长度的切片会导致panic。

```go
s := make([]int, -1) // panic: negative size
```

---

## 8. 超出容量 append

**Append Beyond Capacity**

使用append超出容量但不修改长度不会panic，但行为可能不符合预期。

---

## 9. 可恢复的panic

**Recover from Panic**

可以使用recover()捕获panic，避免程序崩溃。

```go
func safeCall(fn func()) {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered:", r)
        }
    }()
    fn()
}
```

---

| 场景 | 原因 | 解决方案 |
|------|------|----------|
| 索引越界 | 访问超出长度 | 边界检查 |
| 空指针 | 未初始化指针 | new()初始化 |
| 通道关闭 | 向已关闭通道发消息 | select判断 |
| 类型断言 | 接口类型不匹配 | ok模式 |
| 除零 | 除数为0 | 提前检查 |
| nil字典 | 访问nil map | make初始化 |

>