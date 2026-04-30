# net/url完全指南

## 📖 包简介

`net/url` 是Go标准库中负责URL解析和操作的工具包。URL（统一资源定位符）看起来简单——不就是`https://example.com/path?key=value#anchor`嘛——但真正解析起来细节繁多：编码、转义、协议、主机、端口、路径、查询参数、片段... 一个不小心就会踩坑。

这个包提供了完整的URL解析、构建、编码和解码能力。无论是从用户输入中提取参数，还是拼接API请求地址，亦或是实现OAuth回调的重定向逻辑，`net/url`都是你最可靠的搭档。

Go 1.26为这个包带来了一个重要更新：`Parse`函数现在会拒绝主机部分包含冒号的畸形URL（例如`http://::1/`），让URL解析更加严格和安全。同时提供了`GODEBUG=urlstrictcolons=0`环境变量来兼容旧代码。这个变更看似微小，却能有效拦截大量潜在的安全问题。

## 🎯 核心功能概览

| 类型/函数 | 用途 | 说明 |
|-----------|------|------|
| `url.Parse` | 解析URL字符串 | 返回`*URL`结构体 |
| `url.ParseRequestURI` | 解析请求URI | 比Parse更严格 |
| `url.QueryEscape` | 查询参数编码 | 用于URL查询字符串 |
| `url.QueryUnescape` | 查询参数解码 | 解码查询字符串 |
| `url.PathEscape` | 路径编码 | 用于URL路径部分 |
| `url.PathUnescape` | 路径解码 | 解码路径部分 |
| `url.Values` | 查询参数集合 | `map[string][]string`类型 |
| `URL` 结构体 | URL表示 | 包含Scheme、Host、Path等字段 |

## 💻 实战示例

### 示例1：基础URL解析与构建

```go
package main

import (
	"fmt"
	"log"
	"net/url"
)

func main() {
	// ========== 解析URL ==========
	rawURL := "https://user:pass@www.example.com:8080/api/v1/users?role=admin&status=active#section1"

	u, err := url.Parse(rawURL)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("=== 解析结果 ===")
	fmt.Printf("Scheme:   %s\n", u.Scheme)
	fmt.Printf("User:     %s\n", u.User)
	fmt.Printf("Host:     %s\n", u.Host)
	fmt.Printf("Hostname: %s\n", u.Hostname())
	fmt.Printf("Port:     %s\n", u.Port())
	fmt.Printf("Path:     %s\n", u.Path)
	fmt.Printf("Query:    %s\n", u.RawQuery)
	fmt.Printf("Fragment: %s\n", u.Fragment)

	// 解析查询参数
	params, _ := url.ParseQuery(u.RawQuery)
	fmt.Println("\n=== 查询参数 ===")
	fmt.Printf("role:   %v\n", params.Get("role"))
	fmt.Printf("status: %v\n", params.Get("status"))

	// ========== 构建URL ==========
	newURL := &url.URL{
		Scheme: "https",
		Host:   "api.example.com",
		Path:   "/v2/search",
	}

	// 添加查询参数
	q := newURL.Query()
	q.Set("q", "golang url")
	q.Set("page", "1")
	q.Set("limit", "20")
	newURL.RawQuery = q.Encode()

	fmt.Println("\n=== 构建的URL ===")
	fmt.Println(newURL.String())
}
```

### 示例2：查询参数的安全处理

