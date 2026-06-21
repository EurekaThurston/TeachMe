# Working Notes

## 用户画像 / 教学偏好
- 特效向 TA,**主战场 Unreal Engine**(Niagara、材质、蓝图)。**不熟 Houdini**。
- 自评几乎零编程基础。有 VFX 直觉(向量、属性、着色),但不要默认他懂 DCC 细节。
- 用中文授课。课程 HTML 内文用中文,代码与术语保留英文原文 + 中文解释。
- 目标:**读懂并改现有 Unreal C++ 代码**(Actor/Component、引擎模块),不是从零造工程。

## 教学手法(本工作区约定)
- 每课极短,一个明确收获,落在 ZPD 内。
- **少用类比、直接把代码讲清楚**(2026-06-21 用户明确纠正,见 learning-record 0002)。需桥接概念时优先用 Unreal 术语(UPROPERTY/Actor/Tick),别堆 Houdini/VEX 比喻。
- **真要类比就锚 HLSL/shader 和 UE 蓝图**——用户对这两者相对熟,Houdini/VEX 不熟。
- 阅读技能优先于写代码;但保留交互测验做即时反馈。
- 共享组件:`assets/styles.css`(Tufte 风格主样式)、`assets/quiz.js`(测验小部件,equal-length 选项、即时反馈)。新课一律复用,不内联重复代码。

## 课程进度
完整路线图见 `SYLLABUS.html`(18 节,六部分,从零基础到"读懂并改"真实 Unreal C++ 代码)。全部 18 节已产出。
- 01-02 上手版(温和):函数签名、函数体数据流。
- 03-05 语言零件:变量类型赋值、运算符表达式、循环。
- 06-08 指针墙:引用、指针、内存与生命周期。
- 09-12 聚合数据与标准库:数组/vector、string/map、struct·class、class 深入。
- 13-16 让整文件可读:头文件·编译、命名空间 ::、模板、枚举/switch/位标志。
- 17-18 收成:通读真实 Unreal Actor 源码、改并 Live Coding 编译。

新组件:`SYLLABUS.html` 总览页;`styles.css` 新增 `.t-str`(字符串字面量配色)。
03 起为"深入版"(每节 3-5 子节、多代码示例、易错点、5-6 题)。
**2026-06-21 校准(见 learning-record 0002):主战场转向 Unreal,用户不熟 Houdini、偏好少类比直说。L17/L18 已重写为 Unreal 版(ASpinningBeacon / ASpinningActor / Live Coding,文件名保留)。L1–L16 仍含旧 Houdini 类比(多在 `.callout-vex` 框),是否清扫待用户决定。**
后续可能的分支:从零写完整 Unreal 插件/组件、深入 Niagara/渲染模块源码 —— 届时更新 MISSION 再排。
