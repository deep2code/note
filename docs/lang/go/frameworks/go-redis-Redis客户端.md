# go-redis：Go语言Redis客户端的完全指南

> 在Go语言开发中，Redis是高性能缓存的不二之选。go-redis是Go语言最流行的Redis客户端，由ins当成功维护，支持Redis 7.x的所有特性。本文带你深入了解go-redis。

---

## 一、go-redis简介

### 1.1 为什么选择go-redis？

go-redis是Go语言最流行的Redis客户端，特点：

| 特性 | 说明 |
|------|------|
| Redis 7支持 | 支持Redis 7.x新特性 |
| 功能完善 | Strings、Hash、List、Set等 |
| 连接池 | 高性能连接管理 |
| 管道化 | Pipeline支持 |
| 事务 | MULTI/EXEC支持 |

采用go-redis的项目：

```
InfluxDB       # 时序数据库
rakyll/stash   # Redis缓存
...
```

---

## 二、快速开始

### 2.1 安装

```bash
go get github.com/redis/go-redis/v9
```

### 2.2 最简示例

```go
package main

import (
    "context"
    "fmt"
    "github.com/redis/go-redis/v9"
)

func main() {
    // 创建客户端
    rdb := redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "",
        DB:       0,
    })
    defer rdb.Close()
    
    ctx := context.Background()
    
    // 设置值
    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
        panic(err)
    }
    
    // 获取值
    val, err := rdb.Get(ctx, "key").Result()
    if err != nil {
        panic(err)
    }
    fmt.Println("key:", val)
}
```

---

## 三、基本操作

### 3.1 String操作

```go
ctx := context.Background()

// 设置
rdb.Set(ctx, "name", "zhangsan", time.Hour)
rdb.SetNX(ctx, "lock", "1", time.Second)  // 不存在才设置

// 获取
rdb.Get(ctx, "name")
rdb.MGet(ctx, "key1", "key2", "key3")  // 批量获取

// 计数
rdb.Incr(ctx, "counter")
rdb.IncrBy(ctx, "counter", 10)
rdb.Decr(ctx, "counter")

// 删除
rdb.Del(ctx, "key")
rdb.Expire(ctx, "key", time.Hour)  // 设置过期
rdb.TTL(ctx, "key")              // 获取剩余时间
```

### 3.2 Hash操作

```go
ctx := context.Background()

// 设置Hash
rdb.HSet(ctx, "user:1", "name", "zhangsan")
rdb.HMSet(ctx, "user:1", map[string]interface{}{
    "name": "zhangsan",
    "age":  25,
})

// 获取Hash
rdb.HGet(ctx, "user:1", "name")
rdb.HMGet(ctx, "user:1", "name", "age")
rdb.HGetAll(ctx, "user:1")

// 操作
rdb.HIncrBy(ctx, "user:1", "age", 1)
rdb.HDel(ctx, "user:1", "name")
rdb.HLen(ctx, "user:1")
rdb.HKeys(ctx, "user:1")
rdb.HVals(ctx, "user:1")
```

### 3.3 List操作

```go
ctx := context.Background()

// 插入
rdb.LPush(ctx, "list", "a", "b", "c")  // 头部
rdb.RPush(ctx, "list", "x", "y")       // 尾部

// 获取
rdb.LRange(ctx, "list", 0, -1)  // 全部
rdb.LIndex(ctx, "list", 0)       // 按索引

// 操作
rdb.LPop(ctx, "list")
rdb.RPop(ctx, "list")
rdb.LLen(ctx, "list")
```

### 3.4 Set操作

```go
ctx := context.Background()

// 添加
rdb.SAdd(ctx, "tags", "go", "redis", "db")

// 获取
rdb.SMembers(ctx, "tags")
rdb.SCard(ctx, "tags")

// 操作
rdb.SIsMember(ctx, "tags", "go")
rdb.SPop(ctx, "tags")
rdb.SRem(ctx, "tags", "go")
```

### 3.5 Sorted Set操作

```go
ctx := context.Background()

// 添加（带分数）
rdb.ZAdd(ctx, "ranking",
    redis.Z{Score: 100, Member: "user1"},
    redis.Z{Score: 90, Member: "user2"},
)

// 获取
rdb.ZRange(ctx, "ranking", 0, -1)      // 按索引
rdb.ZRevRange(ctx, "ranking", 0, -1)    // 倒序
rdb.ZRangeByScore(ctx, "ranking", &redis.ZRangeBy{
    Min: "0",
    Max: "100",
})

// 操作
rdb.ZIncrBy(ctx, "ranking", 10, "user1")
rdb.ZRank(ctx, "ranking", "user1")
```

