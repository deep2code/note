# 用文字画出世界：D2 图表语言从入门到实战

> 还在用鼠标拖拖拽拽画架构图？每次改一个节点就要重新排版？多人协作时 merge 冲突让你抓狂？
>
> 今天介绍一个让你用纯文本就能画出专业级图表的神器——**D2**。

---

## 一、为什么你需要 D2？

先说一个扎心的场景：

你花了一个下午，用某画图工具精心排好了一张系统架构图。第二天产品经理说"加一个缓存层"，你删删改改，整个布局全乱了。再后来，同事在 Git 上改了同一个文件，merge 时发现是二进制格式，根本没法 diff。

如果你经历过这些，D2 就是来救你的。

**D2** 的全称是 **Declarative Diagramming**，由 Terrastruct 团队开发并开源。它的核心理念只有一句话：

> **用文本描述图表，让工具负责渲染。**

这意味着：

- 图表定义是纯文本，天然支持 Git 版本管理
- 修改只需改文字，不用担心布局崩掉
- 可以写脚本自动生成图表
- 团队协作不再是噩梦

下面这张图，就是用 D2 的一段文本生成的：

```d2
用户 -> 应用服务器: 发起请求
应用服务器 -> 缓存层: 查询缓存
缓存层 -> 数据库: 缓存未命中
数据库 -> 缓存层: 返回数据
缓存层 -> 应用服务器: 返回数据
应用服务器 -> 用户: 响应结果
```

没错，就这么几行文字，渲染出来就是一张完整的请求流程图。是不是有点心动了？让我们一步步来。

---

## 二、5 分钟上手：安装与初体验

### 2.1 安装

D2 提供了多种安装方式，最简单的两种：

**方式一：一键脚本（macOS / Linux）**

```bash
curl -fsSL https://d2lang.com/install.sh | sh -s --
```

**方式二：Go 安装**

```bash
go install oss.terrastruct.com/d2@latest
```

**方式三：Homebrew（macOS）**

```bash
brew install d2
```

安装完成后，验证一下：

```bash
d2 --version
```

看到版本号输出，就说明安装成功了。

### 2.2 第一个图表：Hello D2

创建一个文件 `hello.d2`，写入：

```d2
hello -> world
```

然后运行：

```bash
d2 hello.d2 hello.svg
```

打开 `hello.svg`，你会看到两个方框，一个箭头从 "hello" 指向 "world"。就这么简单——**D2 里任何独立的词或短语都会自动成为一个节点，箭头 `->` 表示连接。**

### 2.3 实时预览：边写边看

D2 自带 watch 模式，修改文件后自动刷新预览：

```bash
d2 --watch hello.d2 hello.svg
```

配合 VS Code 的 D2 插件，可以做到保存即预览，体验非常丝滑。

---

## 三、核心语法：从简单到进阶

掌握了安装和基本用法后，我们来系统学习 D2 的语法。别担心，D2 的设计哲学就是**简洁直觉**，你会发现它比你想的要简单。

### 3.1 节点（Shapes）

在 D2 中，节点是图表的基本单元。默认情况下，每个节点都是一个矩形：

```d2
用户
服务器
数据库
```

你可以给节点设置标签，让它显示不同的文字：

```d2
x: 用户端
y: 服务端
z: 数据端
```

这里 `x`、`y`、`z` 是节点的 ID（用于引用），冒号后面是显示的标签。

### 3.2 连接（Connections）

连接是 D2 的灵魂。用箭头把节点串起来：

```d2
用户 -> 服务器: 发送请求
服务器 -> 数据库: 查询数据
数据库 -> 服务器: 返回结果
服务器 -> 用户: 返回响应
```

D2 支持多种箭头方向：

```d2
A -> B: 单向箭头（从左到右）
C <- D: 反向箭头（从右到左）
E -- F: 无箭头连线
G <-> H: 双向箭头
```

来看一个实际例子——用户注册流程：

```d2
用户 -> 前端页面: 填写注册信息
前端页面 -> API网关: 提交表单
API网关 -> 用户服务: 转发请求
用户服务 -> 数据库: 写入用户数据
用户服务 -> 消息队列: 发送欢迎邮件事件
消息队列 -> 邮件服务: 消费事件
邮件服务 -> 用户邮箱: 发送欢迎邮件
```

