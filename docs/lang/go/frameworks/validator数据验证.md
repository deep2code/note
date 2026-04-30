# go-playground/validator：Go语言数据验证的完全指南

> 在Go语言开发中，数据验证是保证数据质量的重要环节。validator是Go语言最流行的验证库，基于标签进行结构体验证，被gin等框架内置采用。本文带你深入了解validator。

---

## 一、validator简介

### 1.1 为什么选择validator？

validator是Go语言结构体验证的"事实标准"，特点：

| 特性 | 说明 |
|------|------|
| 标签验证 | 基于struct tag |
| 内置丰富 | 30+种验证规则 |
| 自定义 | 支持自定义验证 |
| 多语言 | 错误消息国际化 |

采用validator的框架：

```
gin         # Web框架
echo        # Web框架
 cobra      # CLI框架
```

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/go-playground/validator/v10
```

### 2.2 最简示例

```go
package main

import (
    "fmt"
    "github.com/go-playground/validator/v10"
)

type User struct {
    Name  string `validate:"required"`
    Email string `validate:"required,email"`
    Age   int    `validate:"required,gte=18,lte=60"`
}

func main() {
    validate := validator.New()
    
    user := User{
        Name:  "zhangsan",
        Email: "invalid-email",
        Age:   16,
    }
    
    err := validate.Struct(user)
    if err != nil {
        fmt.Println("Validation errors:")
        for _, err := range err.(validator.ValidationErrors) {
            fmt.Printf("  Field: %s, Tag: %s\n", err.Field(), err.Tag())
        }
    }
}
```

**输出**：

```
Validation errors:
  Email, Tag: email
  Age, Tag: gte
