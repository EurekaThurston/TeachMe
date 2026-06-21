# 3D 数学(for VFX TA)Resources

精选、高信任来源。讲解里的知识从这里取,不靠猜。Wisdom 来自下面的社区。

## Knowledge

- [Book(免费在线): _3D Math Primer for Graphics and Game Development_ — Fletcher Dunn & Ian Parberry](https://gamemath.com/book/)
  **本门旗舰主源。** 专为「会编程但数学薄」的图形/游戏开发者写,顺序与本课几乎一致:坐标系→向量→多坐标空间→矩阵→旋转→曲线。几何直觉讲得极清楚。遇到任何概念想要权威、完整的版本,先翻它。
- [Video 系列: _Essence of Linear Algebra_ — 3Blue1Brown](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
  视觉化讲向量、基向量、线性变换、矩阵乘法、点积、叉积、基变换。**理解「矩阵到底在干嘛」的最佳直觉来源。** 用于:向量、基、矩阵、变换模块。
- [Video 课程: _Math for Game Devs_ — Freya Holmér](https://www.youtube.com/watch?v=fjOdtSu4Lm4)
  专门讲给游戏开发者的数学:数与向量、点积、矩阵与叉积、三角与旋转、插值与物理、样条。**最贴本门场景**(实时、游戏、朝向、lerp)。频道 @acegikmo。
- [网站: _The Book of Shaders_ — Patricio Gonzalez Vivo & Jen Lowe](https://thebookofshaders.com/)
  GLSL 但数学通用:shaping functions(smoothstep/lerp)、随机、噪声、SDF 形状、矩阵。用于:模块四(UV、噪声、SDF、时间)。
- [文章库: _Inigo Quilez — Articles_](https://iquilezles.org/articles/)
  SDF 有向距离场的权威来源(`distfunctions`、smooth min)。用于:L21 SDF。
- [网站: _Scratchapixel_](https://www.scratchapixel.com/)
  从零讲图形数学(向量、矩阵、坐标空间、几何),带推导。用于:想要更细的推导时的备用。
- [文档: Unreal Engine — Niagara / 坐标空间](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-overview)
  把数学落到引擎:Niagara 模块、Local vs World、材质 HLSL 自定义节点。用于:每课「接回引擎」部分的官方依据。

## Wisdom(Communities)

- [Real Time VFX(realtimevfx.com)](https://realtimevfx.com/)
  游戏实时特效圈最大的社区,Unreal/Niagara 重镇。用于:把学到的数学用在真实效果上、求作品反馈、看大佬怎么解题。
- [Shadertoy(shadertoy.com)](https://www.shadertoy.com/)
  在浏览器里写 shader、看别人代码。**练 SDF/噪声/UV 数学的最佳沙盒**——读高赞作品的数学。
- [r/GraphicsProgramming](https://www.reddit.com/r/GraphicsProgramming/)
  图形数学/shader 的高质量问答。用于:卡在某个数学/算法时提问。
- [Unreal Slackers(Discord)](https://unrealslackers.org/)
  Unreal 社区 Discord,有 #niagara、#materials 频道。用于:引擎里的具体落地问题。

## Gaps
- 暂无:四元数「够用就好」的中文直觉向材料较少,目前以 3B1B 的 quaternion 视频 + gamemath 第 8 章兜底,后续按需补。