```go
package main

import (
	"fmt"
	"net/url"
	"sort"
	"strings"
)

// APIRequest 构建安全的API请求URL
type APIRequest struct {
	baseURL string
	params  url.Values
}

// NewAPIRequest 创建API请求构建器
func NewAPIRequest(baseURL string) *APIRequest {
	return &APIRequest{
		baseURL: baseURL,
		params:  make(url.Values),
	}
}

// SetParam 设置参数
func (a *APIRequest) SetParam(key, value string) *APIRequest {
	a.params.Set(key, value)
	return a
}

// SetMultiParam 设置多值参数
func (a *APIRequest) SetMultiParam(key string, values ...string) *APIRequest {
	for _, v := range values {
		a.params.Add(key, v)
	}
	return a
}

// Build 构建完整URL
func (a *APIRequest) Build() (*url.URL, error) {
	u, err := url.Parse(a.baseURL)
	if err != nil {
		return nil, fmt.Errorf("parse base URL: %w", err)
	}

	// 验证scheme
	if u.Scheme != "https" {
		return nil, fmt.Errorf("only HTTPS allowed, got: %s", u.Scheme)
	}

	u.RawQuery = a.params.Encode()
	return u, nil
}

// BuildSignedURL 构建带签名的URL（示例）
func (a *APIRequest) BuildSignedURL(secret string) (*url.URL, error) {
	u, err := a.Build()
	if err != nil {
		return nil, err
	}

	// 对参数排序，构建签名字符串
	params := u.Query()
	keys := make([]string, 0, len(params))
	for k := range params {
		if k != "sign" {
			keys = append(keys, k)
		}
	}
	sort.Strings(keys)

	var signParts []string
	for _, k := range keys {
		signParts = append(signParts, fmt.Sprintf("%s=%s", k, params.Get(k)))
	}
	signString := strings.Join(signParts, "&") + "&secret=" + secret

	// 简单MD5签名示例（实际项目应使用更安全的算法）
	params.Set("sign", fmt.Sprintf("%x", []byte(signString)))
	u.RawQuery = params.Encode()

	return u, nil
}

func main() {
	// 基础用法
	req := NewAPIRequest("https://api.example.com/search")
	req.SetParam("q", "golang教程")
	req.SetMultiParam("tags", "go", "backend", "tutorial")
	req.SetParam("sort", "-created_at")

	u, err := req.Build()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("=== 基础URL ===")
	fmt.Println(u.String())

	// 带签名的URL
	signedURL, err := req.BuildSignedURL("my-secret-key")
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Println("\n=== 带签名的URL ===")
	fmt.Println(signedURL.String())

	// 编码演示
	fmt.Println("\n=== 编码演示 ===")
	fmt.Println("QueryEscape:", url.QueryEscape("golang 教程 & 实战"))
	fmt.Println("PathEscape:", url.PathEscape("golang 教程/实战"))
	fmt.Println("PathEncode:", url.PathEscape("path/with/slashes"))
}
```

### 示例3：URL中间件与过滤器

