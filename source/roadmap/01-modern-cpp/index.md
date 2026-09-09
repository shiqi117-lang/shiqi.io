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

| 周 | 主题 | 输入 | 输出 | 验收 |
| --- | --- | --- | --- | --- |
| 1 | 值类别与移动语义 | EMC 条款 23–30；cppreference `value_category` | 15 个表达式的值类别判定表；`emplace_back` vs `push_back` 实测 | 能说清 `std::move` 到底做了什么、完美转发何时失效 |
| 2 | 智能指针与 RAII | EMC 条款 18–22；cppreference `shared_ptr` | 手写 `unique_ptr` 与 `shared_ptr`，复现循环引用并用 `weak_ptr` 修掉 | 能画出 `shared_ptr` 的内存布局（对象 + 控制块） |
| 3 | 模板与类型系统 | EMC 条款 1–4；cppreference 四种 cast | 手写简化 `string` / `vector`（Rule of 5 + 扩容 + `emplace_back`） | 能说清 `auto` 与 `decltype` 的推导差异、四种 cast 的边界 |

## 四个练习

比原计划的八个少一半，剩下的每一个都是面试能直接聊的：

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
