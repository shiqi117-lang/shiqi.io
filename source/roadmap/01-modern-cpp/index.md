---
title: 现代 C++ 语言内核
description: 十二周学习计划：值类别与移动语义、RAII 与异常安全、模板与 SFINAE、constexpr 编译期计算、Lambda 与可调用对象、Concepts 与协程。
layout: roadmap-stage
stage: '01'
duration: '10–12 周'
prereq: 基本语法、指针与引用、会编译
---

## 这一阶段要解决什么

你现在的 C++ 大概率停留在"能跑起来"这一层：知道有 `std::move`、会写个 `template<class T>`，但说不清它们落到机器上是什么。这一阶段的目标很具体——**看到一行 C++，能预测编译器会生成什么，以及为什么**。

判断标准也很直接：读完这一阶段，你应该能回答"这个写法到底有没有开销"，而不是猜。

## 每周时间盒（按 10 小时计）

| 时段 | 内容 | 备注 |
| --- | --- | --- |
| 3h | 精读：EMC 对应条款 + cppreference | 读的时候手边必须有编译器 |
| 4h | 写代码：每个概念落一个最小可编译示例 | 不写等于没学 |
| 2h | 看汇编：Compiler Explorer 对照 | 这是把"记住"变成"理解"的关键一步 |
| 1h | 写笔记：用自己的话讲一遍 | 讲不清的地方就是没懂的地方 |

每周只有 5–6 小时的话，把每格按 1.5–2 倍拉长，**顺序不要变**——这几个模块之间有硬依赖关系（值类别 → 移动语义 → 模板 → SFINAE），跳着学会卡死。

## 12 周进度表

下文把《Effective Modern C++》简称为 **EMC**，条款号以第 1 版中译本为准。

| 周 | 模块 | 输入 | 输出 | 验收 |
| --- | --- | --- | --- | --- |
| 1 | 值类别与引用 | EMC 条款 23–24；cppreference `value_category` | 一张值类别判定实验表（30 个表达式） | 能背出 lvalue / xvalue / prvalue 的判定规则，并给每类举 3 个例子 |
| 2 | 移动语义与完美转发 | EMC 条款 23–30 | 手写 `my_move` / `my_forward`；一个带移动构造的 `Buffer` + 拷贝/移动 benchmark | 能解释"为什么 `std::move` 不移动"、万能引用何时退化 |
| 3 | RAII 与 Rule of 0/3/5 | EMC 条款 13–22 | 简化版 `unique_ptr`、`ScopeGuard` | 说清 Rule of 0/3/5 各自适用场景，以及为什么优先 Rule of 0 |
| 4 | 异常安全与 noexcept | EMC 条款 14 | 给上周的 `Buffer` 补齐强异常安全保证 | 区分三种异常安全保证；说清容器扩容为何依赖移动构造 `noexcept` |
| 5 | 模板基础与实例化模型 | 《C++ Templates》ch.1–3 | `type_traits` 子集：`is_same` / `remove_cv` / `conditional` / `enable_if` | 解释两阶段名字查找与 ADL；说清何时必须写 `typename` / `template` |
| 6 | 变参模板与折叠表达式 | 《C++ Templates》ch.4 | 可变参数 `print`；简化版 `tuple` | 能手写递归展开与折叠表达式两种写法 |
| 7 | SFINAE 与检测惯用法 | cppreference `void_t`、`enable_if` | `is_detected` 检测器；用它做"有 `size()` 就用它"的分派 | 说清 SFINAE 的替换失败边界，以及 C++20 `requires` 解决了什么 |
| 8 | CRTP、tag dispatch、if constexpr | EMC 条款 27、37 | 用 CRTP 写静态多态计数器，与虚函数在 Compiler Explorer 上对比汇编 | 量化静态多态与动态多态的代价差异 |
| 9 | constexpr 与编译期计算 | cppreference `constexpr` / `consteval` | 编译期字符串；编译期素数表 | 说清 constexpr 函数在 C++11 / 14 / 20 的限制演进 |
| 10 | Lambda 与可调用对象 | EMC 条款 31–32 | 简化版 `std::function`（含 SBO） | 解释闭包类型、捕获方式、无捕获 lambda 转函数指针的条件 |
| 11 | Concepts 与 ranges 入门 | cppreference `constraints` | 给自己写的容器加 concept 约束 | 独立写出一个 concept，并解释 requires 子句的求值顺序 |
| 12 | 协程（压轴，可延后） | cppreference `coroutines` | 手写 `promise_type` 的 generator | 画清协程挂起 / 恢复的控制流图 |

第 12 周是唯一可以推迟的模块。协程在性能优化里的直接用途有限，先放一放不影响后面 02–04 阶段；等做到 07 阶段（并发）需要用有栈/无栈协程时再回头补，理解会快得多。