```go
package main

import (
	"fmt"
	"log"
	"net/url"
	"regexp"
	"strings"
)

// URLValidator URL验证器
type URLValidator struct {
	allowedSchemes map[string]bool
	allowedHosts   []*regexp.Regexp
	blockedHosts   []*regexp.Regexp
	maxPathLength  int
}

// NewURLValidator 创建URL验证器
func NewURLValidator() *URLValidator {
	return &URLValidator{
		allowedSchemes: map[string]bool{
			"http":  true,
			"https": true,
		},
		maxPathLength: 2048,
	}
}

// AllowHost 允许的主机模式
func (v *URLValidator) AllowHost(pattern string) {
	v.allowedHosts = append(v.allowedHosts, regexp.MustCompile(
		`^`+regexp.QuoteMeta(pattern)+`$`,
	))
}

// BlockHost 阻止的主机模式
func (v *URLValidator) BlockHost(pattern string) {
	v.blockedHosts = append(v.blockedHosts, regexp.MustCompile(
		`^`+regexp.QuoteMeta(pattern)+`$`,
	))
}

// Validate 验证URL是否合法
func (v *URLValidator) Validate(rawURL string) (*url.URL, error) {
	u, err := url.Parse(rawURL)
	if err != nil {
		return nil, fmt.Errorf("parse url: %w", err)
	}

	// 检查协议
	if !v.allowedSchemes[strings.ToLower(u.Scheme)] {
		return nil, fmt.Errorf("scheme %q not allowed", u.Scheme)
	}

	// 检查路径长度
	if len(u.Path) > v.maxPathLength {
		return nil, fmt.Errorf("path too long: %d > %d", len(u.Path), v.maxPathLength)
	}

	// 检查阻止的主机
	host := strings.ToLower(u.Hostname())
	for _, pattern := range v.blockedHosts {
		if pattern.MatchString(host) {
			return nil, fmt.Errorf("host %q is blocked", host)
		}
	}

	// 检查允许的主机（如果配置了）
	if len(v.allowedHosts) > 0 {
		allowed := false
		for _, pattern := range v.allowedHosts {
			if pattern.MatchString(host) {
				allowed = true
				break
			}
		}
		if !allowed {
			return nil, fmt.Errorf("host %q not in whitelist", host)
		}
	}

	return u, nil
}

// URLNormalizer URL标准化器
type URLNormalizer struct {
	forceHTTPS bool
	removeWWW  bool
	trailingSlash bool
}

// Normalize 标准化URL
func (n *URLNormalizer) Normalize(u *url.URL) *url.URL {
	// 克隆URL
	normalized := *u

	// 强制HTTPS
	if n.forceHTTPS && normalized.Scheme == "http" {
		normalized.Scheme = "https"
	}

	// 移除www
	if n.removeWWW {
		host := normalized.Hostname()
		if strings.HasPrefix(host, "www.") {
			normalized.Host = strings.TrimPrefix(host, "www.")
			if normalized.Port() != "" {
				normalized.Host += ":" + normalized.Port()
			}
		}
	}

	// 处理尾斜杠
	if n.trailingSlash && !strings.HasSuffix(normalized.Path, "/") {
		normalized.Path += "/"
	}

	// 清理路径中的..和.
	normalized.Path = cleanPath(normalized.Path)

	return &normalized
}

func cleanPath(path string) string {
	if path == "" {
		return "/"
	}
	// 使用url包的Clean逻辑
	return path
}

func main() {
	// 验证器示例
	validator := NewURLValidator()
	validator.AllowHost(`.*\.example\.com`)
	validator.BlockHost(`malware\.example\.com`)

	testURLs := []string{
		"https://api.example.com/v1/users",
		"https://malware.example.com/evil",
		"ftp://files.example.com/data",
		"https://unknown.com/page",
	}

	fmt.Println("=== URL验证 ===")
	for _, rawURL := range testURLs {
		_, err := validator.Validate(rawURL)
		if err != nil {
			fmt.Printf("❌ %s\n   原因: %v\n", rawURL, err)
		} else {
			fmt.Printf("✅ %s\n", rawURL)
		}
	}

	// 标准化器示例
	normalizer := &URLNormalizer{
		forceHTTPS:    true,
		removeWWW:     true,
		trailingSlash: true,
	}

	fmt.Println("\n=== URL标准化 ===")
	rawURL, _ := url.Parse("http://www.example.com/api/v1")
	normalized := normalizer.Normalize(rawURL)
	fmt.Printf("原始: %s\n", rawURL)
	fmt.Printf("结果: %s\n", normalized)
}
```

## ⚠️ 常见陷阱与注意事项

### 1. URL编码的选择
有三个编码函数，用途各不相同：
- `QueryEscape`：用于查询参数（`?key=value`），会将`/`编码为`%2F`
- `PathEscape`：用于URL路径部分，会保留`/`不编码
- `PathSegmentEscape`：用于路径段，编码规则介于两者之间

```go
// 错误示范 - 路径中使用了QueryEscape
url := "https://api.com/" + url.QueryEscape("a/b/c")
// 结果: https://api.com/a%2Fb%2Fc（变成了单个路径段）

// 正确示范 - 使用PathEscape
url := "https://api.com/" + url.PathEscape("a/b/c")
// 结果: https://api.com/a/b/c（保留了路径结构）
```