---

## 四、高级特性

### 4.1 管道化

```go
ctx := context.Background()

// 管道：批量执行
pipe := rdb.Pipeline()
pipe.Set(ctx, "a", "1", 0)
pipe.Set(ctx, "b", "2", 0)
pipe.Get(ctx, "a")

cmds, err := pipe.Exec(ctx)
for _, cmd := range cmds {
    fmt.Println(cmd.Val())
}
```

### 4.2 事务

```go
ctx := context.Background()

// 事务
tx, err := rdb.TxPipelined(ctx, func(pipe redis.Pipeliner) []redis.Cmder {
    pipe.Set(ctx, "a", "1", 0)
    pipe.Set(ctx, "b", "2", 0)
    return pipe.Expire(ctx, "key", time.Hour)
})
```

### 4.3 发布/订阅

```go
ctx := context.Background()

// 订阅
pubsub := rdb.Subscribe(ctx, "news")
ch := pubsub.Channel()

// 推送
rdb.Publish(ctx, "news", "hello")

// 接收
for msg := range ch {
    fmt.Println(msg.Payload)
}
```

---

## 五、连接池

### 5.1 配置连接池

```go
rdb := redis.NewClient(&redis.Options{
    Addr:         "localhost:6379",
    PoolSize:     10,           // 连接池大小
    MinIdleConns:  5,           // 最小空闲连接
    MaxRetries:   3,           // 最大重试次数
    DialTimeout:  5 * time.Second,
    ReadTimeout:  3 * time.Second,
    WriteTimeout: 3 * time.Second,
})
```

### 5.2 连接池监控

```go
pool := rdb.Pool()
fmt.Printf("Pool stats: %+v\n", pool.Stats())
```

---

## 六、集群支持

### 6.1 Redis Cluster

```go
rdb := redis.NewClusterClient(&redis.ClusterOptions{
    Addrs: []string{
        "localhost:7000",
        "localhost:7001",
        "localhost:7002",
    },
})
```

### 6.2 Sentinel

```go
rdb := redis.NewFailoverClient(&redis.FailoverOptions{
    MasterName:    "mymaster",
    SentinelAddrs: []string{"localhost:26379"},
})
```

---

## 七、最佳实践

### 7.1 封装Redis

```go
package redis

import (
    "context"
    "github.com/redis/go-redis/v9"
)

var rdb *redis.Client

func Init(addr string) error {
    rdb = redis.NewClient(&redis.Options{
        Addr:     addr,
        PoolSize:  10,
    })
    return rdb.Ping(context.Background()).Err()
}

func Get(ctx context.Context, key string) (string, error) {
    return rdb.Get(ctx, key).Result()
}

func Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
    return rdb.Set(ctx, key, value, expiration).Err()
}
```

### 7.2 Context超时

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()

