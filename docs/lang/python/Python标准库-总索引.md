# Python标准库完全指南

## 总索引

本目录包含Python标准库的详细介绍，按照模块分类组织。

### 基础模块
- [collections - 容器数据类型](collections模块.md)
- [datetime - 日期时间处理](datetime模块.md)
- [math - 数学函数](math模块.md)
- [random - 随机数生成](random模块.md)
- [time - 时间处理](time模块.md)
- [array - 高效数组](array模块.md)
- [bisect - 二分查找](bisect模块.md)
- [calendar - 日历](calendar模块.md)
- [copy - 对象复制](copy模块.md)
- [decimal - 十进制浮点数](decimal模块.md)
- [enum - 枚举类型](enum模块.md)
- [statistics - 统计函数](statistics模块.md)

### 字符串处理
- [string - 字符串常量和工具](string模块.md)
- [re - 正则表达式](re模块.md)
- [difflib - 差异比较](difflib模块.md)
- [textwrap - 文本包装](textwrap模块.md)
- [unicodedata - Unicode数据](unicodedata模块.md)

### 文件和IO
- [os - 操作系统接口](os模块.md)
- [pathlib - 路径处理](pathlib模块.md)
- [tempfile - 临时文件](tempfile模块.md)
- [shutil - 高级文件操作](shutil模块.md)
- [csv - CSV文件处理](csv模块.md)

### 数据处理
- [json - JSON处理](json模块.md)
- [hashlib - 哈希函数](hashlib模块.md)
- [pickle - 对象序列化](pickle模块.md)

### 并发和并行
- [threading - 线程管理](threading模块.md)
- [queue - 队列](queue模块.md)

### 工具函数
- [functools - 函数工具](functools模块.md)
- [itertools - 迭代工具](itertools模块.md)
- [heapq - 堆队列](heapq模块.md)

### 网络和通信
- [socket - 网络套接字](socket模块.md)
- [subprocess - 子进程管理](subprocess模块.md)

### 系统和调试
- [sys - 系统相关](sys模块.md)
- [logging - 日志处理](logging模块.md)
- [gc - 垃圾回收](gc模块.md)
- [timeit - 代码执行时间测量](timeit模块.md)
- [traceback - 异常回溯](traceback模块.md)
- [types - 类型相关](types模块.md)

### 唯一标识
- [uuid - UUID生成](uuid模块.md)

## 待添加模块
- abc - 抽象基类
- argparse - 命令行参数解析
- ast - 抽象语法树
- asyncio - 异步IO
- base64 - Base64编解码
- bz2 - BZ2压缩
- cmath - 复数数学函数
- code - 代码对象
- codecs - 编解码器
- collections.abc - 抽象基类集合
- configparser - 配置文件解析
- contextlib - 上下文管理工具
- ctypes - C类型
- dataclasses - 数据类
- dbm - 数据库接口
- dis - 反汇编器
- doctest - 文档测试
- email - 邮件处理
- filecmp - 文件比较
- fnmatch - 文件名匹配
- fractions - 分数运算
- ftplib - FTP客户端
- getopt - 命令行选项解析
- gettext - 国际化
- glob - 文件通配符匹配
- gzip - GZIP压缩
- html - HTML处理
- http - HTTP协议
- imaplib - IMAP客户端
- inspect - 检查对象
- io - IO核心工具
- ipaddress - IP地址处理
- keyword - 关键字检查
- lib2to3 - Python 2到3转换
- linecache - 行缓存
- locale - 本地化
- lzma - LZMA压缩
- mailbox - 邮箱格式
- mimetypes - MIME类型
- mmap - 内存映射文件
- modulefinder - 模块查找
- multiprocessing - 多进程
- netrc - netrc文件解析
- numbers - 数字抽象基类
- operator - 操作符函数
- optparse - 命令行选项解析（已弃用）
- pathlib - 路径处理
- pdb - Python调试器
- poplib - POP3客户端
- pprint - 漂亮打印
- profile - 性能分析
- pstats - 性能统计
- pty - 伪终端
- pwd - 密码数据库
- py_compile - Python编译
- pydoc - 文档生成
- quopri - quoted-printable编解码
- reprlib - repr替代实现
- runpy - 运行Python模块
- sched - 事件调度
- secrets - 安全随机数
- select - IO多路复用
- selectors - 高级IO多路复用
- shelve - Python对象持久化
- signal - 信号处理
- smtplib - SMTP客户端
- sndhdr - 声音文件头识别
- sqlite3 - SQLite数据库
- ssl - SSL/TLS包装器
- stringprep - 字符串准备
- struct - 结构体解析
- sunau - Sun AU音频文件
- symtable - 符号表访问
- sysconfig - Python配置
- tabnanny - 缩进检查
- tarfile - TAR文件处理
- telnetlib - Telnet客户端
- termios - POSIX终端控制
- test - 回归测试包
- threading - 线程
- tkinter - GUI工具包
- token - 词法分析令牌
- tokenize - Python源代码分词
- trace - 跟踪执行
- tty - 终端控制
- turtle - 海龟绘图
- turtledemo - 海龟绘图演示
- typing - 类型提示支持
- unittest - 单元测试
- urllib - URL处理
- uu - UU编码
- venv - 虚拟环境
- warnings - 警告控制
- wave - WAV音频文件
- weakref - 弱引用
- webbrowser - Web浏览器控制
- winreg - Windows注册表访问
- wsgiref - WSGI工具
- xdrlib - XDR数据编码
- xml - XML处理
- xmlrpc - XML-RPC客户端/服务器
- zipfile - ZIP文件处理
- zipimport - ZIP导入器