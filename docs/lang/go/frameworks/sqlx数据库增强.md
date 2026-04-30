# sqlx：Go语言数据库增强完全指南

> 在Go语言数据库开发中，sqlx是jmoiron/sqlx团队开源的数据库增强库，在标准库database/sql基础上提供了更便捷的操作。sqlx让数据库操作更简洁高效。本文带你深入了解sqlx。

---

## 一、sqlx简介

### 1.1 为什么选择sqlx？

sqlx是database/sql的增强库，特点：

| 特性 | 说明 |
|------|------|
| 兼容标准库 | 基于database/sql |
| 结构体映射 | 自动绑定到struct |
| 自动scan | 自动类型转换 |
| 命名参数 | 命名占位符 |

对比标准库：

| 特性 | sqlx | 标准库 |
|------|------|--------|
| 绑定 | 自动 | 手动 |
| 参数 | 命名 | 位置 |
| 代码量 | 少 | 多 |

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/jmoiron/sqlx
```

### 2.2 最简示例

```go
package main

import (
    "github.com/jmoiron/sqlx"
    _ "github.com/go-sql-driver/mysql"
)

type User struct {
    ID   int64  `db:"id"`
    Name string `db:"name"`
    Age  int    `db:"age"`
}

func main() {
    db, _ := sqlx.Connect("mysql", dsn)
    
    var user User
    db.Get(&user, "SELECT id, name, age FROM users WHERE id = ?", 1)
    
    fmt.Println(user.Name)
}
```

---

## 三、基础操作

### 3.1 查询单条

```go
var user User
db.Get(&user, "SELECT * FROM users WHERE id = ?", 1)

db.Get(&user, "SELECT * FROM users WHERE id = ? AND status = ?", 1, "active")
```

### 3.2 查询多条

```go
var users []User
db.Select(&users, "SELECT * FROM users")

db.Select(&users, "SELECT * FROM users WHERE age > ?", 18)
```

### 3.3 执行

```go
result, err := db.Exec("INSERT INTO users (name, age) VALUES (?, ?)", "zhangsan", 25)

id, _ := result.LastInsertId()
```

### 3.4 事务

```go
tx, _ := db.Beginx()

tx.MustExec("INSERT INTO users (name) VALUES (?)", "zhangsan")
tx.MustExec("INSERT INTO orders (user_id) VALUES (?)", id)

tx.Commit()
```

---

## 四、结构体绑定

### 4.1 基础绑定

```go
type User struct {
    ID   int64  `db:"id"`
    Name string `db:"name"`
    Age  int    `db:"age"`
}

// 自动绑定列名到db tag
db.Get(&user, "SELECT id, name, age FROM users WHERE id = ?", 1)
```

### 4.2 嵌套结构

```go
type Order struct {
    ID     int64 `db:"id"`
    UserID int64 `db:"user_id"`
    User   User `db:"user"`
}

db.Select(&orders, `
    SELECT o.id, o.user_id, u.id, u.name 
    FROM orders o 
    JOIN users u ON o.user_id = u.id
`)
```

---

## 五、命名参数

### 5.1 Named

```go
// Named自动映射
_, err := db.NamedExec(`
    INSERT INTO users (name, age) 
    VALUES (:name, :age)
`, map[string]interface{}{
    "name": "zhangsan",
    "age":  25,
})
```

### 5.2 Struct命名

```go
_, err := db.NamedExec(`
    INSERT INTO users (name, age) 
    VALUES (:Name, :Age)
`, user)
```

### 5.3 NamedQuery

```go
rows, err := db.NamedQuery(`
    SELECT * FROM users 
    WHERE name = :name
`, map[string]interface{}{
    "name": "zhangsan",
})
```

---

## 六、Rebind

### 6.1 自动适配

```go
// sqlite: ?
// mysql: ?
// postgres: $1

query := db.Rebind("SELECT * FROM users WHERE id = ?")
db.Query(query, 1)
```

### 6.2 RebindNamed

```go
query := db.RebindNamed(`
    SELECT * FROM users 
    WHERE name = :Name
`)
db.Query(query, user)
```

---

## 七、实战技巧

### 7.1 自动scan

```go
var users []User
db.Select(&users, "SELECT id, name, age FROM users")

// 自动scan，不需要手动scan
for _, user := range users {
    fmt.Println(user.Name)
}
```

### 7.2 In查询

```go
ids := []int{1, 2, 3}
query, args, _ := sqlx.In("SELECT * FROM users WHERE id IN (?)", ids)
query = db.Rebind(query)

db.Select(&users, query, args...)
```

### 7.3 动态where

```go
query := "SELECT * FROM users WHERE 1=1"
args := []interface{}{}

if name != "" {
    query += " AND name = ?"
    args = append(args, name)
}
if age > 0 {
    query += " AND age = ?"
    args = append(args, age)
}

db.Select(&users, query, args...)
```

---

sqlx是Go语言数据库的"增强库"：

1. **自动绑定**：结构体自动映射
2. **命名参数**：更清晰的参数
3. **兼容标准库**：零改动迁移
4. **简化代码**：减少样板代码

数据库操作的首选增强工具！

---

>