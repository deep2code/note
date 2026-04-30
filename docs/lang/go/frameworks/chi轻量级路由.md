# chi：Go语言轻量级路由库的完全指南

> 在Go语言Web框架中，chi以其轻量、高性能著称。它仅约1000行代码，却提供了完整的路由能力，是构建高性能API的绝佳选择。本文带你深入了解chi。

---

## 一、chi简介

### 1.1 为什么选择chi？

chi是go-chi团队开发的轻量级路由库，特点：

| 特性 | 说明 |
|------|------|
| 轻量 | 仅约1000行代码 |
| 高性能 | 与Gin相当 |
| 中间件 | 完整的中间件支持 |
| RESTful | 原生RESTful设计 |

代码量对比：

| 框架 | 代码行数 |
|------|----------|
| chi | ~1000 |
| Echo | ~2000 |
| Gin | ~5000 |
| go-zero | ~10000 |

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/go-chi/chi/v5
```

### 2.2 最简示例

```go
package main

import (
    "net/http"
    "github.com/go-chi/chi/v5"
    "github.com/go-chi/chi/v5/middleware"
)

func main() {
    r := chi.NewRouter()
    
    // 中间件
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    
    // 路由
    r.Get("/", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello chi!"))
    })
    
    http.ListenAndServe(":3000", r)
}
```

---

## 三、路由系统

### 3.1 HTTP方法路由

```go
r.Get("/users", handler)
r.Post("/users", handler)
r.Put("/users/{id}", handler)
r.Delete("/users/{id}", handler)
r.Patch("/users/{id}", handler)
r.Options("/users", handler)
r.Head("/users", handler)
```

### 3.2 路径参数

```go
// 参数路由
r.Get("/user/{id}", handler)

// 多参数
r.Get("/user/{id}/post/{postId}", handler)

// 通配符
r.Get("/files/*", handler)

// 正则（需注册）
r.Get("/user/{id:[0-9]+}", handler)
```

### 3.3 路由组

```go
// 路由组
r.Route("/api", func(r chi.Router) {
    r.Get("/users", handler)
    r.Post("/users", handler)
})

// 中间件+路由组
r.Group("/admin", func(r chi.Router) {
    r.Use(adminMiddleware)
    r.Get("/users", handler)
})
```

---

## 四、中间件

### 4.1 内置中间件

```go
import "github.com/go-chi/chi/v5/middleware"

// 日志
r.Use(middleware.Logger)

// Recover
r.Use(middleware.Recoverer)

// CORS
r.Use(middleware.CORS(
    middleware.Headers("Content-Type", "Authorization"),
    middleware.Methods("GET", "POST", "PUT"),
))

// 请求ID
r.Use(middleware.RequestID)

// 超时
r.Use(middleware.Timeout(60 * time.Second))

// 压缩
r.Use(middleware.Compress(5))
```

### 4.2 自定义中间件

```go
funcLoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("[%s] %s %s", r.Method, r.URL.Path, time.Since(start))
    })
}

r.Use(LoggingMiddleware)
```

### 4.3 中间件链

```go
// 顺序执行
r.Use(middleware.RequestID)
r.Use(middleware.Logger)
r.Use(middleware.Recoverer)
```

---

## 五、请求处理

### 5.1 获取参数

```go
func handler(w http.ResponseWriter, r *http.Request) {
    // 路径参数
    id := chi.URLParam(r, "id")
    
    // Query参数
    page := r.URL.Query().Get("page")
    size := r.URL.Query().Get("size")
    
    // 表单参数
    r.ParseForm()
    name := r.FormValue("name")
    
    // JSON Body
    var req map[string]interface{}
    json.NewDecoder(r.Body).Decode(&req)
}
```

### 5.2 响应

```go
// JSON
w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(map[string]string{"msg": "ok"})

// 文本
w.Write([]byte("Hello"))

// 状态码
w.WriteHeader(http.StatusOK)
```

---

## 六、路由匹配

### 6.1 自定义模式

```go
// 注册正则
r.With(middleware.URLFormat).Route("/user/{id}", func(r chi.Router) {
    r.Get("/", handler)
})

// 自定义匹配
r.Method("GET", "/user/{id:[0-9]+}", handler)
```

### 6.2 优先级

```
1. 精确匹配  /user/123
2. 参数匹配  /user/{id}
3. 通配符   /files/*
```

---

## 七、context传递

### 7.1 Request Context

```go
r.Get("/user/{id}", func(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    user, _ := ctx.Value("user").(*User)
    
    json.NewEncoder(w).Encode(user)
})
```

### 7.2 中间件传递

```go
func userContextMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := context.WithValue(r.Context(), "user", currentUser)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

---

## 八、最佳实践

### 8.1 项目结构

```
handler/
├── user.go
│   router.go
├── post.go
│   router.go
└── main.go
```

### 8.2 封装

```go
func NewRouter() *chi.Mux {
    r := chi.NewRouter()
    
    r.Use(middleware.RequestID)
    r.Use(middleware.Logger)
    r.Use(middleware.Recoverer)
    
    return r
}
```

---

## 九、与Gin对比

| 特性 | chi | Gin |
|------|-----|-----|
| 代码量 | ~1000 | ~5000 |
| 性能 | 很高 | 很高 |
| API风格 | 标准库 | 自定义 |
| 中间件 | ✓ | ✓ |

---

chi是Go语言轻量级路由的"首选"：

1. **轻量**：仅约1000行
2. **高性能**：与Gin相当
3. **标准兼容**：基于标准库
4. **RESTful**：原生RESTful

追求轻量和高性能的首选！

---

>