## 八个必须落地的练习

按依赖顺序排，每个都要有独立 `.cpp` 和一段 README 记录结论：

1. **值类别实验矩阵** — 对 `a`、`std::move(a)`、`f()`、`a++`、`++a`、字符串字面量、`T{}`、成员访问等 30 个表达式，用 `decltype` 和重载决议判类别，做成表格。
2. **手写 `move` / `forward`** — 就两行 `static_cast`，但必须自己写一遍并解释为什么 `remove_reference` 不可省。
3. **`Buffer` 类** — Rule of 5 齐全，移动构造标 `noexcept`，穿插异常安全：让 push 在分配失败时保持原状态不变。
4. **简化 `unique_ptr` + `ScopeGuard`** — 体会"资源获取即初始化"到底把什么责任转移给了编译器。
5. **`type_traits` 子集** — `is_same`、`remove_cv`、`conditional`、`enable_if`、`is_integral`。写完后对比标准库实现，看差在哪。
6. **简化 `tuple` / 可变参数 `print`** — 递归展开和 C++17 折叠表达式各写一遍。
7. **`optional` 与 `variant`** — 阶段核心产出。`variant` 重点在实现访问（访问者 + 递归 union），别用一堆 `if-else` 糊过去。
8. **`function` with SBO** — 阶段核心产出。搞清楚小对象优化的内联缓冲多大、什么时候会退化到堆分配，这一步直接决定你后面能不能看懂 `std::function` 的调用开销。

**验收方式**：这些练习统一放在 `perf-lab/01-language-core/` 下，每个目录一个 `main.cpp` + `README.md`。README 只写三件事：现象、你的解释、还没搞懂的问题。

## 验收清单

全部能答上来，才算过这一阶段：

1. `lvalue` / `xvalue` / `prvalue` 的判定规则是什么？给 `a`、`std::move(a)`、`f()`、`a++`、`++a`、字符串字面量各分类。
2. 为什么模板里的 `T&&` 叫万能引用？什么情况下它并不是？
3. `std::move` 实际做了什么？为什么对 `const` 对象调用它通常没效果？
4. 完美转发会在哪几种情况下失效？（至少说出花括号初始化、`0` / `NULL`、静态 `const` 成员、重载函数名这四种）
5. Rule of 0 / 3 / 5 分别是什么？为什么现代 C++ 优先 Rule of 0？
6. 基本、强、不抛三种异常安全保证的区别？
7. 为什么 `vector` 扩容要求移动构造是 `noexcept`？不是的话会发生什么？
8. 两阶段名字查找是什么？为什么 `swap(a, b)` 和 `std::swap(a, b)` 可能调到不同函数？
9. ADL 是什么？举一个它让代码"意外通过编译"的例子。
10. SFINAE 的"替换失败"边界在哪？哪些错误不属于 SFINAE？
11. `if constexpr` 和预处理 `#if`、普通 `if` 三者有什么区别？
12. constexpr 函数的限制在 C++11 / 14 / 20 分别是怎样放宽的？
13. 无捕获 lambda 为什么能转函数指针？`std::function` 的 SBO 是什么，多大以内不分配堆内存？

第 13 题答不上来很正常——它取决于具体实现（libstdc++ 和 libc++ 的内联缓冲大小不同）。答不上来时去翻你用的标准库头文件，把数字找出来，这本身就是训练。

## 常见卡点

- **值类别太抽象** — 别背定义。用两条判据：能不能取地址（有身份）、能不能被移动（可复用资源）。然后填那张 30 个表达式的表，填完自然就懂了。
- **模板报错一屏屏** — 只看第一行错误和最后一个 `note: ... with T = ...`。中间全是噪音。定位不了就用 `static_assert` 和 `if constexpr` 把条件一段段砍掉。
- **元编程上瘾** — 设个硬预算：单个 trait 超过 20 行就停手，换成 `if constexpr` 或 concepts。C++11 的模板元编程技巧大部分在 C++17/20 里已经有更直白的写法，别为了炫技写不可维护的代码。
- **只看不写** — 这条最致命。每个概念必须有一个能编译、能跑、能在 Compiler Explorer 上看到汇编的 `.cpp`。没有产出的阅读，两周后就忘干净。

## 参考

- *Effective Modern C++*（Scott Meyers）— 主教材，按上面的周表拆着读
- *C++ Templates: The Complete Guide* 第二版 — 工具书，第 5–7 周当参考查
- [cppreference](https://en.cppreference.com/w/) — 遇到概念先查这里，比博客准
- [Compiler Explorer](https://godbolt.org/) — 每周那 2 小时的场地
- *C++20: The Complete Guide*（Josuttis）— 第 11 周 Concepts 部分
