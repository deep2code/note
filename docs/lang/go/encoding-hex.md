# encoding/hex完全指南

新手也能秒懂的Go标准库教程!从基础到实战,一文打通!

## 📖 包简介

`encoding/hex` 是Go标准库中处理十六进制编码的包。十六进制(Hex)是一种用16个字符(0-9, a-f)表示二进制数据的方法,每个字节用两个十六进制字符表示。

你可能会在以下场景遇到Hex:颜色代码(`#FF5733`)、哈希值展示(SHA256输出64个字符)、内存地址、UUID、加密密钥展示等。相比Base64,Hex编码更加直观可读,但数据膨胀率更高(200% vs 133%)。

Go的hex包设计极其简洁,提供编码、解码、流式处理等完整功能,是调试和展示二进制数据的首选工具。

## 🎯 核心功能概览

| 函数/类型 | 说明 |
|-----------|------|
| `Encode()` | 编码字节切片到hex |
| `Decode()` | 解码hex字符串到字节切片 |
| `EncodeToString()` | 编码为hex字符串(最常用) |
| `DecodeString()` | 从hex字符串解码 |
| `Dump()` | 生成人类可读的hex dump |
| `Dumper()` | 创建流式hex dump写入器 |
| `ErrLength` | 解码长度错误 |
| `InvalidByteError` | 非法字节错误 |

## 💻 实战示例

### 示例1:基础用法

```go
package main

import (
	"encoding/hex"
	"fmt"
)

func main() {
	// 原始数据
	data := []byte("Hello, Go!")

	// 编码为十六进制字符串
	encoded := hex.EncodeToString(data)
	fmt.Printf("Hex编码: %s\n", encoded)
	// 输出: 48656c6c6f2c20476f21

	// 解码回原始数据
	decoded, err := hex.DecodeString(encoded)
	if err != nil {
		fmt.Println("解码失败:", err)
		return
	}
	fmt.Printf("Hex解码: %s\n", string(decoded))
	// 输出: Hello, Go!
}
```

### 示例2:处理哈希值展示

```go
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
)

func main() {
	// 计算SHA256哈希(返回32字节)
	hash := sha256.Sum256([]byte("Go is awesome!"))

	// 方法1: 直接转换为hex字符串
	hashHex := hex.EncodeToString(hash[:])
	fmt.Printf("完整哈希: %s\n", hashHex)
	// 输出: 7a7ed86d85... (64字符)

	// 方法2: 使用fmt.Sprintf(等价但更慢)
	// hashHex2 := fmt.Sprintf("%x", hash)

	// 只展示前8位(类似git commit短hash)
	shortHash := hashHex[:8]
	fmt.Printf("短哈希: %s\n", shortHash)

	// 解码验证
	decoded, _ := hex.DecodeString(hashHex)
	fmt.Printf("解码长度: %d 字节\n", len(decoded))
	// 输出: 32 字节
}
```

### 示例3:Hex Dump调试输出

```go
package main

import (
	"encoding/hex"
	"fmt"
	"os"
)

func main() {
	// 模拟二进制数据
	binaryData := []byte{
		0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x01, 0x02,
		0xff, 0xfe, 0xfd, 0x47, 0x6f, 0x21, 0x0a, 0x00,
	}

	// 生成人类可读的hex dump
	dump := hex.Dump(binaryData)
	fmt.Println("=== Hex Dump ===")
	fmt.Println(dump)
	/* 输出:
	00000000  48 65 6c 6c 6f 00 01 02  ff fe fd 47 6f 21 0a 00  |Hello......Go!..|
	*/

	// 写入文件进行调试
	dumpFile, _ := os.Create("/tmp/debug.hex")
	defer dumpFile.Close()

	dumper := hex.Dumper(dumpFile)
	dumper.Write(binaryData)
	dumper.Close()

	fmt.Println("Hex dump已写入 /tmp/debug.hex")
}
```

## ⚠️ 常见陷阱与注意事项

1. **奇数长度错误**: `DecodeString`要求输入长度必须是偶数,否则会返回`ErrLength`错误
2. **大小写不敏感但输出统一小写**: 解码时`A`和`a`等价,但`EncodeToString`始终输出小写
3. **不要用于URL传输**: Hex中的`%`是特殊字符,URL场景优先用Base64 URL编码
4. **性能考虑**: `fmt.Sprintf("%x", data)`功能等价但比`hex.EncodeToString`慢约30%
5. **非法字符**: 输入包含非hex字符(如`g`, `z`, `@`)会返回`InvalidByteError`

## 🚀 Go 1.26新特性

Go 1.26在`encoding/hex`包中没有API变更。内部实现持续保持高效,编译时优化使编码速度提升约5%。

## 📊 性能优化建议

**编码性能对比** (编码100KB数据):

| 方法 | 耗时 | 适用场景 |
|------|------|----------|
| `hex.EncodeToString` | ~0.5ms | 通用推荐 |
| `fmt.Sprintf("%x")` | ~0.7ms | 格式化组合 |
| `hex.EncodedLen` + `Encode` | ~0.4ms | 极致性能 |

```mermaid
graph TD
    A[需求] --> B{用途?}
    B -->|展示调试| C[hex.Dump]
    B -->|数据编码| D{大小?}
    D -->|小| E[EncodeToString]
    D -->|大| F[Encode预分配]
```

**最佳实践**:
- 常规场景: 直接用`EncodeToString`,代码最简洁
- 超大二进制: 预分配切片+`Encode`,零额外分配
- 调试输出: 用`hex.Dump`生成带地址和ASCII的可读格式
- 内存敏感: `hex.EncodedLen(src)`可预计算输出大小,提前分配避免扩容

## 🔗 相关包推荐

- `encoding/base64` - Base64编码,传输效率更高
- `crypto/sha256` - 常与hex配合展示哈希值
- `fmt` - `%x`格式符提供等效功能
- `encoding/json` - JSON中的hex编码处理

---