### 3.3 形状（Shape）：让图表更专业

矩形只是默认样式。D2 内置了丰富的形状，让你的图表更直观：

```d2
用户: 用户 {
  shape: person
}

缓存: Redis缓存 {
  shape: cylinder
}

数据存储: 用户数据 {
  shape: stored_data
}

决策点: 是否VIP {
  shape: diamond
}

服务节点: 微服务 {
  shape: hexagon
}

文档页面: API文档 {
  shape: page
}

圆形节点: 状态A {
  shape: circle
}

椭圆节点: 状态B {
  shape: oval
}
```

不同的形状传达不同的语义。比如 `cylinder` 代表数据存储，`diamond` 代表判断/决策，`person` 代表人或角色——这在技术文档中是约定俗成的。

用一个真实的例子来感受：

```d2
用户: 普通用户 {
  shape: person
}

是否登录: 判断登录状态 {
  shape: diamond
}

缓存: Redis {
  shape: cylinder
}

数据库: MySQL {
  shape: cylinder
}

用户 -> 是否登录: 访问页面
是否登录 -> 缓存: 已登录，查缓存
是否登录 -> 数据库: 未登录，查库
```

### 3.4 容器（Containers）：表达层级关系

当图表变得复杂时，你需要把相关的东西"装"在一起。D2 用花括号 `{}` 表示容器：

```d2
前端: 前端层 {
  Web应用
  移动端
}

后端: 后端层 {
  API网关
  用户服务
  订单服务
}

存储: 存储层 {
  Redis缓存: {
    shape: cylinder
  }
  MySQL: {
    shape: cylinder
  }
}

前端.Web应用 -> 后端.API网关
前端.移动端 -> 后端.API网关
后端.API网关 -> 后端.用户服务
后端.API网关 -> 后端.订单服务
后端.用户服务 -> 存储.Redis缓存
后端.订单服务 -> 存储.MySQL
```

注意跨容器引用时的语法：`容器名.节点名`。就像文件路径一样，用 `.` 分隔层级。

**一个实用技巧**：在容器内部引用外部节点时，用 `_` 代表父级：

```d2
公司: 科技公司 {
  研发部: 研发中心 {
    前端组
    后端组
    前端组 -> 后端组: 协作开发
  }
  产品部
  研发部 -> 产品部: 需求对接
}
```

### 3.5 样式（Style）：让图表好看

光有结构还不够，好看的图表才能让人眼前一亮。D2 提供了丰富的样式属性：

```d2
核心服务: 支付中心 {
  style: {
    fill: "#E8F5E9"
    stroke: "#4CAF50"
    stroke-width: 3
    border-radius: 10
    shadow: true
  }
}

告警节点: 异常处理 {
  style: {
    fill: "#FFEBEE"
    stroke: "#F44336"
    font-color: "#D32F2F"
    bold: true
  }
}

虚线连接: {
  style: {
    stroke-dash: 5
    stroke: "#9E9E9E"
  }
}
```

**常用样式属性一览：**

| 属性 | 说明 | 取值范围 |
|------|------|----------|
| `fill` | 填充色 | CSS 颜色名 / 十六进制 |
| `stroke` | 边框/连线颜色 | CSS 颜色名 / 十六进制 |
| `stroke-width` | 边框/连线宽度 | 1-15 |
| `stroke-dash` | 虚线间距 | 0-10 |
| `border-radius` | 圆角 | 0-20 |
| `shadow` | 阴影 | true / false |
| `opacity` | 透明度 | 0-1 |
| `font-size` | 字号 | 8-100 |
| `font-color` | 字色 | CSS 颜色名 / 十六进制 |
| `bold` | 加粗 | true / false |
| `italic` | 斜体 | true / false |
| `underline` | 下划线 | true / false |
| `3d` | 3D效果 | true / false（仅矩形/方形） |
| `multiple` | 多实例 | true / false |
| `double-border` | 双边框 | true / false |
| `animated` | 动画连线 | true / false |
| `text-transform` | 文字变换 | uppercase / lowercase / title |

来一个完整的实战样式示例——微服务架构图：

