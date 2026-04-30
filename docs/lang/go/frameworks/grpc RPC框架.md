# grpc：Go语言RPC框架的完全指南

> 在Go语言微服务开发中，grpc是Google开源的RPC框架，基于protobuf协议，效率比REST高5-10倍。grpc是云原生时代的通信标准，被Kubernetes、Docker等著名项目采用。本文带你深入了解grpc。

---

## 一、grpc简介

### 1.1 什么是RPC？

RPC（Remote Procedure Call）是一种远程过程调用，让客户端像调用本地函数一样调用服务端：

```
客户端                    服务端
  |                        |
  |---调用Hello()------->  |
  |                        |---处理请求---
  |<--返回结果----------  |
```

### 1.2 为什么选择grpc？

grpc是Google开源的RPC框架，特点：

| 特性 | 说明 |
|------|------|
| 高性能 | 基于protobuf |
| 跨语言 | Go/Java/Python等 |
| HTTP/2 | 多路复用 |
| 流式 | 服务端/客户端流 |

对比REST：

| 特性 | grpc | REST |
|------|------|------|
| 协议 | HTTP/2 | HTTP/1.1 |
| 格式 | protobuf | JSON |
| 性能 | 高 | 中 |
| 流式 | ✓ | ✗ |

---

## 二、快速开始

### 2.1 安装

```bash
go get google.golang.org/grpc
go install google.golang.org/protobuf/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

### 2.2 定义proto

```protobuf
syntax = "proto3";

package example;

option go_package = "example.com/pb";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);
}

message GetUserRequest {
  int64 id = 1;
}

message User {
  int64 id = 1;
  string name = 2;
}
```

### 2.3 生成代码

```bash
protoc --go_out=. --go_opt=paths=source_relative \
      --go-grpc_out=. --go-grpc_opt=paths=source_relative \
      user.proto
```

---

## 三、服务端

### 3.1 实现服务

```go
package main

import (
    "context"
    "net"
    
    "google.golang.org/grpc"
    "example.com/pb"
)

type UserServer struct {
    pb.UnimplementedUserServiceServer
}

func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    return &pb.User{
        Id:   req.Id,
        Name: "zhangsan",
    }, nil
}

func main() {
    lis, _ := net.Listen("tcp", ":50051")
    server := grpc.NewServer()
    pb.RegisterUserServiceServer(server, &UserServer{})
    server.Serve(lis)
}
```

---

## 四、客户端

### 4.1 连接

```go
import "google.golang.org/grpc"
import "google.golang.org/grpc/credentials/insecure"

conn, _ := grpc.Dial(
    "localhost:50051",
    grpc.WithTransportCredentials(insecure.NewCredentials()),
)
defer conn.Close()

client := pb.NewUserServiceClient(conn)
```

### 4.2 调用

```go
// 简单调用
resp, err := client.GetUser(context.Background(), &pb.GetUserRequest{
    Id: 1,
})
```

### 4.3 流式调用

```go
// 服务端流
stream, err := client.ListUsers(context.Background(), &pb.ListUsersRequest{})
for {
    user, err := stream.Recv()
    if err == io.EOF {
        break
    }
    fmt.Println(user.Name)
}
```

---

## 五、四种模式

### 5.1 简单RPC

```protobuf
rpc GetUser (GetUserRequest) returns (User);
```

```go
resp, err := client.GetUser(ctx, req)
```

### 5.2 服务端流

```protobuf
rpc ListUsers (ListUsersRequest) returns (stream User);
```

```go
stream, err := client.ListUsers(ctx, req)
for {
    user, err := stream.Recv()
    if err == io.EOF {
        break
    }
    // 处理user
}
```

### 5.3 客户端流

```protobuf
rpc CreateUsers (stream User) returns (CreateUsersResponse);
```

```go
stream, err := client.CreateUsers(ctx)
stream.Send(&User{Name: "zhangsan"})
stream.CloseSend()
resp, _ := stream.CloseAndRecv()
```

### 5.4 双向流

```protobuf
rpc Chat (stream ChatMessage) returns (stream ChatMessage);
```

```go
stream, err := client.Chat(ctx)
stream.Send(&ChatMessage{Content: "hello"})
msg, _ := stream.Recv()
```

---

## 六、拦截器

### 6.1 服务端拦截器

```go
func unaryInterceptor(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
    // 前置处理
    resp, err := handler(ctx, req)
    // 后置处理
    return resp, err
}

server := grpc.NewServer(
    grpc.UnaryInterceptor(unaryInterceptor),
)
```

### 6.2 客户端拦截器

```go
conn, _ := grpc.Dial(
    "localhost:50051",
    grpc.WithUnaryInterceptor(func(ctx context.Context, method string, req, reply interface{}, cc *grpc.ClientConn, invoker grpc.UnaryInvoker, opts ...grpc.CallOption) error {
        // 前置处理
        return invoker(ctx, method, req, reply, cc, opts...)
    }),
)
```

### 6.3 流拦截器

```go
grpc.StreamInterceptor(serverInterceptor)
grpc.WithStreamInterceptor(clientInterceptor)
```

---

## 七、元数据

### 7.1 服务端接收

```go
func (s *UserServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.User, error) {
    md, ok := metadata.FromIncomingContext(ctx)
    if ok {
        token := md.Get("authorization")[0]
    }
    return &user, nil
}
```

### 7.2 客户端发送

```go
md := metadata.New(map[string]string{"authorization": "Bearer token"})
ctx := metadata.NewOutgoingContext(context.Background(), md)

client.GetUser(ctx, req)
```

---

## 八、认证

### 8.1 TLS认证

```go
import "google.golang.org/grpc/credentials"

creds, _ := credentials.NewTLS(&tls.Config{
    Certificates: []tls.Certificate{cert},
})
server := grpc.NewServer(grpc.Creds(creds))
```

### 8.2 Token认证

```go
func authenticate(ctx context.Context) error {
    md, ok := metadata.FromIncomingContext(ctx)
    if !ok {
        return status.Error(codes.Unauthenticated, "missing metadata")
    }
    token := md.Get("authorization")
    // 验证token
    return nil
}
```

---

grpc是Go语言RPC框架的"首选"：

1. **高性能**：基于HTTP/2+protobuf
2. **跨语言**：多语言支持
3. **流式**：双向流支持
4. **云原生**：CNCF重点项目

微服务通信的首选！

---

>