rdb.Get(ctx, "key")
```

---

## 八、与其他库对比

| 特性 | go-redis | redigo |
|------|---------|-------|
| Redis 7 | ✓ | ✓ |
| 连接池 | ✓ | ✓ |
| 管道 | ✓ | ✓ |
| 集群 | ✓ | ✓ |
| 维护状态 | 活跃 | 活跃 |

---

go-redis是Go语言Redis客户端的"首选"：

1. **功能完善**：支持所有Redis数据类型
2. **性能高**：连接池+管道
3. **Redis 7**：支持新特性
4. **活跃维护**：社区活跃

掌握go-redis，让Redis操作更轻松！

---

>

---

# Redis常见用途及高频问题汇总
## 一、Redis常见用途
### 1. 核心用途：缓存
**应用场景**：缓存电商商品详情、用户信息、首页热点数据、复杂查询结果
**常用数据结构**：
- String：缓存单个对象
- Hash：缓存结构化对象，避免序列化开销
**最佳实践**：
- 采用Cache Aside策略保证缓存与数据库一致性
- 设置随机过期时间避免缓存雪崩
### 2. 计数器/限流器
**应用场景**：
- 视频播放量、文章阅读量、点赞数
- 商品库存扣减
- 接口限流、秒杀防超卖
**核心优势**：
- INCR/DECR命令原子性，无并发计数错误
- 支持过期时间，适配时间窗口统计
### 3. 分布式锁
**应用场景**：
- 秒杀超卖防护
- 订单重复生成
- 分布式系统多节点资源竞争
**核心原理**：
```lua
-- 获取锁
SET key unique_value NX PX 30000
-- 释放锁（Lua脚本）
if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end
### 4. 消息队列
**应用场景**：
- 异步任务（注册短信/邮件发送）
- 系统解耦（订单-库存联动）
- 延迟队列（订单30分钟未支付取消）
**实现方式**：
| 方式 | 特点 |
| List | LPUSH生产消息，RPOP/BRPOP消费 |
| Pub/Sub | 一对多广播 |
| Sorted Set | 以过期时间为score实现延迟队列 |
### 5. 分布式会话存储
**应用场景**：分布式系统中解决Session共享问题
**核心优势**：
- 支持过期时间配置
- 高性能，支撑高并发访问
### 6. 排行榜系统
**应用场景**：游戏积分榜、商品销量榜、直播礼物榜
**核心优势**：
- Sorted Set自动按score排序
- 支持实时更新
- 百万级数据毫秒级响应
## 二、Redis高频问题
### 1. 基础概念类
#### Q1: Redis是什么？核心特点？
**答**：开源基于内存的Key-Value NoSQL数据库，支持持久化、高可用和分布式扩展。
**核心特点**：
- 内存操作快
- 丰富数据结构
- RDB/AOF持久化
- 主从/哨兵/集群高可用
- 单线程模型（IO阶段）
- 支持Lua脚本/发布订阅
#### Q2: Redis与Memcached的区别？
| 特性 | Redis | Memcached |
|------|-------|-----------|
| 数据结构 | 多类型 | 仅String |
| 持久化 | 支持 | 不支持 |
| 高可用 | 原生方案 | 需第三方 |
| 内存管理 | 淘汰策略优 | 碎片率高 |
#### Q3: Redis为什么快？
1. 基于内存，无磁盘IO瓶颈
2. 单线程模型，无线程切换和锁竞争
3. IO多路复用技术
4. 高效数据结构（SDS、跳表等）
### 2. 核心数据结构类
#### Q4: Redis支持的核心数据结构及底层实现？
| 数据结构 | 底层实现 | 典型场景 |
|----------|----------|----------|
| String | SDS | 缓存、计数器 |
| Hash | ziplist→hashtable | 结构化对象 |
| List | ziplist→quicklist | 消息队列 |
| Set | intset→hashtable | 去重、交集 |
| Sorted Set | ziplist→跳表+hashtable | 排行榜 |
#### Q5: 跳表原理？Sorted Set为何选跳表而非红黑树？
**跳表原理**：通过多级索引快速定位，查询O(logN)
**优势**：
- 范围查询更高效
- 实现简单
- 插入/删除性能稳定
### 3. 持久化机制类
#### Q6: RDB与AOF的区别？
| 特性 | RDB（快照） | AOF（追加日志） |
|------|-------------|-----------------|
| 原理 | 定期全量写入 | 记录每条写命令 |
| 优点 | 文件小、恢复快 | 数据安全高 |
| 缺点 | 数据一致性差 | 文件大、恢复慢 |
#### Q7: 混合持久化是什么？
Redis 4.0+支持，AOF重写时将内存数据以RDB格式写入AOF开头，后续命令以AOF追加，结合RDB恢复快和AOF数据全的优点。
### 4. 高可用架构类
#### Q8: 主从复制原理？
1. **全量复制**：从库发SYNC，主库BGSAVE生成RDB
2. **增量复制**：全量后主库实时同步写命令
3. **断线重连**：通过偏移量和积压缓冲区增量同步
#### Q9: 哨兵模式的工作流程？
```mermaid
flowchart TD
    A[监控] --> B[PING检测]
    B --> C{节点健康?}
    C -->|是| A
    C -->|否| D[主观下线]
    D --> E{多哨兵共识?}
    E -->|否| A
    E -->|是| F[客观下线]
    F --> G[选举领头哨兵]
    G --> H[故障转移]
    H --> I[从库升主]
### 5. 缓存问题类
#### Q10: 缓存穿透、击穿、雪崩的区别？
| 问题 | 定义 | 解决方案 |
|------|------|----------|
| **穿透** | 查缓存和DB都不存在 | 缓存空值、布隆过滤器 |
| **击穿** | 热点Key过期，大量请求 | 热点永不过期、互斥锁 |
| **雪崩** | 大量Key同时过期 | 过期随机化、多级缓存 |
#### Q11: 如何保证缓存与数据库一致性？
**Cache Aside策略**：
- 读：缓存→DB→写缓存
- 写：删DB→删缓存
## 三、性能优化手段
1. 避免大Key，拆分结构化数据
2. 用Pipeline减少网络往返
3. AOF刷盘策略设为everysec
4. 合理配置LRU淘汰策略
5. 禁用KEYS、FLUSHDB，用SCAN遍历