```d2
微服务架构: {
  网关: API Gateway {
    shape: hexagon
    style: {
      fill: "#E3F2FD"
      stroke: "#1976D2"
      stroke-width: 2
      shadow: true
    }
  }

  用户服务: User Service {
    style: {
      fill: "#E8F5E9"
      stroke: "#388E3C"
    }
  }

  订单服务: Order Service {
    style: {
      fill: "#FFF3E0"
      stroke: "#F57C00"
    }
  }

  支付服务: Payment Service {
    style: {
      fill: "#FCE4EC"
      stroke: "#C62828"
    }
  }

  消息队列: Kafka {
    shape: cylinder
    style: {
      fill: "#F3E5F5"
      stroke: "#7B1FA2"
    }
  }

  数据库: PostgreSQL {
    shape: cylinder
    style: {
      fill: "#E0F7FA"
      stroke: "#00838F"
    }
  }

  网关 -> 用户服务
  网关 -> 订单服务
  网关 -> 支付服务
  用户服务 -> 消息队列: 发布事件
  订单服务 -> 消息队列: 发布事件
  支付服务 -> 消息队列: 发布事件
  消息队列 -> 数据库: 持久化
}
```

### 3.6 类（Classes）：复用样式

如果你有多个节点需要相同样式，一个个写太繁琐了。D2 的类（Classes）让你定义一次，到处复用：

```d2
classes: {
  微服务: {
    style: {
      fill: "#E8F5E9"
      stroke: "#388E3C"
      border-radius: 8
      shadow: true
    }
  }
  数据层: {
    shape: cylinder
    style: {
      fill: "#E0F7FA"
      stroke: "#00838F"
    }
  }
}

服务A: 认证服务 {
  class: 微服务
}

服务B: 授权服务 {
  class: 微服务
}

主库: MySQL主 {
  class: 数据层
}

从库: MySQL从 {
  class: 数据层
}
```

连接也可以使用类：

```d2
classes: {
  异步调用: {
    style: {
      stroke-dash: 4
      stroke: "#9C27B0"
    }
  }
  同步调用: {
    style: {
      stroke: "#1976D2"
      stroke-width: 2
    }
  }
}

A -> B: 同步请求 {
  class: 同步调用
}

B -> C: 异步通知 {
  class: 异步调用
}
```

---

## 四、高级玩法：释放 D2 的真正实力

基础语法掌握了，让我们看看 D2 的一些高级特性，这些才是让它脱颖而出的关键。

### 4.1 SQL 表（sql_table）：ER 图利器

后端开发者做数据库设计时，ER 图是刚需。D2 内置了 `sql_table` 形状，直接用文本描述表结构：

```d2
users: users {
  shape: sql_table
  id: int {constraint: primary_key}
  username: varchar {constraint: unique}
  email: varchar
  password_hash: varchar
  created_at: timestamp
}

orders: orders {
  shape: sql_table
  id: int {constraint: primary_key}
  user_id: int {constraint: foreign_key}
  total_amount: decimal
  status: varchar
  created_at: timestamp
}

order_items: order_items {
  shape: sql_table
  id: int {constraint: primary_key}
  order_id: int {constraint: foreign_key}
  product_name: varchar
  quantity: int
  price: decimal
}

users.id -> orders.user_id
orders.id -> order_items.order_id
```

D2 会自动把 `primary_key` 缩写为 PK，`foreign_key` 缩写为 FK，`unique` 缩写为 UNQ。配合 TALA 或 ELK 布局引擎，连线还能精确指向到具体的行。

### 4.2 类图（class）：面向对象设计

做面向对象设计时，类图必不可少：

```d2
Animal: Animal {
  shape: class
  +name: string
  +age: int
  +speak(): string
}

Dog: Dog {
  shape: class
  +breed: string
  +fetch(): void
}

Cat: Cat {
  shape: class
  +indoor: bool
  +purr(): void
}

Dog -> Animal: 继承
Cat -> Animal: 继承
```

### 4.3 时序图（sequence_diagram）：交互流程一目了然

时序图是 D2 的杀手级特性之一。创建方式很简单——给容器设置 `shape: sequence_diagram`：

```d2
用户登录流程: {
  shape: sequence_diagram

  客户端
  网关
  认证服务
  数据库

  客户端 -> 网关: POST /login
  网关 -> 认证服务: 验证凭证
  认证服务 -> 数据库: 查询用户信息
  数据库 -> 认证服务: 返回用户记录
  认证服务 -> 网关: 签发Token
  网关 -> 客户端: 200 OK + JWT
}
```

