# Mission: 深入掌握 UE 4.26 渲染管线（CPU Tick → 屏幕像素全链路）

## Why
学习者要把 Unreal Engine 4.26 "一帧是怎么被画出来的" 这件事从头到尾彻底搞通——从游戏线程 Tick 的最开始，经渲染线程、RHI、GPU，一路到最终像素被扫描输出到显示器、被玩家看到。目标是同时具备四种能力：读懂/修改 UE 渲染源码、以 TA 视角分析与调试画面、定位与优化性能、以及对整条管线建立第一性原理级的理解。

## Success looks like
- 能完整复述一帧的生命周期：Game Thread → Render Thread → RHI Thread → GPU → Present → 扫描输出，并说清每一步的数据如何转换、为什么这样切分。
- 能讲清 UE 延迟着色主线：Prepass → BasePass(GBuffer) → 光照剔除 → 光照 → 阴影 → 屏幕空间技术 → 半透明 → 后处理 → Tonemap → 上屏。
- 能读懂 RDG（Render Dependency Graph）的构图/编译/执行，并理解它如何自动管理资源生命周期与屏障。
- 能用 RenderDoc / ProfileGPU / stat GPU 抓帧逐 Pass 分析，判断 CPU-bound 还是 GPU-bound，定位耗时来源。
- 能把 UE 的抽象（FScene / FPrimitiveSceneProxy / FMeshDrawCommand / RHI）映射回底层 GPU 硬件与图形 API 的真实行为。

## Constraints
- 学习者懂一些 HLSL（写过着色器），但希望 GPU 硬件管线/图形 API 从头讲一遍以巩固底层。
- 偏好：先架构、后源码。早期课用图和数据流讲通，源码（真实 4.26 文件路径与函数名）随课程推进逐步加深。
- 讲解风格：直给、信息密度高、成批产出，不堆水。少用牵强类比；可借 HLSL 作为已知锚点。
- 平台主线以 D3D12 RHI 为准（UE 4.26 默认 PC 路径）。

## Out of scope（暂不主攻，避免冲淡主线）
- UE5 专属特性：Nanite、Lumen、虚拟阴影贴图（VSM）——4.26 没有，留到掌握 4.26 主线之后。
- 移动端/Forward+ 渲染路径的细枝末节（会提及，不深挖）。
- 光线追踪（RT）管线的完整深入（4.26 有 DXR 路径，作为后期可选扩展）。
- 编辑器专属渲染（如选中描边、Editor Gizmo）。
