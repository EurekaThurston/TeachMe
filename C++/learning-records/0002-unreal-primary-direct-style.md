# 校准:主战场是 Unreal,且偏好「少类比、直说代码」

2026-06-21,用户在看了前几节课后给出两条重要纠正,推翻了 0001 里的一个假设。

## 发生了什么
- 用户明确表示**其实并不怎么会 Houdini**。0001 里写的"横跨 Houdini / Unreal / 独立渲染器、有 Houdini 领域直觉"是错的——他注意到课程里举了大量 Houdini 粒子/概念类比,反而增加了理解负担。
- 经确认:**主环境是 Unreal Engine**(Niagara、材质、蓝图)。压轴实操与教学示例一律以 Unreal C++ 为准,不再用 HDK/SOP。
- 教学风格:**少用类比、直接把代码讲清楚**。不要堆 DCC(Houdini/VEX 等)比喻。需要桥接时,优先用 Unreal 自己的概念(UPROPERTY、Actor、Tick…)而非外部类比。

## 对教学的影响
- MISSION.md 已更新:Why/Success/Constraints 全部转向 Unreal;新增"不熟 Houdini""少用类比直说"两条约束。
- L17/L18 压轴课已重写为 Unreal 版本(读 `ASpinningBeacon`/`ASpinningActor`、Live Coding 编译闭环),文件名保留。
- **仍待处理**:L1–L16 正文里嵌的 Houdini/VFX 类比(多在 `.callout-vex`「VFX 类比」框内)。不擅自重写 16 个文件——已作为可选项交给用户决定是否清扫。
- 0001 中"大量使用 VFX 类比作桥梁"这条**已作废**,以本记录为准。