时序图有几个特殊规则：

1. **声明顺序即显示顺序**：参与者按你写的顺序从左到右排列
2. **同一命名空间**：同一时序图内的同名元素指向同一个参与者
3. **支持分组**：用容器给消息分组，类似 UML 的 fragment

进阶用法——带分组和自调用的时序图：

```d2
下单支付流程: {
  shape: sequence_diagram

  用户
  订单服务
  支付服务
  库存服务

  创建订单: {
    用户 -> 订单服务: 创建订单
    订单服务 -> 库存服务: 检查库存
    库存服务 -> 订单服务: 库存充足
    订单服务 -> 用户: 订单创建成功
  }

  支付: {
    用户 -> 支付服务: 发起支付
    支付服务 -> 支付服务: 调用第三方支付
    支付服务 -> 订单服务: 支付回调
    订单服务 -> 库存服务: 扣减库存
  }
}
```

### 4.4 Markdown 文本：在图表中嵌入丰富内容

D2 节点可以包含 Markdown 格式的文本，非常适合添加说明：

```d2
说明文档: {
  shape: text
  near: top-left
  style: {
    font-size: 14
    fill: "#FAFAFA"
  }

  Markdown content here
}

接口说明: API接口文档 {
  shape: text
  style: {
    font: mono
    font-size: 12
  }
}
```

### 4.5 图标（Icons）：让图表更生动

D2 支持引入外部 SVG 图标，让图表更直观：

```d2
服务器: 应用服务器 {
  icon: https://icons.terrastruct.com/dev/aws.svg
}

数据库: PostgreSQL {
  shape: cylinder
  icon: https://icons.terrastruct.com/dev/db.svg
}
```

Terrastruct 提供了丰富的图标库（包括 AWS、Azure、GCP 等云服务图标），也可以使用自己的 SVG 文件。

### 4.6 定位（near）：精准控制位置

默认情况下，D2 的布局引擎会自动排列元素。但有时候你需要手动微调，比如把标题放在左上角，图例放在右下角：

```d2
标题: 系统架构图 {
  near: top-center
  shape: text
  style: {
    font-size: 24
    bold: true
  }
}

图例: {
  near: bottom-right
  shape: text
}
```

`near` 支持的方位值：

```d2
# 九宫格方位
top-left     top-center     top-right
center-left  center         center-right
bottom-left  bottom-center  bottom-right
```

还可以让一个节点靠近另一个节点：

```d2
主服务: 核心服务
热备: 备用服务 {
  near: 主服务
}
```

### 4.7 变量（vars）：减少重复

当代码中出现大量重复文本时，可以用变量来统一管理：

```d2
vars: {
  service-prefix: "微服务架构"
  db-host: "rm-xxxx.mysql.rds.aliyuncs.com"
}

服务A: ${service-prefix} - 用户中心
服务B: ${service-prefix} - 订单中心
```

### 4.8 主题（Theme）：一键换装

D2 内置了多种主题，一键切换图表风格：

```d2
vars: {
  d2-config: {
    theme-id: 4
  }
}
```

部分主题编号：0（默认）、1（Neutral Grey）、2（Flags）、3（Orange）、4（Grape Soda）、5（Cool Classics）…… 你可以逐一尝试，找到最适合项目的那一款。

---

## 五、布局引擎：选择最适合你的排版

D2 支持三种布局引擎，各有特色：

```d2
# 在文件中指定布局引擎
vars: {
  d2-config: {
    layout-engine: elk
  }
}
```

或者命令行指定：

```bash
d2 --layout=elk input.d2 output.svg
```

**三大引擎对比：**

```d2
引擎对比: {
  DAGRE: {
    特点: 默认引擎; 适合流程图; 从上到下布局
    标签: 免费内置
  }

  ELK: {
    特点: 适合复杂图; 从左到右布局; 连线更整洁
    标签: 免费内置
  }

  TALA: {
    特点: 最智能; 连线指向精确行; 付费商业版
    标签: 需单独安装
  }

  DAGRE -> ELK: 需要更紧凑布局
  ELK -> TALA: 需要精确连线
}
```

