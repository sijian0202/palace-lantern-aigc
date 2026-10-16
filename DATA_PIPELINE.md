# 从研究资料到训练数据

[返回项目](./README.md)

## 1. 处理流程

```text
来源登记与候选收集
  → 人工筛选与用途分级
  → 视觉元素对应
  → 局部裁切 / 视角筛选
  → caption 编写与边界检查
  → 图片-caption 配对
  → 训练目录快照
  → 模型与生成输出
  → 对照分析和下一轮调整
```

候选库、裁切候选与实际训练目录承担不同任务。候选库保留研究空间；实际训练目录则需要明确每张图准备教给模型的内容。

## 2. 结构方向：围绕视角和部件组织数据

S001 的 12 组图文配对用于首轮结构探索，随后根据生成中的仰角倾向调整样本。S002 使用 15 组，记录为正面 6、四分之三 5、侧面 2、仰角 2。

S003 继续补充局部部件、制作过程和骨架资料，共 28 组：完整三维对象 6、斜视结构 6、侧面结构 4、局部结构 7、制作过程或骨架 3、结构示意 2。这种分类关注“学习对象是什么”，与纯视角分类不是同一统计口径。

S004 的 20 组数据回到明确的视角配比：平视正面 6、平视四分之三 6、侧面 4、细节 2、有限仰角参考 2。这样既保留部件资料，又限制仰角内容的比例。

## 3. Caption：对象、视角与结构语义

结构 caption 的任务是把“看到什么”说清楚，包括对象、视角、部件与材质。项目中实际保留的 S004 标注示例：

```text
PAL-S004 palace lantern structure, traditional Beijing palace lantern,
eye level front view, complete three dimensional palace lantern body,
visible top cap, vertical posts, side panels, bottom frame,
suspension point, wooden frame, traditional Chinese craft
```

这些词对应了资料分析中的部件拆解。它们表达训练目标，实际效果仍需通过生成结果检验。

## 4. 图案方向：限制要学习的范围

P001 的 20 组样本按记录分为花鸟 5、祥云如意 5、彩绘灯面 6、边饰 2、吉祥符号 2。标注已经包含 surface pattern only、flat decorative motif 和 no lantern body structure，但生成测试仍出现边框。

这说明文字标注与样本画面需要一同审查。若图像保留了明显边框或器形，仅在 caption 写“不学习外形”不能保证模型忽略它。

P002 的准备记录保留了首批与后续裁切、修订候选、21 张训练候选、22 张严格候选及 v2、v3 pattern-only 等版本。不同版本用于继续筛掉物体形状与边框干扰，最终实际训练目录为 22 组。

P002 的一条实际标注示例：

```text
PAL-P002 palace lantern pattern, peony motif, surface pattern only,
flat decorative motif, no object frame, no lantern body,
no vessel shape, no wooden structure, traditional Chinese craft
```

这里同时描述牡丹纹这一正向学习对象，以及需要检查的器框、灯体、器形与木结构边界。文字中的否定描述是标注策略，不能当作效果保证。

## 5. 图文配对与版本检查

本次逐一核对六个实际 train 子目录：

| 实验 | 图片 | Caption | 每张图片是否有同名标注 |
| --- | ---: | ---: | --- |
| PAL-S001 | 12 | 12 | 是 |
| PAL-S002 | 15 | 15 | 是 |
| PAL-S003 | 28 | 28 | 是 |
| PAL-S004 | 20 | 20 | 是 |
| PAL-P001 | 20 | 20 | 是 |
| PAL-P002 | 22 | 22 | 是 |

检查结果保存为[数据清单](./data/dataset-inventory.csv)。各轮合计为 117 个图文配对条目，跨轮可能复用，不能解释为 117 张互不重复的来源图。配对检查也不等于逐条确认 caption 的语义质量。

## 6. 如何为下一轮保留依据

每轮至少关联实验 ID、素材来源映射、图文配对、训练配置、模型文件、生成条件、对照图片与观察结论。发生效果变化时，可以检查改变的是数据、标注、参数还是生成设置，而不依赖文件名里的“新版”“最终版”。

下一步需要进一步整理去重统计与源图关系，并将最终配置快照绑定到实际运行日志，再形成完整的复现资料。
