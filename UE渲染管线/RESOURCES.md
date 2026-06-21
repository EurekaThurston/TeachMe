# UE 4.26 渲染管线 Resources

> 高信任优先：官方文档、公认专家、引擎源码本身。每条标注"何时取用"。

## Knowledge — 一帧全景（最贴近本任务）

- [Blog: "How Unreal Renders a Frame" — Kostas Anagnostou (Interplay of Light), part 1](https://interplayoflight.wordpress.com/2017/10/25/how-unreal-renders-a-frame/) · [part 2](https://interplayoflight.wordpress.com/2017/10/25/how-unreal-renders-a-frame-part-2/) · [part 3](https://interplayoflight.wordpress.com/2017/10/25/how-unreal-renders-a-frame-part-3/)
  逐 Pass 拆解 UE 一帧的金标准（资深图形程序员手笔）。Part1=可见性/Prepass/BasePass，Part2=光照网格/光照，Part3=屏幕空间/半透明/后处理。**几乎是本课程的对照参考，每课优先引用。**

- [Series: "Unreal Engine 4 Rendering" — Matt Hoffman (lordned), Part 1 Introduction](https://medium.com/@lordned/unreal-engine-4-rendering-overview-part-1-c47f2da65346) · [Part 2 Shaders & Vertex Data](https://medium.com/@lordned/unreal-engine-4-rendering-part-2-shaders-and-vertex-data-80317e1ae5f3) · [Part 3 Drawing Policies](https://medium.com/@lordned/unreal-engine-4-rendering-part-3-drawing-policies-89bb1a3c641b) · [Part 4 Deferred Shading](https://medium.com/@lordned/unreal-engine-4-rendering-part-4-the-deferred-shading-pipeline-389fc0175789)
  从 C++ 游戏线程概念到 GPU 着色器的循序渐进。注意：写于 4.22 之前的"Drawing Policy"时代，新版 Mesh Draw Pipeline 已替代，取用时对照官方 4.22 转换指南。

## Knowledge — UE 官方文档（4.26/4.27）

- [Graphics Programming Overview — UE 4.27 Docs](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/Rendering/Overview)
  渲染模块、线程、Shader 系统的官方总览。取用：建立模块地图时。
- [Mesh Drawing Pipeline — UE 4.27 Docs](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/Rendering/MeshDrawingPipeline)
  FMeshBatch → FMeshDrawCommand → RHI 的 retained-mode 绘制与缓存/合批。取用：Part 4 几何与可见性。
- [Mesh Drawing Pipeline 4.22 Conversion Guide](https://dq8iqaixvew1d.cloudfront.net/en-US/Programming/Rendering/MeshDrawingPipeline/4_22_ConversionGuide/index.html)
  解释从旧 Drawing Policy 到新管线的迁移——读旧资料时的对照。
- [Render Dependency Graph (RDG) — UE 4.26 Docs](https://docs.unrealengine.com/4.26/en-US/ProgrammingAndScripting/Rendering/RenderDependencyGraph)
  RDG 官方说明：延迟录制→编译→依赖序执行，自动屏障/异步计算/内存别名。取用：Part 3 RDG 模块。

## Knowledge — GPU 硬件 / 图形 API 从头讲（Part 0 基础）

- [Series: "A trip through the Graphics Pipeline 2011" — Fabian Giesen (ryg blog), Index](https://fgiesen.wordpress.com/2011/07/09/a-trip-through-the-graphics-pipeline-2011-index/)
  GPU 真实实现层面的管线之旅：命令处理器、顶点处理、光栅化、Z/Stencil、像素处理。**Part 0 的首选主源。**
- [Book: _Real-Time Rendering_ (4th ed.) — Akenine-Möller, Haines, Hoffman](https://www.realtimerendering.com/)
  实时渲染的权威教材。取用：光栅化管线、着色、阴影、采样/抗锯齿等任何理论基点。
- [Article: "Life of a triangle — NVIDIA's logical pipeline"](https://developer.nvidia.com/content/life-triangle-nvidias-logical-pipeline)
  现代 GPU 内部如何把一个三角形走完管线。取用：0001/0002 硬件管线与并行性。

## Knowledge — 源码导读（先架构后源码时的"地图"）

- [GitHub: "Unreal Source Explained" — donaldwuid (rendering 章)](https://github.com/donaldwuid/unreal_source_explained/blob/master/main/rendering.md)
  顺着源码调用链讲渲染。取用：进入 FDeferredShadingSceneRenderer::Render() 等真实函数时。
- [Gamedev Guide — ikrima (Render Architecture / New Render Pipeline)](https://ikrima.dev/ue4guide/graphics-development/render-architecture/new-render-pipeline/)
  社区整理的渲染架构速查。取用：交叉验证函数名与调用关系。
- [GitHub: Render-Dependency-Graph-Documentation — staticJPL](https://github.com/staticJPL/Render-Dependency-Graph-Documentation/blob/main/Render%20Dependency%20Graph%20(RDG).md)
  RDG 深度笔记 + Triangle Shader 实例。取用：自己写 RDG Pass 时。
- Epic 官方 UE 源码（需绑定 GitHub 账号）：`Engine/Source/Runtime/Renderer/`、`RHI/`、`RenderCore/`、`D3D12RHI/`。**最终真相以源码为准。**

## Knowledge — TA / 性能视角

- [Tech Art Aid: "Understanding UE4 Rendering Passes"](https://techartaid.com/posts/ue4-render-passes/)
  以 TA 视角看各 Pass 的画面意义。取用：Part 8 调试实战、把 Pass 映射到画面。
- [Unreal Art Optimization — "Unreal's Rendering Passes"](https://unrealartoptimization.github.io/book/profiling/passes/)
  抓帧逐 Pass 的优化向解读。取用：RenderDoc 实战与性能排查。

## Wisdom (Communities)
- [Epic Developer Community Forums — Rendering](https://forums.unrealengine.com/c/development-discussion/rendering/) — 引擎渲染问题的官方论坛，可贴抓帧/源码问题求证。
- [r/unrealengine](https://reddit.com/r/unrealengine) 与 [Graphics Programming Discord](https://discord.gg/graphicsprogramming) — 图形/引擎话题高信号社区。用于：管线疑问、抓帧分析互评。
  （学习者尚未表达社区偏好；先列出，按需引导。）

## Gaps（需后续补的资源）
- UE 4.26 **GPU Scene / 实例化** 的高质量公开深读较少——多数要回到源码 `GPUScene.cpp`。
- RHI → D3D12 翻译层（命令录制、描述符堆、PSO 缓存）的体系化中文/英文长文偏少，主要靠源码 `D3D12RHI/`。
- 后处理（TAA/Tonemap）4.26 实现细节的权威长文有限——以 Interplay of Light part 3 + 源码 `PostProcess/` 为主。
