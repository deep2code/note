# wire：Go语言依赖注入的完全指南

> 在Go语言开发中，依赖注入（DI）是构建可维护应用的重要技术。wire是Google官方维护的依赖注入库，通过代码生成实现静态依赖注入。本文带你深入了解wire。

---

## 一、wire简介

### 1.1 什么是依赖注入？

依赖注入是一种管理依赖的技术，将依赖的创建和使用分离开：

```go
// ❌ 传统方式：内部创建
type UserService struct {
    repo UserRepository  // 内部创建，难以测试
}

// ✓ 依赖注入：外部注入
type UserService struct {
    repo UserRepository  // 外部传入，易于测试
}
```

### 1.2 为什么选择wire？

wire是Google官方维护的依赖注入库，特点：

| 特性 | 说明 |
|------|------|
| 静态注入 | 编译时生成 |
| 无反射 | 性能高 |
| 错误检查 | 编译期检查 |
| 自动初始化 | 减少样板代码 |

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/google/wire/cmd/wire
```

### 2.2 最简示例

```go
// user.go
package main

import (
    "context"
)

type UserRepository interface {
    GetUser(ctx context.Context, id int) (*User, error)
}

type UserService struct {
    repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
    return &UserService{repo: repo}
}
```

```go
// wire.go
//go:build wireinject
// +build wireinject

package main

import (
    "github.com/google/wire"
)

func InitializeUserService() (*UserService, error) {
    wire.Build(
        NewUserRepository,
        NewUserService,
    )
    return nil, nil
}
```

运行生成：

```bash
wire gen .
```

---

## 三、核心概念

### 3.1 Provider

Provider是依赖的提供者：

```go
func ProvideUserRepository() UserRepository {
    return &mysqlUserRepository{}
}
```

### 3.2 Injector

Injector是依赖的消费者：

```go
func InitializeUserService() (*UserService, error) {
    wire.Build(
        NewUserRepository,
        NewUserService,
    )
    return nil, nil
}
```

### 3.3 binding

binding是Provider和Injector的连接：

```go
// 基础绑定
wire.Build(NewUserRepository)

// 接口绑定
wire.Build(
    wire.Bind(new(UserRepository), new(mysqlUserRepository)),
)
```

---

## 四、提供者函数

### 4.1 基本Provider

```go
// 返回值作为依赖
func ProvideDB() *sql.DB {
    db, _ := sql.Open("mysql", dsn)
    return db
}

func ProvideUserRepo(db *sql.DB) UserRepository {
    return &mysqlUserRepository{db: db}
}
```

### 4.2 结构体Provider

```go
type Config struct {
    Host string
    Port int
}

func ProvideConfig() *Config {
    return &Config{Host: "localhost", Port: 3306}
}
```

### 4.3  ProviderSet

```go
var UserSet = wire.ProviderSet{
    ProvideDB,
    ProvideUserRepo,
}
```

---

## 五、高级特性

### 5.1 接口绑定

```go
func InitializeUserService() (*UserService, error) {
    wire.Build(
        // 绑定接口到实现
        wire.Bind(new(UserRepository), new(mysqlUserRepository)),
        NewUserService,
    )
    return nil, nil
}
```

### 5.2 结构体值

```go
func ProvideConfig() *Config {
    return &Config{Host: "localhost"}
}

// 字段注入
var Set = wire.Struct(new(Config), "Host", "Port")
```

### 5.3 值提供者

```go
var DBSet = wire.ProvideSet{
    ProvideDB,
    // 常量值
    wire.Value(100),
}
```

### 5.4 替代提供者

```go
var MockSet = wire.ProvideSet{
    // 替换为mock实现
    wire.Bind(new(UserRepository), new(mockUserRepository)),
}
```

---

## 六、实战技巧

### 6.1 项目结构

```
user/
├── user.go        # 业务逻辑
├── wire.go       # Provider定义
├── wire_gen.go   # 自动生成
└── main.go       # 入口
```

### 6.2 分层依赖

```go
// dao.go
func ProvideUserDAO(db *sql.DB) UserDAO {
    return &userDAO{db: db}
}

// service.go
func ProvideUserService(dao UserDAO) *UserService {
    return &UserService{dao: dao}
}

// server.go
func InitializeServer() (*Server, error) {
    wire.Build(
        ProvideUserDAO,
        ProvideUserService,
        NewServer,
    )
    return nil, nil
}
```

### 6.3 选项模式

```go
type Options struct {
    mysql string
}

func NewOptions() Options {
    return Options{mysql: dsn}
}

func ProvideDB(opts Options) *sql.DB {
    db, _ := sql.Open("mysql", opts.mysql)
    return db
}
```

---

## 七、错误处理

### 7.1 初始化错误

```go
func InitializeServer() (*Server, error) {
    wire.Build(
        NewDB,
        NewUserService,
    )
    return nil, errors.New("failed to initialize")
}
```

### 7.2 错误传播

```go
func ProvideDB() (*sql.DB, error) {
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, fmt.Errorf("failed to connect: %w", err)
    }
    return db, nil
}
```

---

## 八、与反射 DI 对比

| 特性 | wire | 反射DI |
|------|------|--------|
| 性能 | 编译生成 | 反射 |
| 类型安全 | 编译期 | 运行时 |
| 学习曲线 | 中等 | 低 |
| 调试 | 容易 | 难 |

---

wire是Go语言依赖注入的"首选"：

1. **静态注入**：编译时生成
2. **无反射**：性能高
3. **类型安全**：编译期检查
4. **Google维护**：稳定可靠

掌握wire，让依赖管理更优雅！

---

>