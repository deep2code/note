# Cobra：Go语言CLI框架的完全指南

> 在Go语言开发中，命令行工具（CLI）是日常开发的必备工具。Cobra是GitHub官方推荐的CLI框架，被kubectl、docker、Hugo等著名工具采用。本文带你深入了解Cobra。

---

## 一、Cobra简介

### 1.1 为什么选择Cobra？

Cobra是spf13团队开发的CLI框架，特点：

| 特性 | 说明 |
|------|------|
| 结构化 | 命令、参数、选项清晰 |
| 子命令 | 支持多级命令嵌套 |
| 自动生成 | goctl自动生成代码 |
| POSIX兼容 | 支持标准命令格式 |

采用Cobra的著名工具：

```
kubectl         # Kubernetes CLI
docker          # Docker CLI
hugo            # 静态网站生成器
grype           # 漏洞扫描器
```

---

## 二、快速开始

### 2.1 安装工具

```bash
go install github.com/spf13/cobra-cli@latest
```

### 2.2 创建项目

```bash
# 初始化项目
mkdir mycli && cd mycli
go mod init mycli

# 自动生成Cobra结构
cobra-cli init
```

### 2.3 手动创建

```go
package main

import (
    "fmt"
    "github.com/spf13/cobra"
)

var (
    name string
)

var greetCmd = &cobra.Command{
    Use:   "greet",
    Short: "Say hello",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Printf("Hello, %s!\n", name)
    },
}

func main() {
    greetCmd.Flags().StringVarP(&name, "name", "n", "World", "Your name")
    
    rootCmd := &cobra.Command{
        Use:   "mycli",
        Short: "My CLI Application",
    }
    rootCmd.AddCommand(greetCmd)
    
    rootCmd.Execute()
}
```

---

## 三、核心概念

### 3.1 命令结构

```go
var cmd = &cobra.Command{
    Use:   "create",           // 命令名称
    Short: "Create a resource", // 简短描述
    Long:  `Create a new...`,  // 详细描述
    Run: func(cmd *cobra.Command, args []string) {
        // 执行逻辑
    },
}
```

### 3.2 参数与选项

```go
// 位置参数
var createCmd = &cobra.Command{
    Use:   "create <resource>",
    Args:  cobra.ExactArgs(1),  // 必须1个参数
    ValidArgsFunction: func(cmd *cobra.Command, args []string, toComplete string) ([]string, cobra.ShellCompDirective) {
        return []string{"user", "role"}, cobra.ShellCompDirectiveNoSpace
    },
}

// 选项参数
var userCmd = &cobra.Command{
    Use:   "user",
    Short: "User operations",
    Flags: []*cobra.Flag{
        {Name: "name", Shorthand: "n", Usage: "User name"},
        {Name: "email", Shorthand: "e", Usage: "Email address"},
        {Name: "admin", Usage: "Is admin", DefValue: "false"},
    },
}
```

### 3.3 子命令

```go
// 创建用户子命令
var createUserCmd = &cobra.Command{
    Use:   "user <name>",
    Short: "Create a user",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("Creating user:", args[0])
    },
}

// 创建角色子命令
var createRoleCmd = &cobra.Command{
    Use:   "role <name>",
    Short: "Create a role",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("Creating role:", args[0])
    },
}

// 组合为create命令
var createCmd = &cobra.Command{
    Use:   "create",
    Short: "Create resources",
}
createCmd.AddCommand(createUserCmd)
createCmd.AddCommand(createRoleCmd)
```

---

## 四、高级特性

### 4.1 持久选项

```go
var verbose bool

var rootCmd = &cobra.Command{
    Use:   "app",
    Short: "My Application",
}
rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "Verbose output")
```

### 4.2 预执⾏钩子

```go
var version = "1.0.0"

var versionCmd = &cobra.Command{
    Use:   "version",
    Short: "Print version",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("Version:", version)
    },
}
```

### 4.3 验证函数

```go
var validCmd = &cobra.Command{
    Use:   "valid",
    Short: "Validate input",
    Args:  cobra.RangeArgs(1, 5),  // 1-5个参数
    ValidArgsFunction: func(cmd *cobra.Command, args []string, toComplete string) ([]string, cobra.ShellCompDirective) {
        if len(args) != 0 {
            return nil, cobra.ShellCompDirectiveNoSpace
        }
        return []string{"foo", "bar"}, cobra.ShellCompDirectiveNoSpace
    },
}
```

---

## 五、配置集成

### 5.1 与Viper集成

```go
var rootCmd = &cobra.Command{
    Use:   "app",
    Short: "My Application",
    PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
        return viper.BindPFlags(cmd.Flags())
    },
}
```

### 5.2 自动补全

```go
// Bash自动补全
rootCmd.BashCompletionFns = map[string][]string{
    "create": {"user", "role", "permission"},
}
```

---

## 六、最佳实践

### 6.1 完整项目结构

```
mycli/
├── cmd/
│   ├── root.go
│   ├── create.go
│   ├── delete.go
│   └── list.go
├── main.go
└── go.mod
```

### 6.2 错误处理

```go
var rootCmd = &cobra.Command{
    Use:   "app",
    Short: "My Application",
    PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
        if viper.GetBool("debug") {
            fmt.Println("Debug mode enabled")
        }
        return nil
    },
}
```

### 6.3 用户交互

```go
var confirmCmd = &cobra.Command{
    Use:   "confirm",
    Short: "Ask for confirmation",
    Run: func(cmd *cobra.Command, args []string) {
        if askConfirm() {
            fmt.Println("Confirmed!")
        } else {
            fmt.Println("Cancelled")
        }
    },
}

func askConfirm() bool {
    var yesNo string
    fmt.Print("Continue? [y/N]: ")
    fmt.Scanln(&yesNo)
    return yesNo == "y" || yesNo == "Y"
}
```

---

## 七、与内置flag对比

| 特性 | Cobra | flag标准库 |
|------|------|----------|
| 子命令 | ✓ | ✗ |
| 层级结构 | ✓ | ✗ |
| 自动补全 | ✓ | ✗ |
| 帮助生成 | ✓ | ✓ |
| 使用难度 | 中 | 低 |

---

Cobra是Go语言CLI开发的"事实标准"：

1. **结构清晰**：命令、参数、选项分明
2. **子命令**：支持多级嵌套
3. **自动补全**：提升用户体验
4. **生态强大**：被大量著名工具采用

掌握Cobra，让你的CLI工具更专业！

---

>