| 引擎 | 方向 | 优势 | 价格 |
|------|------|------|------|
| DAGRE | 从上到下 | 默认引擎，开箱即用 | 免费 |
| ELK | 从左到右 | 连线整洁，适合复杂图 | 免费 |
| TALA | 智能选择 | 最智能，连线精确到行 | 付费 |

**建议**：日常使用 DAGRE 足够，复杂 ER 图切 ELK，预算充足上 TALA。

---

## 六、实战演练：从零画一张完整的微服务架构图

学完了语法，来一个完整的实战。我们画一张典型的电商微服务架构图：

```d2
vars: {
  d2-config: {
    layout-engine: dagre
    theme-id: 3
  }
}

title: 电商微服务架构图 {
  near: top-center
  shape: text
  style: {
    font-size: 28
    bold: true
    underline: true
  }
}

客户端: 客户端层 {
  Web: Web浏览器
  App: 移动App
  小程序: 微信小程序
}

网关层: API Gateway {
  shape: hexagon
  style: {
    fill: "#FFF8E1"
    stroke: "#FF8F00"
    stroke-width: 3
    shadow: true
  }
}

服务层: 微服务集群 {
  用户服务: User Service {
    shape: hexagon
    style: {
      fill: "#E8F5E9"
      stroke: "#388E3C"
    }
  }

  商品服务: Product Service {
    shape: hexagon
    style: {
      fill: "#E3F2FD"
      stroke: "#1976D2"
    }
  }

  订单服务: Order Service {
    shape: hexagon
    style: {
      fill: "#FFF3E0"
      stroke: "#F57C00"
    }
  }

  支付服务: Payment Service {
    shape: hexagon
    style: {
      fill: "#FCE4EC"
      stroke: "#C62828"
    }
  }
}

中间件: 中间件层 {
  Kafka: 消息队列 {
    shape: cylinder
    style: {
      fill: "#F3E5F5"
      stroke: "#7B1FA2"
    }
  }

  Redis: 缓存集群 {
    shape: cylinder
    style: {
      fill: "#FFEBEE"
      stroke: "#D32F2F"
    }
  }
}

存储层: 数据持久层 {
  MySQL主: MySQL主库 {
    shape: cylinder
    style: {
      fill: "#E0F7FA"
      stroke: "#00838F"
    }
  }

  MySQL从: MySQL从库 {
    shape: cylinder
    style: {
      fill: "#E0F7FA"
      stroke: "#00838F"
      stroke-dash: 3
    }
  }

  ES: ElasticSearch {
    shape: cylinder
    style: {
      fill: "#FFF9C4"
      stroke: "#F9A825"
    }
  }
}

客户端.Web -> 网关层: HTTPS
客户端.App -> 网关层: HTTPS
客户端.小程序 -> 网关层: HTTPS

网关层 -> 服务层.用户服务: 认证鉴权
网关层 -> 服务层.商品服务: 商品查询
网关层 -> 服务层.订单服务: 下单
网关层 -> 服务层.支付服务: 支付

服务层.用户服务 -> 中间件.Redis: 读写缓存
服务层.商品服务 -> 中间件.Redis: 热点数据
服务层.订单服务 -> 中间件.Kafka: 发布订单事件
服务层.支付服务 -> 中间件.Kafka: 发布支付事件

中间件.Kafka -> 存储层.MySQL主: 异步写入
存储层.MySQL主 -> 存储层.MySQL从: 主从同步
中间件.Kafka -> 存储层.ES: 数据索引
```

保存为 `ecommerce.d2`，运行 `d2 ecommerce.d2 ecommerce.svg`，一张专业的架构图就出来了。

**效果亮点**：
- 不同服务用不同颜色区分
- 缓存和消息队列用圆柱体表示
- API 网关用六边形突出核心位置
- 主题 3（Orange）给整体加了一层暖色调

---

## 七、D2 vs 其他工具：怎么选？

你可能会问，市面上已经有 Mermaid、PlantUML、Graphviz 了，D2 有什么不同？

