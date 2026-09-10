---
title: 现代 C++ 语言内核
description: 3 周计划：值类别与移动语义、智能指针与 RAII、模板与类型推导。全部按面试高频排序，低频内容明确标注为「仅了解」。
layout: roadmap-stage
stage: '01'
duration: '3 周'
prereq: 基本语法、指针与引用、会编译
---

## 定位

原来的 12 周版本按「完整掌握语言」设计，现在压到 3 周，取舍标准只有一条：**这个知识点在面试里出现过三次以上吗？**

答是的留下，答不是的一律降级到「了解」或跳过。所以协程、Concepts、SFINAE 奇技全部出局——它们很有趣，但六个月内投入产出比太低。

省下来的时间全部压在**智能指针**和**Rule of 5** 上，这是 C++ 面试出现频率最高、也最容易被追问到实现细节的两块。

## 每周时间盒（实习期间，约 12–15 小时）

| 时段 | 内容 | 说明 |
| --- | --- | --- |
| 工作日 5 × 1.5h | 读 + 写代码 | 每晚固定，别攒到周末 |
| 周末 5h | 写练习 + 看汇编 | 大部分产出在这里 |
| 周末 1h | 整理笔记 | 用能讲给别人的标准写 |

实习日状态差就只做「读」那一项，但**不要断**。断两天再接回来要花一天找状态。

## 3 周进度表

下文把《Effective Modern C++》简称为 **EMC**，条款号以中译本为准。

| 周 | 主题 | 输入 | 输出 | 验收 |
| --- | --- | --- | --- | --- |
| 1 | 值类别与移动语义 | EMC 条款 23–30；cppreference `value_category` | 15 个表达式的值类别判定表；`emplace_back` vs `push_back` 实测 | 能说清 `std::move` 到底做了什么、完美转发何时失效 |
| 2 | 智能指针与 RAII | EMC 条款 18–22；cppreference `shared_ptr` | 手写 `unique_ptr` 与 `shared_ptr`，复现循环引用并用 `weak_ptr` 修掉 | 能画出 `shared_ptr` 的内存布局（对象 + 控制块） |
| 3 | 模板与类型系统 | EMC 条款 1–4；cppreference 四种 cast | 手写简化 `string` / `vector`（Rule of 5 + 扩容 + `emplace_back`） | 能说清 `auto` 与 `decltype` 的推导差异、四种 cast 的边界 |

## 每日安排

节奏：工作日 1.5h（0.5h 读 + 1h 写），周六 3h，周日 2h 复习自测。每周 12.5h，三周约 38h。

测试分三层：**每日小测**（1 题，30 秒闭卷）→ **周末验收**（闭卷 + 代码跑通）→ **阶段终测**（Day 21）。

### Week 1 · 值类别与移动语义

| Day | 学（0.5h） | 做（1h） | 当日小测 |
| --- | --- | --- | --- |
| 1 一 | cppreference `value_category`；EMC 条款 23 前半 | `01-value-categories`：写 `detect(int&)` / `detect(const int&)` / `detect(int&&)` 三重载，测 8 个表达式 | 不查资料说出 lvalue / xvalue / prvalue 的判定规则 |
| 2 二 | EMC 条款 23 后半 | 补到 15 个：字符串字面量、`T{}`、三元、`a.b`、`p->b`、`arr[0]` | `decltype(x)` 和 `decltype((x))` 分别是什么？为什么差一个括号就变了 |
| 3 三 | EMC 条款 23、25 | `02-move-forward`：手写 `my_move` / `my_forward`，跑通 `wrapper` 三种调用 | `std::move` 编译后有几条指令？（答案：0 条，它就是 `static_cast`） |
| 4 四 | EMC 条款 24、30 | 复现完美转发失效：花括号初始化、`0` / `NULL`、static const 成员、重载函数名 | 说出这 4 种失效里的任意 3 种 |
| 5 五 | EMC 条款 29；cppreference `emplace_back` | `push_back` vs `emplace_back` 实测（`std::vector<std::string>`，数构造与移动次数） | 什么时候 `emplace_back` 和 `push_back` 没差别？ |
| 6 六 (3h) | Compiler Explorer | 看 `move` / `forward` 在 `-O0` 与 `-O2` 下的汇编；写完 01、02 的 README | 为什么这里「零开销」是真的零 |
| 7 日 (2h) | **W1 验收** | 补漏 | 闭卷答 12 题里的 1–3 题：左值右值 / `std::move` / 完美转发失效 |

**W1 通过标准**：3 题全对 + 01、02 能跑 + README 写完。

### Week 2 · 智能指针与 RAII

