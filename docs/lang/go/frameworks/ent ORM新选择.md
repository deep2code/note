# ent：Go语言 ORM 的新选择

> 在Go语言ORM领域，GORM是传统霸主，而ent是Facebook开源的新一代ORM。ent采用代码生成模式，提供强类型API，是Go 1.18+泛型的完美应用。本文带你深入了解ent。

---

## 一、ent简介

### 1.1 为什么选择ent？

ent是Facebook开源的新一代ORM，特点：

| 特性 | 说明 |
|------|------|
| 代码生成 | 编译时类型安全 |
| 强类型API | 代码补全友好 |
| 图结构 | 支持实体关联 |
| 官方维护 | Meta公司验证 |

对比GORM：

| 特性 | ent | GORM |
|------|-----|-------|
| 类型安全 | ✓ | ✗ |
| 代码生成 | ✓ | ✗ |
| 关联查询 | Graph | 简单 |
| 学习曲线 | 中等 | 低 |

---

## 二、快速开始

### 2.1 安装

```bash
go get entgo.io/ent
go install entgo.io/ent/cmd/ent
```

### 2.2 定义模型

```go
// schema/user.go
package schema

import (
    "entgo.io/ent"
    "entgo.io/ent/schema/field"
    "entgo.io/ent/schema/edge"
)

type User struct {
    ent.Schema
}

func (User) Fields() []ent.Field {
    return []ent.Field{
        field.String("name"),
        field.Int("age"),
        field.String("email"),
    }
}

func (User) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("posts", Post.Type),
    }
}
```

### 2.3 生成代码

```bash
ent generate ./schema
```

---

## 三、基础操作

### 3.1 初始化

```go
// 初始化client
client, _ := ent.Open(dialect.SQLite, "file:ent.db?_fk=1")
defer client.Close()
```

### 3.2 创建

```go
// 创建用户
user, err := client.User.
    Create().
    SetName("zhangsan").
    SetAge(25).
    SetEmail("zhangsan@example.com").
    Save(context.Background())
```

### 3.3 查询

```go
// 查单个
user, err := client.User.Get(context.Background(), 1)

// 查多个
users, err := client.User.Query().All(context.Background())

// 条件查询
users, err := client.User.
    Query().
    Where(user.NameEQ("zhangsan")).
    All(context.Background())

// 分页查询
users, err := client.User.
    Query().
    Offset(0).
    Limit(10).
    All(context.Background())
```

### 3.4 更新

```go
// 更新单个
user, err := client.User.
    UpdateOneID(1).
    SetAge(26).
    Save(context.Background())

// 批量更新
count, err := client.User.
    Update().
    SetAge(age).
    Save(context.Background())
```

### 3.5 删除

```go
// 删除单个
err := client.User.DeleteOneID(1).Exec(context.Background())

// 批量删除
count, err := client.User.
    Delete().
    Where(user.AgeGT(18)).
    Exec(context.Background())
```

---

## 四、关联查询

### 4.1 一对多

```go
// 定义
func (User) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("posts", Post.Type),
    }
}

// 查询用户的文章
posts, err := client.User.
    Query().
    All(context.Background())

for _, user := range users {
    userPosts, _ := user.QueryPosts().All(context.Background())
}
```

### 4.2 多对多

```go
// 定义
func (User) Edges() []ent.Edge {
    return []ent.Edge{
        edge.To("groups", Group.Type),
    }
}

func (Group) Edges() []ent.Edge {
    return []ent.Edge{
        edge.From("users", User.Type),
    }
}

// 查询用户的组
groups, err := client.User.
    Query().
    All(context.Background())

for _, user := range users {
    userGroups, _ := user.QueryGroups().All(context.Background())
}
```

### 4.3 反向查询

```go
// 从文章查询用户
post, _ := client.Post.Get(context.Background(), 1)
owner, _ := post.QueryOwner().Only(context.Background())
```

---

## 五、事务

### 5.1 基础事务

```go
err := client.Tx(context.Background(), func(tx *ent.Tx) error {
    _, err := tx.User.
        Create().
        SetName("zhangsan").
        Save(context.Background())
    if err != nil {
        return err
    }
    return nil
})
```

### 5.2 回滚

```go
err := client.Tx(context.Background(), func(tx *ent.Tx) error {
    _, err := tx.User.Create().SetName("zhangsan").Save(context.Background())
    if err != nil {
        return tx.Rollback()
    }
    return nil
})
```

---

## 六、Hook

### 6.1 创建Hook

```go
// 创建前Hook
user.Use(func(next ent.Mutator) ent.Mutator {
    return ent.MutatorFunc(func(ctx context.Context) (ent.Ent, error) {
        fmt.Println("before create")
        return next.Mutate(ctx)
    })
}))
```

### 7.2 查询Hook

```go
// 查询Hook
user.Query().Use(func(next ent.Querier) ent.Querier {
    return ent.QuerierFunc(func(ctx context.Context, query ent.Query) (ent.Ent, error) {
        fmt.Println("before query")
        return next.Query(ctx, query)
    })
}))
```

---

## 七、实战技巧

### 7.1 复杂查询

```go
// AND条件
users, err := client.User.
    Query().
    Where(
        user.AgeGTE(18),
        user.NameContains("张"),
    ).
    All(context.Background())

// OR条件
users, err := client.User.
    Query().
    Where(
        user.Or(
            user.NameEQ("zhangsan"),
            user.NameEQ("lisi"),
        ),
    ).
    All(context.Background())

// 排序
users, err := client.User.
    Query().
    Order(ent.Desc(user.FieldAge), ent.Asc(user.FieldName)).
    All(context.Background())
```

### 7.2 聚合查询

```go
// 计数
count, err := client.User.Query().Count(context.Background())

// 求和
sum, err := client.User.Query().SumInt(context.Background(), func(s sql.Selector) string {
    return user.FieldAge
})
```

### 7.3 软删除

```go
// 定义
func (User) Fields() []ent.Field {
    return []ent.Field{
        field.Time("deleted_at"),
    }
}

// 查询时排除
users, err := client.User.
    Query().
    Where(user.DeletedAtIsNil()).
    All(context.Background())
```

---

## 八、与其他ORM对比

| 特性 | ent | GORM | xorm |
|------|-----|------|------|
| 类型安全 | ✓ | ✗ | ✗ |
| 代码生成 | ✓ | ✗ | ✗ |
| 性能 | 高 | 高 | 很高 |
| 生态 | growing | mature | mature |

---

ent是Go语言ORM的"新生代"：

1. **代码生成**：编译时类型安全
2. **强类型API**：代码补全友好
3. **图结构**：支持复杂关联
4. **Meta验证**：Facebook生产验证

Go 1.18+ 泛型时代的首选ORM！

---

>