### 2. Query.Get vs Query["key"]
`Query.Get("key")`只返回第一个值，而`Query["key"]`返回所有值的切片：
```go
params := url.Values{}
params.Add("tag", "go")
params.Add("tag", "web")

fmt.Println(params.Get("tag"))     // 输出: go
fmt.Println(params["tag"])         // 输出: [go web]
```

### 3. URL.Host包含端口
`URL.Host`字段包含端口（如`example.com:8080`），而`URL.Hostname()`和`URL.Port()`分别提取主机名和端口：
```go
u, _ := url.Parse("https://example.com:8080/path")
fmt.Println(u.Host)      // example.com:8080
fmt.Println(u.Hostname()) // example.com
fmt.Println(u.Port())    // 8080
```

### 4. 相对路径解析的坑
`URL.ResolveReference`用于解析相对路径，但行为可能与预期不同：
```go
base, _ := url.Parse("https://example.com/a/b/c")
ref, _ := url.Parse("../d")
resolved := base.ResolveReference(ref)
fmt.Println(resolved) // https://example.com/a/d（不是/b/d）
```

### 5. Go 1.26冒号严格校验
Go 1.26起，`Parse`会拒绝主机部分包含冒号的URL。例如`http://::1/`会被拒绝（因为主机部分是`::1`，包含冒号）。如果你的代码解析IPv6地址URL受到影响，可以通过环境变量回退：
```bash
# 恢复旧行为
GODEBUG=urlstrictcolons=0 go run main.go
```

## 🚀 Go 1.26新特性

### 更严格的冒号校验

Go 1.26的`url.Parse`现在会拒绝主机部分（host portion）包含冒号的畸形URL。这是一个安全增强措施，因为主机部分的冒号可能导致解析歧义，甚至被利用进行URL混淆攻击。

**受影响的URL示例**:
```
http://::1/          ❌ 拒绝（旧版本会解析为host="::1"）
http://[::1]:8080/   ✅ 允许（IPv6地址用方括号包裹是合法的）
http://example.com/  ✅ 允许
```

**如何兼容**:
如果旧代码依赖之前的宽松行为，可以设置环境变量：
```bash
GODEBUG=urlstrictcolons=0
```

**正确的IPv6 URL写法**:
```go
// 正确 - IPv6地址用方括号包裹
u, err := url.Parse("http://[::1]:8080/path")

// 使用url.URL结构体构建
u := &url.URL{
    Scheme: "http",
    Host:   "[::1]:8080", // 注意：需要手动加方括号
    Path:   "/path",
}
```

## 📊 性能优化建议

```mermaid
graph LR
    A[URL处理优化] --> B[复用Values对象]
    A --> C[避免重复解析]
    A --> D[使用strings.Builder拼接]
    B --> E[减少map分配]
    C --> F[缓存解析结果]
    D --> G[减少字符串分配]
```

**关键优化技巧**:

1. **复用`url.Values`对象**：在循环中构建URL时，清空并复用`Values`而非重新创建
2. **缓存解析结果**：频繁使用的URL提前解析并缓存
3. **批量添加参数**：使用`Values.Add`比字符串拼接更高效且安全
4. **避免不必要的编码**：如果输入已经是安全字符，可以跳过编码

```go
// 性能对比
// 慢：每次创建新Values
for i := 0; i < 10000; i++ {
    params := make(url.Values)
    params.Set("key", value)
}

// 快：复用Values对象
params := make(url.Values)
for i := 0; i < 10000; i++ {
    params.Set("key", value)
    // 使用params...
    params.Del("key") // 清空
}
```

## 🔗 相关包推荐

- `net/http` - HTTP客户端和服务器
- `net/url` - URL解析
- `net/netip` - IP地址解析
- `path/filepath` - 文件路径操作
- `encoding/json` - JSON编码解码（常与URL参数配合）
- `crypto/hmac` - URL签名验证

---