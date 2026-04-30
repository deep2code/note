# testify：Go语言测试库的完全指南

> 在Go语言开发中，测试是保证代码质量的重要环节。testify是Go语言最流行的测试增强库，提供了断言、模拟、测试套件等功能，被1000+项目采用。本文带你深入了解testify。

---

## 一、testify简介

### 1.1 为什么选择testify？

testify是stretchr团队开发的测试增强库，特点：

| 特性 | 说明 |
|------|------|
| 断言库 | 更友好的断言API |
| mock | 强大的模拟能力 |
| suite | 测试套件支持 |
| http | HTTP测试辅助 |

采用testify的项目：

```
helm           # Kubernetes包管理器
gin            # Web框架
 docker/cli    # Docker CLI
```

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/stretchr/testify
```

### 2.2 最简示例

```go
package main

import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestAdd(t *testing.T) {
    assert.Equal(t, 4, 2+2, "2+2 should equal 4")
}
```

---

## 三、断言

### 3.1 基础断言

```go
import "github.com/stretchr/testify/assert"

// 基础类型
assert.Equal(t, expected, actual)
assert.NotEqual(t, expected, actual)
assert.Nil(t, object)
assert.NotNil(t, object)
assert.True(t, condition)
assert.False(t, condition)

// 数值比较
assert.Greater(t, 2+2, 1)
assert.Less(t, 2+2, 5)
assert.InDelta(t, expected, actual, 0.01)
```

### 3.2 字符串断言

```go
import "github.com/stretchr/testify/assert"

assert.Equal(t, "hello", "hello")
assert.NotEqual(t, "hello", "world")
assert.Contains(t, "hello world", "world")
assert.NotContains(t, "hello", "foo")
assert.HasPrefix(t, "hello world", "hello")
assert.HasSuffix(t, "hello world", "world")
assert.EqualFold(t, "hello", "HELLO")
```

### 3.3 数组/切片断言

```go
assert.ElementsMatch(t, []int{1,2,3}, []int{3,2,1})
assert.Subset(t, []int{1,2,3,4}, []int{1,3})
assert.Superset(t, []int{1,2,3,4}, []int{1,2})
assert.Contains(t, []int{1,2,3}, 2)
```

### 3.4 Map断言

```go
assert.Equal(t, map[string]int{"a":1}, map[string]int{"a":1})
assert.Contains(t, map[string]int{"a":1}, "a")
assert.NotContains(t, map[string]int{"a":1}, "b")
```

### 3.5 错误断言

```go
assert.NoError(t, err)
assert.Error(t, err)
assert.ErrorContains(t, err, "not found")
assert.EqualError(t, err, "error message")
```

### 3.6 类型断言

```go
var i interface{} = "hello"

assert.IsType(t, "", i)
assert.Implements(t, (*interface{})(nil), i)
```

---

## 四、require

### 4.1 require vs assert

| 特性 | assert | require |
|------|--------|---------|
| 失败继续 | ✓ | ✗ |
| Fatal | ✗ | ✓ |
| 日志输出 | 详细 | 简洁 |

```go
import "github.com/stretchr/testify/require"

func TestRequire(t *testing.T) {
    // 失败会终止测试
    require.NoError(t, err)
    require.Equal(t, expected, actual)
}
```

### 4.2 选择建议

```go
// 重要检查用require
require.NotNil(t, user, "user must exist")

// 次要检查用assert
assert.Empty(t, user.Orders, "orders should be empty")
```

---

## 五、mock

### 5.1 定义Mock

```go
import "github.com/stretchr/testify/mock"

type MockDatabase struct {
    mock.Mock
}

func (m *MockDatabase) GetUser(id int) (*User, error) {
    args := m.Called(id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}
```

### 5.2 设置���望

```go
func TestGetUser(t *testing.T) {
    mockDB := new(MockDatabase)
    
    // 设置期望返回值
    mockDB.On("GetUser", 1).Return(&User{ID:1, Name:"zhangsan"}, nil)
    mockDB.On("GetUser", 2).Return(nil, errors.New("not found"))
    
    // 测试
    user, err := mockDB.GetUser(1)
    assert.NoError(t, err)
    assert.Equal(t, "zhangsan", user.Name)
    
    // 验证调用
    mockDB.AssertExpectations(t)
}
```

### 5.3 设置次数

```go
// 精确次数
mockDB.On("GetUser", 1).Return(&User{ID:1}, nil).Once()
mockDB.On("GetUser", 1).Return(&User{ID:1}, nil).Twice()

// 最少/最多
mockDB.On("GetUser", 1).Return(&User{ID:1}, nil).AtLeast(1)
mockDB.On("GetUser", 1).Return(&User{ID:1}, nil).AtMost(3)
```

### 5.4 设置顺序

```go
mockDB.ExpectCall1().Return(value1).Maybe()
mockDB.ExpectCall2().Return(value2).Once()
```

---

## 六、suite

### 6.1 测试套件

```go
import "github.com/stretchr/testify/suite"

type ExampleSuite struct {
    suite.Suite
    db *Database
}

func (s *ExampleSuite) SetupSuite() {
    s.db = NewDatabase()
}

func (s *ExampleSuite) TestExample() {
    s.Equal(4, 2+2)
}
```

### 6.2 运行套件

```go
func TestExampleSuite(t *testing.T) {
    suite.Run(t, new(ExampleSuite))
}
```

---

## 七、http测试

### 7.1 请求测试

```go
import "github.com/stretchr/testify/http"
import "github.com/stretchr/testify/assert"

func TestHandler(t *testing.T) {
    handler := func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
    }
    
    req := http.NewRequest("GET", "/", nil)
    w := http.Test
    
    recorder := httptest.NewRecorder()
    handler(recorder, req)
    
    assert.Equal(t, http.StatusOK, recorder.Code)
}
```

### 7.2 便捷方法

```go
import "github.com/stretchr/testify/http"

assert.HTTP(t, handler, "GET", "/")
```

---

## 八、实战技巧

### 8.1 表格测试

```go
func TestAddTable(t *testing.T) {
    tests := []struct {
        a, b, expected int
    }{
        {1, 1, 2},
        {2, 2, 4},
        {100, 200, 300},
    }
    
    for _, tt := range tests {
        actual := tt.a + tt.b
        assert.Equal(t, tt.expected, actual)
    }
}
```

### 8.2 错误上下文

```go
func TestWithContext(t *testing.T) {
    user := &User{Name: ""}
    
    assert.NoError(t, validateUser(user),
        "name should be required")
}
```

### 8.3 Panic捕获

```go
import "github.com/stretchr/testify/assert"

assert.Panics(t, func() {
    panic("panic!")
})

assert.NotPanics(t, func() {
    // 正常执行
})
```

---

## 九、与其他测试库对比

| 特性 | testify | gotestsum |
|------|---------|-----------|
| 断言 | ✓ | ✗ |
| mock | ✓ | ✗ |
| 套件 | ✓ | ✗ |
| 输出 | 标准 | 增强 |

---

testify是Go语言测试的"首选"库：

1. **断言丰富**：30+断言方法
2. **Mock强大**：灵活的模拟能力
3. **套件支持**：测试组织
4. **广泛采用**：1000+项目验证

掌握testify，让测试更简单！

---

>