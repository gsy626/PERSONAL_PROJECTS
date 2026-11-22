# 飞行器结课展示 · Beamer 模板

“探索飞行的奥秘”结课展示用的 LaTeX Beamer 模板。视觉风格照搬课程 PPT：
绿色渐变顶栏 + 校徽标签、红色节号块、标题下的绿色细线、右上角校楼线稿、
绿色页脚 + 红色页码块；节首页则是大号渐变节号 + 竖向虚线 + 红色短杠，
底部红条配校训书法。

16:9，版面 160 mm × 90 mm，全部示例文案均为占位文字，直接替换即可。

## 编译

需要 **XeLaTeX**（主题用 fontspec 调用 Lato 字体，需系统装有 Lato）和
`latexmk`：

```bash
latexmk -xelatex main.tex
```

或手动编译 **两遍**：

```bash
xelatex main.tex
xelatex main.tex
```

> 必须编译两遍。页眉、页码、节首页都是 `remember picture` 的绝对定位
> 图形，第一遍时页面锚点尚未写入 `.aux`，会错位或缺失；第二遍才正确。

## 文件结构

```
main.tex                 示例讲稿（封面 / 目录 / 5 个章节 / 致谢）
bitbeamer.sty            主题文件
assets/
  logo_header.png        顶栏白色校徽（已裁去透明边）
  logo_footer.png        页脚白色校徽
  building.png           校楼线稿
  watermark.png          校徽水印（#F6F6F6）
  motto.png              校训书法“德以明理 学以精工”
main.pdf                 编译结果
preview.png              16 页缩略图
```

## 用法

### 标题页

```latex
\title{Aircraft Name}
\subtitle{Design, aerodynamics and mission profile}
\institute{EXPLORING THE MYSTERIES OF FLIGHT}  % 建议全大写，显示在标题上方
\author{Presented by Your Name}
\date{November 2026}

\begin{frame}[plain]
  \titlepage
\end{frame}
```

### 章节与节首页

每个 `\section` 前用 `\bitsectionintro{...}` 给节首页写一句副标题，
`\section` 会自动插入节首页（大号 01/02/…，无需手动排版）：

```latex
\bitsectionintro{Role, story and design at a glance}
\section{The Aircraft}
```

不需要节首页时在导言区关闭：

```latex
\bitsectionpages{false}
```

节首页右下角的圆点表示共几节、当前第几节，总节数由 `.aux` 自动统计
（所以需要两遍编译）。

### 内容页

```latex
\subsection{Why This Aircraft?}   % 决定红色块里的编号 1.1
\begin{frame}
  \frametitle{Why This Aircraft?}
  ...
\end{frame}
```

红色块编号默认是“节号.小节号”（如 `1.1`），没有小节时只显示节号，
第一章之前显示 `00`。也可手动指定一页：

```latex
\bitslidetag{3.2}
```

它保持到下次修改；用 `\bitslidetag{}` 恢复自动编号。

### 常用组件

| 命令 | 作用 |
| --- | --- |
| `\bitkw{...}` | 红色加粗关键词 |
| `\bitemph{...}` | 绿色加粗关键词 |
| `\bitfigcaption{...}` | 绿底白字图注条（宽度随栏宽） |
| `\bitfigplaceholder[宽]{文字}` | 灰色虚线图占位框 |
| `\begin{block}{标题}…\end{block}` | 绿头浅灰正文块 |
| `\begin{alertblock}{标题}…\end{alertblock}` | 红头告警块 |
| `\begin{exampleblock}{标题}…\end{exampleblock}` | 深绿示例块 |
| `\begin{bittable}{列格式}` | 1.35 倍行距的 booktabs 表格 |

插入真实图片时把 `\bitfigplaceholder` 换成：

```latex
\includegraphics[width=\linewidth]{assets/your-photo.jpg}
```

### 其他页面

```latex
% 致谢页
\begin{frame}[plain]
  \bitclosingpage{Thank You}{Questions and discussion are welcome}
\end{frame}
```

### 颜色

主题里定义了 `bitgreen`、`bitgreendark`、`bitred`、`bitgray`、`bitlight`、
`bitline`、`bitdark`；正文用 `\textcolor{bitgreen}{...}` 即可。

## 版式参数

尺寸都集中在 `bitbeamer.sty` 的“Page geometry”一节（单位 mm）：
`\bit@headbar`（红色块高 11.5）、`\bit@headpad`（标题栏下留白）、
`\bit@foot`（页脚高 8.8）、`\bit@tabw`（红色块宽 18）、
`\bit@titleX`（标题左边距 19.4）。改这些值需要重新对一下版式，
页眉页脚是相对页面绝对定位的。

正文左右边距在 `\setbeamersize{text margin left=12mm,text margin right=9mm}`。

## 说明

- 模板中的校徽、校楼线稿、校训书法均取自课程提供的 PPT，仅用于本课程
  展示；正式对外使用前请确认授权。
- 这是按 PPT 风格复刻的非官方模板，不由学校官方维护。
- 主题固定了字号（标题 14.4 pt、正文 9.8 pt）；如果改 `\documentclass`
  的字号选项，页眉的垂直对齐需要重新微调。