| Day | 学（0.5h） | 做（1h） | 当日小测 |
| --- | --- | --- | --- |
| 8 一 | EMC 条款 18 | `03-smart-pointers`：写 `UniquePtr`（禁拷贝、移动、`release` / `reset` / `get`、自定义删除器） | `unique_ptr` 怎么禁止拷贝的？能作为函数返回值吗？ |
| 9 二 | EMC 条款 19–20；翻 libc++ 或 libstdc++ 的 `__shared_ptr` 头文件 | 实现 `ControlBlock`（strong / weak 原子计数）+ `SharedPtr` 的拷贝与析构 | 画一张 `shared_ptr` 的内存布局图：对象在哪、控制块在哪、各有什么字段 |
| 10 三 | EMC 条款 21 | 实现 `MakeShared<T>()`（一次分配）；用标准库 `weak_ptr` 修一次循环引用 | `make_shared` 少几次分配？它有什么坏处？ |
| 11 四 | — | `Node { SharedPtr<Node> next; }` 互持，观察析构没被调用；把一端换成 `WeakPtr` 再观察 | 用自己的话解释：为什么 `weak_ptr` 能断循环引用 |
| 12 五 | EMC 条款 13–17 | `04-rule-of-five`：补齐移动赋值；去掉移动构造的 `noexcept`，看 `vector<Buffer>` 扩容发生什么 | Rule of 3 / 5 / 0 分别是什么？现代 C++ 推荐哪个？ |
| 13 六 (3h) | ASan / UBSan | 03、04 全量跑 sanitizer；写多线程测试：4 线程各做 10 万次拷贝 | 你的 `SharedPtr` 计数是线程安全的吗？它指向的对象呢？ |
| 14 日 (2h) | **W2 验收** | 补漏 | 闭卷答 12 题里的 4–9 题，重点 4/5/6 三条 `shared_ptr` 追问 |

**W2 通过标准**：6 题至少对 5 题，且 **4/5/6 三条必须全对**——`shared_ptr` 几乎每场必问，会一路追问到控制块布局。

### Week 3 · 模板与类型系统

| Day | 学（0.5h） | 做（1h） | 当日小测 |
| --- | --- | --- | --- |
| 15 一 | EMC 条款 1–2 | `06-type-deduction` 的 auto 部分：写 10 个例子验证推导结果 | `auto` 什么时候推导出引用？什么时候丢掉 const？ |
| 16 二 | EMC 条款 3–4 | 验证 `decltype((x))`、`decltype(auto)` 作为返回值的差异 | 举一个必须用 `decltype(auto)` 的场景 |
| 17 三 | cppreference 模板特化 | 写一个函数模板 + 全特化；写一个类模板 + 偏特化 | 为什么函数模板不能偏特化？通常用什么替代？ |
| 18 四 | EMC 条款 27 | `06-type-deduction` 的 cast 部分：四种 cast 各一个最小用例 | `dynamic_cast` 的开销来自哪？失败时对指针和对引用分别是？ |
| 19 五 | cppreference 迭代器失效 | `05-string-vector`：补 `erase` / `insert`，实测扩容前后迭代器 | 扩容后哪些迭代器失效？`reserve` 之后插入还会失效吗？ |
| 20 六 (3h) | — | 扩容倍率实测：把 2x 改成 1.5x，各跑 100 万次 `push_back`，记录分配次数与峰值内存 | 2x 的内存浪费上限是多少？1.5x 为什么有机会复用之前释放的内存块？ |
| 21 日 (2h) | **阶段终测** | 六个目录全跑 + ASan 干净 + README 补全 | 12 题全部闭卷 |

### 三层测试怎么判

**每日小测** — 答不上来就当天回炉，不要拖。标准是「30 秒内能答」，答不上说明这个概念没真懂，继续往下走会越积越多。

**周末验收** — 错 2 题以上，周日不要进入下一周，把本周重投一天。三周总共 38 小时，多花一天补救比带着漏洞往前走划算得多。

**阶段终测（Day 21）**：

1. 12 题闭卷，目标 11 / 12
2. 六个目录全部编译运行通过，ASan + UBSan 零报告
3. 六个 README 都写了（现象 / 你的解释 / 还没搞懂的问题）

第 3 条别跳过。「还没搞懂的问题」那一栏就是下一轮复习的清单。

### 加班日的底线

实习日状态差时，只做两件事：**0.5h 读 + 当日那一题**。不写新代码也行，但不能断。断两天再接回来要花一整天找状态，这是三周计划最大的风险。

## 四个练习（落在 6 个目录里）

