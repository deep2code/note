# GORM：Go语言ORM库的完全指南

> 在Go语言数据库开发中，GORM是最流行的ORM（对象关系映射）库。它将数据库表映射为Go struct，让开发者用面向对象的方式操作数据库。本文带你深入了解GORM。

---

## 一、GORM简介

### 1.1 为什么选择GORM？

GORM是Go语言中最流行的ORM库，具有以下特点：

| 特性 | 说明 |
|------|------|
| 全功能ORM | CRUD、关联、事务 |
| 链式API | 直观的连贯操作 |
| 自动迁移 | 自动创建/修改表结构 |
| 多种数据库 | MySQL、PostgreSQL、SQLite |

数据对比：

| 库 | Star | 功能 | 性能 |
|------|------|------|------|
| GORM | 30k+ | 完整 | 高 |
| xorm | 9k+ | 完整 | 很高 |
| ent | 8k+ | Graph | 高 |

---

## 二、快速开始

### 2.1 安装

```bash
go get gorm.io/gorm
go get gorm.io/driver/mysql
```

### 2.2 定义模型

```go
package main

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
)

type User struct {
    ID        uint   `gorm:"primaryKey"`
    Name      string `gorm:"size:100;not null"`
    Email     string `gorm:"uniqueIndex;size:255"`
    Age       int    `gorm:"index"`
    CreatedAt time.Time
    UpdatedAt time.Time
}

func main() {
    dsn := "root:password@tcp(localhost:3306)/testdb?charset=utf8mb4"
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        panic(err)
    }
    
    // 自动迁移
    db.AutoMigrate(&User{})
}
```

---

## 三、基础操作

### 3.1 创建记录

```go
// 创建用户
user := User{Name: "张三", Email: "zhangsan@example.com", Age: 25}
result := db.Create(&user)

fmt.Println(user.ID)  // 自动生成ID
fmt.Println(result.RowsAffected())
```

### 3.2 查询单条

```go
// 根据主键查询
var user User
db.First(&user, 1)

// 条件查询
db.Where("email = ?", "zhangsan@example.com").First(&user)
```

### 3.3 查询多条

```go
var users []User

// 查询所有
db.Find(&users)

// 条件查询
db.Where("age > ?", 18).Find(&users)

// 分页
db.Offset(0).Limit(10).Find(&users)
```

### 3.4 更新记录

```go
// 方式一：Save（更新所有字段）
user.Name = "李四"
db.Save(&user)

// 方式二：Updates（更新指定字段）
db.Model(&user).Updates(map[string]interface{}{
    "name": "李四",
    "age":  26,
})

// 方式三：Where + Updates
db.Where("id = ?", 1).Updates(User{Name: "王五"})
```

### 3.5 删除记录

```go
// 删除单条
db.Delete(&user, 1)

// 条件删除
db.Where("age < ?", 18).Delete(&User{})
```

---

## 四、高级查询

### 4.1 链式API

```go
var users []User

db.Where("age > ?", 18).
    Where("name LIKE ?", "%张%").
    Order("created_at DESC").
    Limit(10).
    Offset(0).
    Find(&users)
```

### 4.2 预加载（关联查询）

```go
// 定义模型（带关联）
type Order struct {
    ID     uint
    UserID uint
    User   User `gorm:"foreignKey:UserID"`
    Amount float64
}

// 预加载用户
var orders []Order
db.Preload("User").Find(&orders)

for _, order := range orders {
    fmt.Println(order.User.Name)  // 无需再查询
}
```

### 4.3 原生SQL

```go
// 原生查询
rows, err := db.Raw("SELECT * FROM users WHERE age > ?", 18).Rows()
defer rows.Close()

for rows.Next() {
    var user User
    db.ScanRows(rows, &user)
    fmt.Println(user.Name)
}
```

---

## 五、事务处理

### 5.1 自动事务

```go
// GORM会自动使用事务（单个Create/Update/Delete）
// 只有在事务中才禁用

func CreateUserWithOrders(db *gorm.DB, user *User, orders []Order) error {
    return db.Transaction(func(tx *gorm.DB) error {
        if err := tx.Create(user).Error; err != nil {
            return err
        }
        
        for i := range orders {
            orders[i].UserID = user.ID
            if err := tx.Create(&orders[i]).Error; err != nil {
                return err
            }
        }
        return nil
    })
}
```

### 5.2 手动事务

```go
db, _ := gorm.Open(mysql.Open(dsn), &gorm.Config{})

tx := db.Begin()

if err := tx.Create(&user).Error; err != nil {
    tx.Rollback()
    return err
}

tx.Commit()
```

---

## 六、钩子函数

### 6.1 模型钩子

```go
type User struct {
    ID   uint
    Name string `gorm:"size:100"`
}

// 创建前钩子
func (u *User) BeforeCreate(tx *gorm.DB) error {
    // 加密密码、设置默认值等
    return nil
}

// 创建后钩子
func (u *User) AfterCreate(tx *gorm.DB) error {
    // 记录日志、发送通知等
    return nil
}
```

### 6.2 回调函数

```go
// 自定义回调
db.Callback().Create().Register("my_callback", func(db *gorm.DB) error {
    // 自定义逻辑
    return nil
})
```

---

## 七、配置与技巧

### 7.1 连接池

```go
sqlDB, err := db.DB()
sqlDB.SetMaxOpenConns(25)
sqlDB.SetMaxIdleConns(5)
sqlDB.SetConnMaxLifetime(time.Hour)
```

### 7.2 日志配置

```go
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
    Logger: logger.Default.LogMode(logger.Info),
})
```

### 7.3 命名策略

```go
db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
    NamingStrategy: schema.NamingStrategy{
        TablePrefix: "t_",        // 表前缀
        SingularTable: true,        // 单数表名
    },
})
```

---

## 八、最佳实践

### 8.1 封装Repository

```go
type UserRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
    return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *User) error {
    return r.db.Create(user).Error
}

func (r *UserRepository) GetByID(id uint) (*User, error) {
    var user User
    err := r.db.First(&user, id).Error
    return &user, err
}

func (r *UserRepository) GetList(page, size int) ([]User, int64) {
    var count int64
    var users []User
    
    r.db.Model(&User{}).Count(&count)
    r.db.Offset((page - 1) * size).Limit(size).Find(&users)
    
    return users, count
}
```

### 8.2 软删除

```go
type User struct {
    ID        uint
    Name      string
    DeletedAt gorm.DeletedAt `gorm:"index"`
}

// GORM会自动过滤已删除记录
db.Delete(&user, 1)  // 软删除
db.Unscoped().First(&user, 1)  // 查询包括已删除
```

---

## 九、与原生SQL对比

| 特性 | GORM | 原生SQL |
|------|------|----------|
| 易用性 | 高 | 低 |
| 性能 | 高 | 很高 |
| 类型安全 | ✓ | ✗ |
| 关联查询 | ✓ | 需要JOIN |

**选择建议**：
- 快速开发、业务逻辑 -> GORM
- 高性能查询、复杂SQL -> 原生SQL

---

GORM是Go语言ORM库的"事实标准"：

1. **功能完善**：CRUD、关联、事务
2. **API直观**：链式操作
3. **自动迁移**：简化开发
4. **生态丰富**：大量插件

掌握GORM，让数据库操作更轻松！

---

>