```d2
工具对比: {
  D2: {
    语法: 极简直觉
    样式: 内置丰富
    布局: 三引擎可选
    上手: 5分钟入门
    生态: VS Code插件; Obsidian插件; GitHub渲染
    定位: 现代化; 开发者友好
  }

  Mermaid: {
    语法: 中等复杂
    样式: 有限
    布局: 单引擎
    上手: 需要记语法
    生态: GitHub原生支持; 广泛集成
    定位: 通用; 社区大
  }

  PlantUML: {
    语法: 较复杂
    样式: 有限
    布局: Graphviz
    上手: 学习曲线陡
    生态: 企业级; 老牌
    定位: 传统; Java系
  }

  Graphviz: {
    语法: DOT语言
    样式: 基础
    布局: 多引擎
    上手: 需要理解图论
    生态: 学术界; 底层工具
    定位: 基础设施; 底层
  }
}
```

| 工具 | 适合谁 | 核心优势 |
|------|--------|----------|
| **D2** | 追求效率和美观的开发者 | 语法最简洁，样式最丰富 |
| Mermaid | 需要广泛集成的团队 | GitHub 原生渲染，生态最大 |
| PlantUML | Java 企业级项目 | UML 图谱最全 |
| Graphviz | 学术 / 底层需求 | 图论算法最强 |

**我的建议**：如果你是新入坑文本图表，从 D2 开始。语法最直觉，效果最惊艳，学习成本最低。

---

## 八、生态与工具链

D2 不仅仅是一个命令行工具，它背后已经形成了一套完整的生态：

### 8.1 在线 PlayGround

不想安装？打开 [play.d2lang.com](https://play.d2lang.com/)，直接在浏览器里编写和预览 D2 图表，零门槛体验。

### 8.2 VS Code 插件

搜索 "D2" 插件安装，支持：
- 语法高亮
- 实时预览
- 自动格式化
- 代码补全

### 8.3 Obsidian 插件

用 Obsidian 做知识管理的朋友有福了，D2 社区已经做了 Obsidian 插件，在 Markdown 笔记中直接嵌入 D2 图表。

### 8.4 GitHub 集成

D2 已被 Thoughtworks 技术雷达收录为"试用"级别工具，社区正在推动 GitHub 原生支持 D2 渲染（类似 Mermaid 的 ```mermaid 代码块渲染）。

### 8.5 导出格式

```bash
# 导出 SVG（默认，矢量图，无限缩放）
d2 input.d2 output.svg

# 导出 PNG（位图，适合插入文档）
d2 input.d2 output.png

# 导出 PDF（打印级质量）
d2 input.d2 output.pdf
```

---

## 九、实用技巧与避坑指南

最后，分享一些实战中的经验和踩过的坑，帮你少走弯路。

### 技巧 1：先结构后样式

写 D2 时，先用最简单的语法把结构和连线写出来，确认逻辑无误后再加样式。不要一开始就纠结颜色和布局。

```
第一步：把节点和连线写出来
第二步：给关键节点设置 shape
第三步：加容器分组
第四步：调整样式和主题
第五步：微调 near 定位
```

### 技巧 2：善用类来统一样式

同一类型的节点用类来统一管理样式，比逐个设置高效得多，后续修改也只需改一处。

### 技巧 3：跨容器引用要用完整路径

```d2
# 正确
前端.Web应用 -> 后端.API网关

# 错误（会在前端容器内新建一个API网关）
前端: {
  Web应用 -> API网关
}
```

### 技巧 4：布局不满意时换引擎

DAGRE 从上到下适合流程图，ELK 从左到右适合架构图。哪个看着顺眼用哪个。

### 技巧 5：用 watch 模式实时调整

```bash
d2 --watch input.d2 output.svg
```

边写边看，效率翻倍。

### 技巧 6：长标签用引号包裹

```d2
# 包含空格或特殊字符的标签，用引号包裹
"用户认证模块": Auth Module {
  shape: hexagon
}
```

---

回顾一下我们今天学到的：

```d2
D2学习路径: {
  入门: 安装与基本语法 {
    节点; 连接; 箭头
  }

  进阶: 形状与样式 {
    shape; style; class; 容器
  }

  高级: 专业图表 {
    sql_table; sequence_diagram; class图
  }

  实战: 完整项目 {
    微服务架构图; ER图; 时序图
  }

  入门 -> 进阶 -> 高级 -> 实战
}
```

D2 的魅力在于：**你只需要关注"画什么"，不需要操心"怎么画"。** 文本即图表，修改即渲染，版本即历史。