比原计划的八个少一半，剩下的每一个都是面试能直接聊的。练习数是 4 个、perf-lab 里是 6 个目录，
因为 `02-move-forward` 属于练习 1、`04-rule-of-five` 属于练习 3，各占一个目录。

1. **值类别判定表**（15 个表达式，精简版）
   `a`、`std::move(a)`、`f()`、`a++`、`++a`、`p->x`、`arr[0]`、字符串字面量、`T{}`、三元表达式……
   用重载决议判类别，做成表格。目标不是背下来，是能现场推导。

2. **手写 `unique_ptr` + `shared_ptr`** ⭐ 最高频
   `unique_ptr`：禁拷贝、实现移动、`release` / `reset` / `get`、自定义删除器。
   `shared_ptr`：控制块（强计数 + 弱计数）、`make_shared` 为什么只分配一次、手写一遍循环引用再用 `weak_ptr` 断开。
   面试官大概率会追问"引用计数存在哪""线程安全吗"，这两个必须能答。

3. **手写简化 `string` / `vector`** ⭐ 最高频
   Rule of 5 齐全，移动构造标 `noexcept`。
   `vector` 重点在扩容策略（1.5x 还是 2x，为什么）和 `emplace_back` 的完美转发。
   写完后用 ASan 跑一遍，确认没有泄漏和越界。

4. **类型推导与四种 cast**
   `auto` / `decltype` / `decltype(auto)` 的推导差异，写十几个例子验证。
   四种 cast 各写一个最小用例，重点说清 `dynamic_cast` 依赖 RTTI、有运行时开销。

## 验收清单

这 12 条是真实的高频面试题，全部能答上来才算过：

1. 左值和右值的区别？`std::move` 实际做了什么，它真的"移动"了吗？
2. 完美转发是什么？举出它失效的情况。
3. `push_back` 和 `emplace_back` 的区别？什么时候后者更快，什么时候没差？
4. `shared_ptr` 的实现原理？引用计数存在哪里？它是线程安全的吗？
5. 循环引用是怎么产生的？怎么解决？为什么 `weak_ptr` 能解决？
6. `make_shared` 相比 `shared_ptr<T>(new T)` 好在哪？有没有坏处？
7. `unique_ptr` 是怎么禁止拷贝的？它能作为函数返回值吗？为什么？
8. 深拷贝和浅拷贝的区别？什么时候必须自己写拷贝构造函数？
9. Rule of 3 / 5 / 0 分别是什么？现代 C++ 更推荐哪个？
10. `auto` 和 `decltype` 的推导规则有什么不同？`decltype(auto)` 又是什么？
11. `static_cast` / `dynamic_cast` / `const_cast` / `reinterpret_cast` 各自的使用场景？`dynamic_cast` 的开销来自哪里？
12. 为什么基类析构函数要是 `virtual`？为什么构造函数不能是 `virtual`？

第 4、5、6 条是重中之重。`shared_ptr` 几乎每场 C++ 面试都会问到，而且会一路追问到控制块的内存布局。

## 明确跳过

这些不要求掌握，知道存在即可，别在这里花时间：

- **协程** — 知道 `co_await` 是什么就行
- **Concepts / requires** — 能写一个简单约束即可
- **SFINAE 与模板元编程奇技** — 知道 `void_t` 和 `enable_if` 存在即可
- **手写 `optional` / `variant` / `function`** — 改为了解 SBO 概念，能说出 `std::function` 多大以内不分配堆内存

最后一条原本是旧计划的核心产出，现在降级了。如果你后面有余力，`function` 的 SBO 值得一看（涉及类型擦除），但优先级低于所有标 ⭐ 的练习。

## 常见卡点

- **`shared_ptr` 的控制块想不明白** — 直接去看 libc++ 或 libstdc++ 的头文件，画一张内存图。文字描述再详细也不如一张图。
- **模板报错一屏屏** — 只看第一行错误和最后一个 `note: ... with T = ...`，中间全是噪音。
- **实习太累，晚上不想动** — 把每晚 1.5h 拆成通勤/午休的「读」+ 睡前的「写」。只要不断，进度就不会崩。
- **想把所有东西都学透** — 这是这份计划最大的敌人。对照上面的 skip 清单，该跳就跳。

## 参考

- *Effective Modern C++*（Scott Meyers）— 条款 1–4、13–32，其余暂时不看
- [cppreference](https://en.cppreference.com/w/) — 遇到概念先查这里
- [Compiler Explorer](https://godbolt.org/) — 验证「零开销抽象」到底零没零
- `perf-lab/01-language-core/` — 练习落在这里，每个目录一个 `README.md`
