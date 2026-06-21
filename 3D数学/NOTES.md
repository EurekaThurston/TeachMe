# Working Notes — 3D 数学(for VFX TA)

## 用户画像 / 教学偏好
- Unreal/Niagara 方向**特效 TA**;数学地基**几乎从零**(sin/cos、坐标、向量名词都模糊)。
- 目标:写 HLSL / 调 Niagara / 处理坐标空间与朝向时,能**自己推、能 debug、能讲**,而非套公式。
- **中文授课**;数学/图形术语保留英文原文 + 中文解释(vector、dot、normalize、basis、quaternion…)。
- **几何直觉优先,代码只是落地。代码锚点 HLSL + Niagara 并重**(AskUserQuestion 2026-06-21 确认)。
- 跨工作区通用偏好:每课**深入、信息量大但不堆水**;偏好**一次成批产出**章节;动手型,要即时反馈练习。

## 教学手法(本工作区约定)
- 单课结构:1 个核心收获 + 3-5 个 h2 子节 + HLSL 与 Niagara 双示例 + **「易错点/常见误区」** 小节 + 5-6 道即时反馈测验。**几何直觉 > 公式 > 代码**。
- **明确锚四大场景**(用户全选):① 材质/Shader HLSL ② Niagara 矢量运算 ③ 变换与坐标空间 ④ 旋转/四元数。每个数学概念都要落到这四类之一。
- 顺序铁律:**先向量、再空间/矩阵、再旋转、最后程序化 shader 数学**(向量是一切的地基)。坐标系/角度/数值映射作为模块 0 地板课先垫。
- 共享组件:`assets/styles.css`(Tufte + 数学靛蓝/青配色,**所有课共用、勿改**)、`assets/quiz.js`(等长选项即时反馈,**勿改**)、`assets/math-tools.js`(可拖拽 2D 向量画布 `VecPlayground`、单位圆、lerp 滑块等,跨课复用)。新课一律复用,新交互组件按模块加进 `math-tools.js` 或新建 `*-tools.js`。
- 术语统一见 `reference/glossary.html`,出课一律遵守。

## 关键坑(每次出课必查)
- **JS 字符串引号坑:** 测验/JS 文案里**严禁 ASCII 直引号 `"` `'`**(会截断 JS 字符串、整段测验失效)。一律用中文「」『』或弯引号""''。出课后用 `node` 跑 `new Function` 验证语法。
- 数学符号:向量用 **粗体或带箭头**;HLSL 用 `float2/3/4`、`dot`、`cross`、`normalize`、`saturate`、`lerp`、`frac`;Niagara 用模块名(Add Velocity、Solve Forces and Velocity、Scale Color 等)。
- UE 坐标系约定:**左手系,X=前 Y=右 Z=上,单位 cm**;角度多用度,内部三角用弧度——讲到时点明,别让从零的人混淆。

## 课程进度(完整路线图见 SYLLABUS.html)
- **模块 0 地板:** 0001 ⏳ 坐标系与空间 · 0002 ⏳ 角度与三角(sin/cos/单位圆) · 0003 ⏳ 数值映射(lerp/clamp/saturate/smoothstep)
- **模块 1 向量:** 0004 ⏳ 向量是什么 · 0005 ⏳ 加减与缩放 · 0006 ⏳ 长度与归一化 · 0007 ⏳ 点积 dot · 0008 ⏳ 叉积 cross
- **模块 2 空间与变换:** 0009–0014(空间概念/基向量/矩阵/TRS与乘序/法线逆转置/切线空间)
- **模块 3 旋转:** 0015–0018(2D 旋转/欧拉角与万向锁/四元数+slerp/look-at 朝向构造)
- **模块 4 程序化 shader 数学:** 0019–0023(UV 与采样/噪声与随机/SDF/时间波动/曲线与缓动收尾)
- 状态记号:✅ 已出 · ⏳ 计划中。本轮先出 0001–0008(模块 0+1)并立完整 syllabus。