```

---

## 三、验证规则

### 3.1 必填验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `required` | 必填 | `validate:"required"` |
| `required_if` | 条件必填 | `required_if:Field value` |
| `required_unless` | 条件必填 | `required_unless:Field value` |
| `required_with` | 与某字段同在 | `required_with:Field1 Field2` |
| `required_without` | 某字段不存在时必填 | `required_without:Field1` |

### 3.2 字符串验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `email` | 邮箱格式 | `validate:"email"` |
| `url` | URL格式 | `validate:"url"` |
| `uri` | URI格式 | `validate:"uri"` |
| `alpha` | 仅字母 | `validate:"alpha"` |
| `alphanum` | 字母数字 | `validate:"alphanum"` |
| `numeric` | 仅数字 | `validate:"numeric"` |

### 3.3 数值验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `eq` | 等于 | `validate:"eq=18"` |
| `ne` | 不等于 | `validate:"ne=0"` |
| `gt` | 大于 | `validate:"gt=0"` |
| `gte` | 大于等于 | `validate:"gte=18"` |
| `lt` | 小于 | `validate:"lt=100"` |
| `lte` | 小于等于 | `validate:"lte=60"` |
| `oneof` | 其中之一 | `validate:"oneof=go python java"` |

### 3.4 长度验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `len` | 固定长度 | `validate:"len=11"` |
| `min` | 最小长度 | `validate:"min=6"` |
| `max` | 最大长度 | `validate:"max=20"` |

### 3.5 格式验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `datetime` | 日期时间 | `validate:"datetime=2006-01-02"` |
| `iso3166alpha2` | 国家代码 | `validate:"iso3166alpha2"` |
| `iso3166alpha3` | 国家代码 | `validate:"iso3166alpha3"` |
| `uuid` | UUID格式 | `validate:"uuid"` |
| `uuid3_rfc4122` | UUID v3 | `validate:"uuid3_rfc4122"` |
| `uuid4_rfc4122` | UUID v4 | `validate:"uuid4_rfc4122"` |
| `uuid5_rfc4122` | UUID v5 | `validate:"uuid5_rfc4122"` |

### 3.6 结构验证

| 标签 | 说明 | 示例 |
|------|------|------|
| `struct` | 嵌套结构 | `validate:"required"` |
| `dive` | 数组/切片 | `validate:"dive,email"` |
| `keys` | Map键 | `validate:"keys,required"` |

---

## 四、高级特性

### 4.1 多规则组合

```go
type User struct {
    Name  string `validate:"required,min=2,max=20"`
    Email string `validate:"required,email"`
    Age   int    `validate:"required,gte=18,lte=60"`
    Phone string `validate:"required,numeric,len=11"`
}
```

### 4.2 条件验证

```go
type User struct {
    IsAdmin bool   `validate:"-"
    Role   string `validate:"required_if=IsAdmin true"`
}
```

### 4.3 排除字段

```go
type User struct {
    Password        string `validate:"required_with=ConfirmPassword"`
    ConfirmPassword string `validate:"required_with=Password"`
    // 排除当前字段验证
    Age           int    `validate:"-"`
}
```

---

## 五、跨字段验证

### 5.1 field比较

```go
type Register struct {
    Password     string `validate:"required,min=6"`
    ConfirmPassword string `validate:"required,eqfield=Password"`
}
```

### 5.2 唯一性验证

```go
type User struct {
    Username string `validate:"required"`
    Email   string `validate:"required,email"`
}

type Account struct {
    Users []User `validate:"dive,required"`
}
```

---

## 六、自定义验证

### 6.1 注册验证器

```go
validate := validator.New()

// 自定义验证：奇数
validate.RegisterValidation("odd", func(fl validator.FieldLevel) bool {
    field := fl.Field()
    if field.Kind() == reflect.Int {
        return field.Int()%2 == 1
    }
    return false
})

// 使用自定义验证
type Number struct {
    Value int `validate:"required,odd"`
}
```

### 6.2 注册翻译

```go
registerFunc := func(ut ut.Translator) error {
    ut.AddTemplate(locale, template)
    return nil
}

validate.RegisterTranslation(
    "required",
    registerFunc, 
    translateFunc,
)
```

---

## 七、在Gin中使用

### 7.1 基础使用

```go
type Login struct {
    Email    string `form:"email" json:"email" binding:"required,email"`
    Password string `form:"password" json:"password" binding:"required,min=6"`
}

func login(c *gin.Context) {
    var l Login
    if err := c.ShouldBind(&l); err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, gin.H{"status": "ok"})
}
```

### 7.2 自定义翻译

```go
func main() {
    // 自定义错误消息
    translateFunc := func(trans ut.Translator, fe validator.FieldError) string {
        msg, _ := trans.T("Email validation error", fe.Field())
        return msg
    }
    
    // 注册...
}
```

---

## 八、实战技巧

### 8.1 验证错误处理

```go
func validateStruct(s interface{}) map[string]string {
    validate := validator.New()
    err := validate.Struct(s)
    
    errors := make(map[string]string)
    for _, err := range err.(validator.ValidationErrors) {
        errors[err.Field()] = err.Translate(trans)
    }
    
    return errors
}
```

### 8.2 验证分组

```go
type User struct {
    Name string `validate:"required"`
}

func CreateUser(c *gin.Context) {
    var user User
    // 验证创建请求
    validate.StructLevel(user, "create")
}

func UpdateUser(c *gin.Context) {
    var user User
    // 验证更新请求
    validate.StructLevel(user, "update")
}
```

---

## 九、常见内置标签

| 标签 | 说明 |
|------|------|
| `required` | 必填项 |
| `email` | 邮箱 |
| `min` | 最小值/长度 |
| `max` | 最大值/长度 |
| `eq` | 等于 |
| `ne` | 不等于 |
| `datetime` | 日期时间 |
| `uuid` | UUID |
| `url` | URL |

---

validator是Go语言结构体验证的"首选"：

1. **标签驱动**：简洁直观
2. **30+验证**：功能丰富
3. **自定义**：扩展性强
4. **框架集成**：gin默认支持

掌握validator，让数据验证更简单！

---

>