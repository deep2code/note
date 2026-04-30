# fsnotify：Go语言文件监控完全指南

> 在Go语言开发中，文件监控是实现热重载、即时编译等功能的基石。fsnotify是Go语言最流行的跨平台文件监控库，支持Linux、macOS、Windows。本文带你深入了解fsnotify。

---

## 一、fsnotify简介

### 1.1 为什么选择fsnotify？

fsnotify是Go语言跨平台文件监控库，特点：

| 特性 | 说明 |
|------|------|
| 跨平台 | Linux/macOS/Windows |
| 事件丰富 | Create/Write/Remove等 |
| 递归监控 | 子目录监控 |
| 稳定可靠 | 长期维护 |

### 1.2 监控事件

| 事件 | 说明 |
|------|------|
| CREATE | 文件创建 |
| WRITE | 文件写入 |
| REMOVE | 文件删除 |
| RENAME | 文件重命名 |
| CHMOD | 权限变更 |

---

## 二、快速开始

### 2.1 安装

```go
go get github.com/fsnotify/fsnotify
```

### 2.2 最简示例

```go
package main

import (
    "fmt"
    "github.com/fsnotify/fsnotify"
)

func main() {
    watcher, _ := fsnotify.NewWatcher()
    defer watcher.Close()
    
    watcher.Add(".")
    
    for {
        select {
        case event, ok := <-watcher.Events:
            if !ok {
                return
            }
            fmt.Printf("%s %s\n", event.Op, event.Name)
        case err, ok := <-watcher.Errors:
            if !ok {
                return
            }
            fmt.Println("error:", err)
        }
    }
}
```

---

## 三、基础用法

### 3.1 创建监控

```go
// 新建监控器
watcher, err := fsnotify.NewWatcher()
if err != nil {
    return err
}
defer watcher.Close()
```

### 3.2 添加监控

```go
// 监控文件
watcher.Add("/path/to/file")

// 监控目录
watcher.Add("/path/to/dir")

// 监控多个
watcher.Add("./dir1")
watcher.Add("./dir2")
```

### 3.3 移除监控

```go
watcher.Remove("/path/to/file")
```

---

## 四、事件处理

### 4.1 事件类型

```go
for {
    select {
    case event, ok := <-watcher.Events:
        if !ok {
            return
        }
        
        // 判断事件类型
        if event.Has(fsnotify.Create) {
            fmt.Println("created:", event.Name)
        }
        if event.Has(fsnotify.Write) {
            fmt.Println("modified:", event.Name)
        }
        if event.Has(fsnotify.Remove) {
            fmt.Println("removed:", event.Name)
        }
        if event.Has(fsnotify.Rename) {
            fmt.Println("renamed:", event.Name)
        }
        if event.Has(fsnotify.Chmod) {
            fmt.Println("chmod:", event.Name)
        }
    }
}
```

### 4.2 事件组合

```go
// 写入或创建
if event.Has(fsnotify.Write | fsnotify.Create) {
    fmt.Println("written:", event.Name)
}
```

---

## 五、高级用法

### 5.1 递归监控

```go
func watchDir(path string, watcher *fsnotify.Watcher) error {
    return filepath.Walk(path, func(walkPath string, info os.FileInfo, err error) error {
        if info.IsDir() {
            return watcher.Add(walkPath)
        }
        return nil
    })
}
```

### 5.2 防抖处理

```go
import (
    "time"
)

var debounce = make(map[string]*time.Timer)

for {
    select {
    case event := <-watcher.Events:
        if existing := debounce[event.Name]; existing != nil {
            existing.Stop()
        }
        
        debounce[event.Name] = time.AfterFunc(100*time.Millisecond, func() {
            fmt.Println("processed:", event.Name)
        })
    }
}
```

### 5.3 错误处理

```go
for {
    select {
    case event, ok := <-watcher.Events:
        if !ok {
            return
        }
        fmt.Println("event:", event)
        
    case err, ok := <-watcher.Errors:
        if !ok {
            return
        }
        fmt.Println("error:", err)
    }
}
```

---

## 六、实战技巧

### 6.1 配置文件监控

```go
func watchConfig(watcher *fsnotify.Watcher, filename string) error {
    watcher.Add(filename)
    
    go func() {
        for {
            select {
            case event, ok := <-watcher.Events:
                if !ok {
                    return
                }
                if event.Has(fsnotify.Write) {
                    reloadConfig()
                }
            }
        }
    }()
    
    return nil
}
```

### 6.2 模板热重载

```go
func watchTemplates(watcher *fsnotify.Watcher, dir string) error {
    watcher.Add(dir)
    
    go func() {
        for {
            select {
            case event, ok := <-watcher.Events:
                if !ok {
                    return
                }
                if strings.HasSuffix(event.Name, ".html") {
                    rebuildTemplates()
                }
            }
        }
    }()
    
    return nil
}
```

### 6.3 文件同步

```go
func watchAndSync(watcher *fsnotify.Watcher, src, dst string) error {
    watcher.Add(src)
    
    go func() {
        for {
            select {
            case event, ok := <-watcher.Events:
                if !ok {
                    return
                }
                if event.Has(fsnotify.Write) {
                    syncFile(src, dst)
                }
            }
        }
    }()
    
    return nil
}
```

---

## 七、注意事项

### 7.1 平台限制

| 平台 | 说明 |
|------|------|
| Linux | inotify |
| macOS | FSEvents |
| Windows | ReadDirectoryChangesW |

### 7.2 性能建议

```go
// ✓ 监控多个目录
watcher.Add("./dir1")
watcher.Add("./dir2")

// ✓ 防抖处理
time.AfterFunc(100*time.Millisecond, func() {...})

// ✗ 不要在事件中做耗时操作
// 在goroutine中处理
```

---

fsnotify是Go语言文件监控的"首选"：

1. **跨平台**：Linux/macOS/Windows
2. **事件丰富**：Create/Write/Remove等
3. **递归监控**：子目录支持
4. **简单易用**：API直观

实现热重载的必备工具！

---

>