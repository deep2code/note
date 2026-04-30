# Nginx 变量映射与选择

在 Nginx 中，与 map 指令类似、用于 “变量映射” 或 “条件转换” 的指令主要有 geo、split_clients 和第三方模块的 set_by_lua 等。这些指令都能根据输入值动态生成新变量，但适用场景和功能特点各有不同：

## 1. geo 指令（核心模块）

**功能**：根据客户端 IP 地址生成变量，支持 IP 段、CIDR 格式匹配，类似 “IP 映射器”。

**与 map 的相似性**：都是 “输入→输出” 的映射逻辑，支持默认值和匹配规则。

**差异**：

- map 可基于任意变量（如 $uri、$http_user_agent），geo 仅基于客户端 IP（$remote_addr）。
- geo 支持更精细的 IP 规则（如私有 IP 段、子网掩码）。

**示例**：

```nginx
geo $country {
    default        CN;
    192.168.0.0/16 CN;
    10.0.0.0/8    CN;
    172.16.0.0/12 CN;
}
```

## 2. split_clients 指令（核心模块）

**功能**：基于变量的哈希值将请求 “分片”，生成固定分组的变量，常用于灰度发布或 A/B 测试。

**与 map 的相似性**：根据输入变量生成新变量，支持比例分配。

**差异**：

- map 是 “精确匹配”（如正则、字符串），split_clients 是 “概率分片”（基于哈希值按比例分配）。
- 输出结果是预定义的分组（如 10% 到 A 组，90% 到 B 组）。

**示例**：

```nginx
split_clients $remote_addr $backend {
    10.0.0.0%10  backend1;
    *              backend2;
}
```

## 3. set_by_lua 指令（ngx_http_lua_module 第三方模块）

**功能**：通过 Lua 脚本动态生成变量，支持复杂逻辑（如条件判断、函数调用、外部接口查询）。

**与 map 的相似性**：将输入转换为输出变量，实现动态逻辑。

**差异**：

- map 是声明式配置，set_by_lua 是编程式逻辑，支持更复杂的计算（如调用 Redis、字符串处理）。
- 性能略低于 map（脚本执行有开销），但灵活性极高。

**示例**：

```nginx
set_by_lua $user_id "
    local redis = require 'resty.redis'
    local red = redis:new()
    red:set_timeout(1000)
    local ok, err = red:connect('127.0.0.1', 6379)
    if not ok then
        return nil
    end
    local token = ngx.var.http_token
    local user_id, err = red:get('token:' .. token)
    return user_id
";
```

## 4. map_hash_bucket_size 和 map_hash_max_size（辅助 map 的指令）

**功能**：优化 map 指令的哈希表性能（如调整桶大小、最大容量），确保大规则集的匹配效率。

**与 map 的关系**：不是独立映射指令，而是 map 的性能调优参数，类似数据库索引优化。

**示例**：

```nginx
map_hash_bucket_size 512;
map_hash_max_size 1024;
```

| 指令 | 适用场景 |
|------|----------|
| **map** | 通用变量映射，适合基于字符串、正则的精确匹配（如 URI、Header 字段） |
| **geo** | 专注 IP 地址映射，适合区域控制、IP 黑白名单 |
| **split_clients** | 概率性分片，适合灰度发布、流量分配 |
| **set_by_lua** | 复杂逻辑映射，适合需要编程处理的场景（如动态计算、外部数据查询） |

这些指令共同构成了 Nginx 的 “变量转换体系”，灵活组合可实现从简单匹配到复杂业务逻辑的各种需求。