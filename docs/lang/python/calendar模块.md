# Python标准库 - calendar模块完全参考手册

## 1. 模块简介

`calendar` 模块提供了与日历相关的功能，包括日历的生成、日期的计算和格式化等。它支持公历日历系统，并提供了多种日历格式的输出。

## 2. 核心功能

### 2.1 基本操作

```python
import calendar

# 打印2026年的日历
print(calendar.calendar(2026))

# 打印2026年3月的日历
print(calendar.month(2026, 3))

# 检查2026年是否是闰年
print(calendar.isleap(2026))  # 输出: False

# 获取2026年的闰年数量
print(calendar.leapdays(2000, 2026))  # 输出: 6
```

### 2.2 日历类

#### 2.2.1 Calendar类

```python
import calendar

# 创建日历对象
cal = calendar.Calendar()

# 获取2026年3月的日期列表
month_days = list(cal.itermonthdays(2026, 3))
print(f"2026年3月的日期: {month_days}")

# 获取2026年3月的日期和星期
month_days_with_weekday = list(cal.itermonthdays2(2026, 3))
print(f"2026年3月的日期和星期: {month_days_with_weekday}")
```

#### 2.2.2 TextCalendar类

```python
import calendar

# 创建文本日历对象
tc = calendar.TextCalendar()

# 打印2026年3月的日历
print(tc.formatmonth(2026, 3))

# 打印2026年的日历
print(tc.formatyear(2026))
```

#### 2.2.3 HTMLCalendar类

```python
import calendar

# 创建HTML日历对象
hc = calendar.HTMLCalendar()

# 生成2026年3月的HTML日历
html_calendar = hc.formatmonth(2026, 3)
print(html_calendar)

# 生成2026年的HTML日历
html_year_calendar = hc.formatyear(2026)
print(html_year_calendar)
```

### 2.3 实用函数

#### 2.3.1 月份相关

```python
import calendar

# 获取月份名称
print(calendar.month_name[3])  # 输出: March

# 获取月份缩写
print(calendar.month_abbr[3])  # 输出: Mar

# 获取星期名称
print(calendar.day_name[0])  # 输出: Monday

# 获取星期缩写
print(calendar.day_abbr[0])  # 输出: Mon
```

#### 2.3.2 日期计算

```python
import calendar

# 获取某月的天数
print(calendar.monthrange(2026, 3))  # 输出: (5, 31)  # (星期几, 天数)

# 获取某月的第一天是星期几
print(calendar.weekday(2026, 3, 1))  # 输出: 5  # 0=星期一, 6=星期日
```

## 3. 实际应用场景

### 3.1 生成日历

```python
import calendar

def generate_calendar(year, month):
    """生成指定月份的日历"""
    print(f"{calendar.month_name[month]} {year}")
    print(calendar.month(year, month))

# 测试
generate_calendar(2026, 3)
```

### 3.2 检查闰年

```python
import calendar

def check_leap_year(year):
    """检查是否是闰年"""
    if calendar.isleap(year):
        print(f"{year}年是闰年")
    else:
        print(f"{year}年不是闰年")

# 测试
check_leap_year(2024)
check_leap_year(2026)
```

### 3.3 计算两个日期之间的闰年数

```python
import calendar

def count_leap_years(start_year, end_year):
    """计算两个年份之间的闰年数"""
    return calendar.leapdays(start_year, end_year)

# 测试
print(f"2000年到2026年之间的闰年数: {count_leap_years(2000, 2026)}")
```

### 3.4 生成HTML日历

```python
import calendar

def generate_html_calendar(year):
    """生成HTML格式的年历"""
    hc = calendar.HTMLCalendar()
    html = hc.formatyear(year)
    with open(f"{year}_calendar.html", "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{year}年的HTML日历已生成")

# 测试
generate_html_calendar(2026)
```

### 3.5 计算某月的工作日

```python
import calendar

def count_weekdays(year, month):
    """计算某月的工作日数量"""
    cal = calendar.Calendar()
    weekdays = 0
    for day in cal.itermonthdays2(year, month):
        # 排除0（不属于本月的日期）和周末（5=星期六, 6=星期日）
        if day[0] != 0 and day[1] < 5:
            weekdays += 1
    return weekdays

# 测试
print(f"2026年3月的工作日数量: {count_weekdays(2026, 3)}")
```

## 4. 代码优化建议

1. **选择合适的日历类**：根据需要选择 `Calendar`、`TextCalendar` 或 `HTMLCalendar`。
2. **使用生成器**：`itermonthdays` 等方法返回生成器，使用它们可以节省内存。
3. **自定义日历格式**：通过继承日历类可以自定义日历的输出格式。
4. **处理边界情况**：注意处理月份为0或13的情况，以及年份的边界值。

## 5. 常见问题与解决方案

### 5.1 星期几的表示

**问题**：`weekday()` 函数返回的星期几与预期不符。

**解决方案**：注意 `weekday()` 函数返回的是0-6，其中0表示星期一，6表示星期日。

```python
import calendar

# 2026年3月1日是星期六
print(calendar.weekday(2026, 3, 1))  # 输出: 5

# 转换为更直观的表示
day_names = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
print(f"2026年3月1日是: {day_names[calendar.weekday(2026, 3, 1)]}")
```

### 5.2 月份范围

**问题**：`monthrange()` 函数返回的第一个值是星期几，但表示方式可能不直观。

**解决方案**：将返回值转换为更直观的表示。

```python
import calendar

# 2026年3月的第一天是星期六，有31天
first_day, days_in_month = calendar.monthrange(2026, 3)
day_names = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
print(f"2026年3月的第一天是: {day_names[first_day]}")
print(f"2026年3月有: {days_in_month}天")
```

`calendar` 模块是Python标准库中一个实用的工具模块，提供了与日历相关的各种功能。它支持公历日历系统，并提供了多种日历格式的输出。

### 优点
- 提供了丰富的日历相关功能
- 支持多种日历格式的输出
- 提供了日期计算的工具函数
- 易于使用和扩展

### 缺点
- 只支持公历日历系统
- 功能相对简单，对于复杂的日历需求可能不够用
- 某些函数的返回值表示方式可能不够直观

在需要处理日历相关任务的场景中，`calendar` 模块是一个方便且实用的选择。