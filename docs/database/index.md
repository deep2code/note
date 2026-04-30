# 数据库

![Database](https://img.shields.io/badge/Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![文档数](https://img.shields.io/badge/文档-3+-blue?style=for-the-badge)

> MySQL 性能优化与数据库原理

---

## 🗄️ MySQL优化

| 主题 | 说明 | 链接 |
|------|------|------|
| 慢SQL优化全攻略 | 定位到预防的完整流程 | [查看 →](MySQLB+树.md) |
| 慢SQL全流程优化 | 从定位到验证 | [查看 →](MySQLB+树.md) |
| B+树索引原理 | 数据结构深度解析 | [查看 →](MySQLB+树.md) |

---

## 📊 核心概念

```mermaid
graph LR
    A[SQL查询] --> B[查询优化器]
    B --> C{是否使用索引?}
    C -->|是| D[索引扫描]
    C -->|否| E[全表扫描]
    D --> F[返回结果]
    E --> F
```