# golang.org/x/oauth2：Go语言OAuth2.0的完全指南

> 在现代Web开发中，第三方登录已成为标配。golang.org/x/oauth2是Go官方维护的OAuth2.0库，支持Google、GitHub、Facebook等主流平台。本文带你深入了解oauth2。

---

## 一、oauth2简介

### 1.1 什么是OAuth2.0？

OAuth2.0是一种授权框架，让第三方应用在不获取用户密码的情况下访问用户资源：

```
用户 -> 第三方登录 -> 授权 -> 获取Token -> 访问API
```

### 1.2 为什么选择oauth2？

golang.org/x/oauth2是Go官方维护的OAuth库，特点：

| 特性 | 说明 |
|------|------|
| 官方维护 | 稳定可靠 |
| 多平台 | Google、GitHub等 |
| 完整流程 | 授权、刷新、撤销 |
| 无依赖 | 标准库 |

---

## 二、快速开始

### 2.1 安装

```bash
go get golang.org/x/oauth2
```

### 2.2 最简示例

```go
import "golang.org/x/oauth2"

config := &oauth2.Config{
    ClientID:     "YOUR_CLIENT_ID",
    ClientSecret: "YOUR_CLIENT_SECRET",
    Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
    Endpoint: oauth2.Endpoint{
        AuthURL:  "https://accounts.google.com/o/oauth2/auth",
        TokenURL: "https://oauth2.googleapis.com/token",
    },
}
```

---

## 三、核心概念

### 3.1 Config配置

```go
config := &oauth2.Config{
    ClientID:     "client-id",
    ClientSecret: "client-secret",
    Scopes: []string{
        "user:email",
        "user:profile",
    },
    Endpoint: oauth2.Endpoint{
        AuthURL:  "https://auth.example.com/authorize",
        TokenURL: "https://auth.example.com/token",
    },
}
```

### 3.2 Token

```go
token := &oauth2.Token{
    AccessToken:  "access-token",
    TokenType:    "Bearer",
    RefreshToken: "refresh-token",
    Expiry:       time.Now().Add(time.Hour),
}
```

### 3.3 TokenSource

```go
// 方式一：静态Token
tokenSource := oauth2.StaticTokenSource(token)

// 方式二：配置Token
tokenSource := config.TokenSource(context.Background(), token)
```

---

## 四、授权流程

### 4.1 授权码模式

```go
// 1. 生成授权URL
authURL := config.AuthCodeURL("state", oauth2.AccessTypeOffline)

// 2. 用户访问authURL并授权

// 3. 换取Token
code := "authorization-code"
token, err := config.Exchange(context.Background(), code)
```

### 4.2 设备模式

```go
// 设备授权（适用于CLI、无头设备）
deviceConfig := &oauth2.DeviceConfig{Config: config}
deviceResp, err := deviceConfig.Start(context.Background())

// 用户在手机输入deviceResp.UserCode

// 轮询Token
token, err := deviceConfig.Poll(context.Background())
```

### 4.3 客户端凭证模式

```go
// 服务间通信
clientConfig := &oauth2.Config{
    ClientID:     "client-id",
    ClientSecret: "client-secret",
    Scopes:       []string{"api:read"},
    Endpoint: oauth2.Endpoint{
        TokenURL: "https://auth.example.com/token",
    },
}
token, err := clientConfig.Token(context.Background())
```

---

## 五、Token刷新

### 5.1 自动刷新

```go
// TokenSource自动处理刷新
client := config.Client(context.Background(), tokenSource)

// 内部自动处理token过期和刷新
resp, _ := client.Get("https://api.example.com/data")
```

### 5.2 手动刷新

```go
if token.Expired() && token.RefreshToken != "" {
    newToken, err := config.TokenSource(context.Background(), token).Token()
    if err != nil {
        // 刷新失败，重新授权
    }
}
```

### 5.3 无刷新Token

```go
// 某些provider不支持refresh_token
config := &oauth2.Config{
    // ...
}
token, err := config.Exchange(context.Background(), code)
// token无RefreshToken，需重新授权
```

---

## 六、实战技巧

### 6.1 Google登录

```go
import "golang.org/x/oauth2/google"

config := &oauth2.Config{
    ClientID:     googleClientID,
    ClientSecret: googleClientSecret,
    Scopes: []string{
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
    },
    Endpoint: google.Endpoint,
}

// 1. 获取授权URL
authURL := config.AuthCodeURL("state")

// 2. 换取Token
token, err := config.Exchange(ctx, code)

// 3. 获取用户信息
client := config.Client(ctx, token)
resp, _ := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
```

### 6.2 GitHub登录

```go
config := &oauth2.Config{
    ClientID:     githubClientID,
    ClientSecret: githubClientSecret,
    Scopes:       []string{"user:email", "read:user"},
    Endpoint: oauth2.Endpoint{
        AuthURL:  "https://github.com/login/oauth/authorize",
        TokenURL: "https://github.com/login/oauth/access_token",
    },
}
```

### 6.3 多Provider

```go
type Provider struct {
    name   string
    config *oauth2.Config
}

providers := map[string]*Provider{
    "google": {name: "Google", config: googleConfig},
    "github": {name: "GitHub", config: githubConfig},
}
```

---

## 七、HTTP客户端

### 7.1 自动Token注入

```go
client := config.Client(context.Background(), tokenSource)

// 自动在请求头注入Authorization: Bearer <token>
resp, err := client.Get("https://api.example.com/data")
```

### 7.2 HTTPClient复用

```go
httpClient := &http.Client{
    Transport: &oauth2.Transport{
        Source: tokenSource,
    },
}

resp, _ := httpClient.Get("https://api.example.com/1")
resp, _ = httpClient.Get("https://api.example.com/2")
```

### 7.3 Context传递

```go
import "context"

ctx := context.WithValue(
    context.Background(), 
    oauth2.HTTPClient, 
    httpClient,
)

client := config.Client(ctx, token)
```

---

## 八、最佳实践

### 8.1 Token存储

```go
type TokenStore struct {
    file string
}

func (s *TokenStore) SaveToken(token *oauth2.Token) error {
    data, _ := json.Marshal(token)
    return os.WriteFile(s.file, data, 0600)
}

func (s *TokenStore) LoadToken() (*oauth2.Token, error) {
    data, err := os.ReadFile(s.file)
    if err != nil {
        return nil, err
    }
    var token oauth2.Token
    json.Unmarshal(data, &token)
    return &token, nil
}
```

### 8.2 安全存储

```go
// 生产环境使用加密存储
// - 数据库加密
// - Keychain (macOS)
// - Credential Manager (Windows)
```

### 8.3 Token撤销

```go
// 登出时撤销Token
revokeURL := "https://oauth2.googleapis.com/revoke"
params := url.Values{}
params.Set("token", token.AccessToken)

http.PostForm(revokeURL, params)
```

---

## 九、与其他方案对比

| 方案 | 说明 |
|------|------|
| oauth2 | Go官方维护，稳定 |
| go-oauth2 | 社区实现 |
| jwt | Token编码 |

---

golang.org/x/oauth2是Go语言OAuth2.0的"首选"：

1. **官方维护**：稳定可靠
2. **多平台**：支持主流provider
3. **完整流程**：授权、刷新、撤销
4. **生产验证**：大量项目验证

掌握oauth2，让第三方登录更简单！

---

>