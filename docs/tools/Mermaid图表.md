# Mermaid 图表完全指南

## 1. 流程图（Flowchart）

```mermaid
graph TD
    A[开始] --> B{判断}
    B -->|是| C[执行A]
    B -->|否| D[执行B]
    C --> E[结束]
    D --> E
```

## 2. 时序图（Sequence Diagram）

```mermaid
sequenceDiagram
    participant A as 用户
    participant B as 服务器
    A->>B: 请求
    B->>A: 响应
```

## 3. 状态图（State Diagram）

```mermaid
stateDiagram-v2
    [*] --> A
    A --> B
    B --> [*]
```

## 4. 类图（Class Diagram）

```mermaid
classDiagram
    class Animal {
        +String name
        +eat()
        +sleep()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
```

## 5. 饼图（Pie）

```mermaid
pie title 市场份额
    "产品A" : 40
    "产品B" : 35
    "产品C" : 25
```

## 6. 甘特图（Gantt）

```mermaid
gantt
    title 项目计划
    dateFormat YYYY-MM-DD
    section 阶段1
    任务1: 2026-01-01, 7d
    任务2: 7d
```

## 7. ER图

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ORDER_ITEM : contains
```

## 8. 思维导图

```mermaid
mindmap
  root((主题))
    分支1
      子主题
    分支2
      子主题
```

## 9. 需求图（Requirement Diagram）

```mermaid
requirementDiagram
    requirement req1 {
        id: 1
        text: "系统必须支持用户登录"
        risk: high
        verif: 测试用例1
    }
    requirement req2 {
        id: 2
        text: "系统必须支持数据导出"
        risk: medium
        verif: 测试用例2
    }
    req1 - req2: 依赖
```

## 10. 高级流程图

```mermaid
graph TD
    subgraph 处理流程
        A[开始] --> B[输入数据]
        B --> C{数据验证}
        C -->|有效| D[处理数据]
        C -->|无效| E[错误处理]
        D --> F[输出结果]
    end
    subgraph 监控流程
        G[监控] --> H[日志记录]
        H --> I[性能分析]
    end
    F --> G
    E --> G
    
    classDef 重点 fill:#f9f,stroke:#333,stroke-width:2px;
    class D,F 重点;
```

## 11. 高级时序图

```mermaid
sequenceDiagram
    participant A as 客户端
    participant B as 服务器
    participant C as 数据库
    
    A->>B: 请求数据
    B->>C: 查询数据
    C-->>B: 返回数据
    B-->>A: 响应数据
    
    par 并行处理
        A->>B: 发送日志
        B->>C: 存储日志
    and
        A->>B: 发送统计数据
        B->>C: 存储统计数据
    end
    
    loop 定期同步
        A->>B: 同步请求
        B-->>A: 同步响应
    end
```

## 12. 高级状态图

```mermaid
stateDiagram-v2
    [*] --> 空闲
    
    state 空闲 {
        [*] --> 等待输入
        等待输入 --> 处理中: 收到请求
    }
    
    state 处理中 {
        [*] --> 验证
        验证 --> 处理: 验证通过
        验证 --> 错误: 验证失败
        处理 --> 完成: 处理完成
    }
    
    错误 --> 空闲: 重试
    完成 --> 空闲: 重置
```

## 13. 高级类图

```mermaid
classDiagram
    direction LR
    
    class 抽象类 {
        <<abstract>>
        +抽象方法()
        #保护属性
    }
    
    class 接口 {
        <<interface>>
        +方法1()
        +方法2()
    }
    
    class 具体类 {
        +具体方法()
        -私有属性
    }
    
    抽象类 <|-- 具体类
    接口 <|.. 具体类
```

## 14. 带图例的饼图

```mermaid
pie title 销售数据
    "产品A" : 40
    "产品B" : 30
    "产品C" : 20
    "其他" : 10
```

## 15. 高级甘特图

```mermaid
gantt
    title 项目计划
    dateFormat YYYY-MM-DD
    axisFormat %m-%d
    section 设计阶段
    需求分析: des1, 2026-01-01, 5d
    系统设计: des2, after des1, 7d
    
    section 开发阶段
    前端开发: dev1, after des2, 10d
    后端开发: dev2, after des2, 12d
    测试: test, after dev1, 5d
    
    section 部署阶段
    部署: deploy, after test, 3d
    验收: accept, after deploy, 2d
```

## 16. 用户旅程图

```mermaid
graph LR
    A[用户] --> B[访问网站]
    B --> C[浏览产品]
    C --> D[加入购物车]
    D --> E[结账]
    E --> F[支付]
    F --> G[完成订单]
    
    classDef 步骤 fill:#f9f,stroke:#333,stroke-width:1px;
    class A,B,C,D,E,F,G 步骤;
```