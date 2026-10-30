# 梯度，散度，旋度公式的学习笔记
本人是大一小灯，对空气动力学很感兴趣，又报了一门“飞行奥秘的探索”公选课,于是开始看《空气动力学基础》。

但是刚看到“基本原理和方程“就止步了,下面是书的原文：

----

----
... ...
### 2.2.11 线积分、面积分、体积分之间的关系
考虑以封闭曲线$C$为边界的开放区域$S$，设$\mathbf{A}$是一个矢量场。$\mathbf{A}$在$C$的线积分与$\mathbf{A}$在$S$的面积分由斯托克斯定理(Stokes theorem)联系起来：
$$
\boxed{
\int_{\left( C \right)} \mathbf{A} \cdot \mathrm{d} \mathbf{S} = \iint_{\left(S\right)}\left( \nabla \times \mathbf{A} \right) \cdot \mathrm{d} \mathbf{S}
\tag{1.1}
}
$$
再次考虑封闭曲面$S$包围的体$v$，矢量场$A$的面积分和体积分通过**散度定理**(divergence theorem)联系起来：
$$
\boxed{
\iint_{\left( S \right)} \mathbf{A} \cdot \mathrm{d} \mathbf{S} = \iiint_{\left( v \right)} \left( \nabla \cdot \mathbf{A} \right) \mathrm{d} v
\tag{1.2}
}
$$
如果$p$表示标量场，则用**梯度定理**(gradient theorem)给出类似于(1.2)的矢量关系：
$$
\boxed{
\iint_{\left( S \right)} p \, \mathrm{d} \mathbf{S} = \iiint_{\left( v \right)} \nabla p \, \mathrm{d} v
\tag{1.3}
}
$$
### 2.2.12 小结
本节简要回顾了这些矢量分析的要素，我们将在后续讨论中将其作为工具。
请努力回顾这些工具，直到你对它们熟练掌握为止，尤其是方框栏中的关系。

----
----

我不会面积分和曲面积分，只会简单的线积分和体积分。
也不知道$\left( \nabla \cdot \mathbf{A} \right)$ 和$\left( \nabla \times \mathbf{A} \right)$是什么玩意，只知道梯度。
所以我翻开了菲赫金哥尔茨的《微积分教程》第三卷，简单学习了线积分、面积分、体积分。
最后我发现这旋度和散度净是唬人的玩意，苏联人的教材中完全没用这些向量表示；
而且我深深震惊于数学家的注意力。

下面是本书中的表示方法：

$$
\boxed{
\begin{aligned}
\int_{\left( l \right)} \, P \, dx + Q \, dy + R \, dz  =& \\
\iint_{\left( S \right)} \, & \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) \, dxdy \\
+ & \left( \frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z}\right) \, dydz \\
+ & \left( \frac{\partial P}{\partial z} - \frac{\partial R}{\partial x}\right) \, dzdx
\end{aligned}
}
\tag{2.1}
$$
$$
\boxed{
\iiint_{\left(v\right)} \,
\left(
 \frac{\partial P}{\partial x}
+ \frac{\partial Q}{\partial y}
+ \frac{\partial R}{\partial z}
\right)
\,
dv
=
\iint_{\left(S\right)} \,
P \, dydz + Q \, dxdy + R \, dxdy
}
\tag{2.2}
$$

$$
\boxed{
\begin{aligned}
& \iiint_{\left( v \right)} \, & \frac{\partial P}{\partial x} \, dv & = \iint_S \, P \, dydz \\
& \iiint_{\left( v \right)} \, & \frac{\partial Q}{\partial y} \, dv & = \iint_S \, Q \, dxdz \\
& \iiint_{\left( v \right)} \, & \frac{\partial R}{\partial z} \, dv & = \iint_S \, R \, dxdy
\end{aligned}
}
\tag{2.3}
$$


下面就是我学到的这三个公式的推导：

## 2.1
###  要推(2.1),先要考虑更简单的xy平面线积分情况
$$
\boxed{
\int_{\left( l \right)} P\mathrm{d}x + Q\mathrm{d}y = \iint_{\left( D \right)} \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) \mathrm{d}x\mathrm{d}y
}
\tag{2.1.0}
$$
平面区域$D$是由闭路$L$围成的一个曲边梯形$a1$
$$
\int_{\left( PS \right)} P \, \mathrm{d}x = 
\int_{\left( RQ \right)} P \, \mathrm{d}x = 0
$$
$$
\begin{aligned}
\iint_{\left( D \right)} \frac{\partial P}{\partial y} &  \mathrm{d}x\mathrm{d}y \\
= &  \int_a^b\mathrm{d}x \int_{y_0\left( x \right)}^{Y \left( x \right)} \frac{ \partial P}{\partial y} \mathrm{d}y \\
= & \int_a^b P\left( x, Y\left( x \right) \right) \mathrm{d}x - \int_a^b P\left( x, y_0\left( x \right) \right) \mathrm{d}x \\
= & \int_{\left( SR \right)} P \, \mathrm{d}x - \int_{\left( PQ \right)} P \, \mathrm{d}x \\
= & \int_{\left( SR \right)} P \, \mathrm{d}x + \int_{\left( QP \right)} P \, \mathrm{d}x \\
= & \int_{\left( SR \right)} P \, \mathrm{d}x + \int_{\left( QP \right)} P \, \mathrm{d}x +  \int_{\left( PS \right)} P \, \mathrm{d}x + \int_{\left( RQ \right)} P \, \mathrm{d}x \\
= & \int_{\left( SRQPS \right)} P \, \mathrm{d}x \\
= & \int_{\left( l \right)} P \, \mathrm{d}x
\end{aligned}
\tag{2.1.1}
$$
任意形状的封闭图形都可以分成许多$a1$,相邻曲边梯形的公共边的积分相互抵消，最后得到：任意区域$D$和边线$l$都有(2.1.1)

同理但略有不同的是,如果$l$围成曲边梯形$a2$
$$
\iint_{\left( D \right)} \frac{\partial Q}{\partial x} \mathrm{d}x\mathrm{d}y 
= - \int_{\left( l \right)} Q \, \mathrm{d}y
\tag{2.1.2}
$$
(2.1.1)与(2.1.2)相加得到(2.1.0)，这被称为**格林公式**

#### 现在用这种思想去考虑(2.1)的xyz坐标系情况：

设$x,y,z$均为$u,v$的函数，
 先考虑一个侧边竖直，两底边为曲面的柱体，
$$
\begin{aligned}
\int_{\left( l \right)} P \, &  \mathrm{d} x \\
= & \int_{\left( \Lambda \right)} P \cdot \left( \frac{\partial x}{\partial u} \mathrm{d}u + \frac{\partial x}{\partial v} \mathrm{d}v \right) \\
= & \int_{\left( \Lambda \right)} \left( P \frac{\partial x}{\partial u} \mathrm{d}u + P \frac{\partial x}{\partial v} \mathrm{d}v \right) \\
\text{利用格林公式}
= & \int_{\left( \Lambda \right)} \left[ \frac{\partial}{\partial u} \left( P \frac{\partial x}{\partial u} \right) -   \frac{\partial}{\partial u} \left( P \frac{\partial x}{\partial u} \right)\right] \mathrm{d}u \mathrm{d}v \\
= & ......\\
= & \iint_{\left( S \right)} \frac{\partial P}{\partial z} \mathrm{d}z\mathrm{d}x - \frac{\partial P}{\partial y} \mathrm{d}x\mathrm{d}y
\end{aligned}
\tag{2.1.3.1}
$$
同样可以推广到任意曲面$S$

同理,
$$
\int_{\left( l \right)} Q \, \mathrm{d} y
= \iint_{\left( S \right)} \frac{\partial Q}{\partial x} \mathrm{d}x\mathrm{d}y - \frac{\partial Q}{\partial z} \mathrm{d}y\mathrm{d}z
\tag{2.1.3.2}
$$
$$
\int_{\left( l \right)} R \, \mathrm{d} z
= \iint_{\left( S \right)} \frac{\partial R}{\partial y} \mathrm{d}y\mathrm{d}z - \frac{\partial R}{\partial x} \mathrm{d}z\mathrm{d}x
\tag{2.1.3.3}
$$
(2.1.3.1~3)相加可以得到(2.1)
#### 向量形式
设$\mathbf{A} = P \mathbf{i} + Q + \mathbf{j} + R \mathbf{k}$
$$
\text{旋度:}
\nabla \times \mathbf{A}
=
\left( \frac{\partial R}{\partial y} - \frac{\partial Q}{\partial z} \right) \mathbf{i}
+ \left( \frac{\partial P}{\partial z} - \frac{\partial R}{\partial x} \right) \mathbf{j}
+ \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) \mathbf{k}
$$
$\mathrm{d}y\mathrm{d}z$是$\mathrm{d}\mathbf{S}$的$x$分量,
$\mathrm{d}z\mathrm{d}x$是$\mathrm{d}\mathbf{S}$的$y$分量,
$\mathrm{d}x\mathrm{d}y$是$\mathrm{d}\mathbf{S}$的$z$分量.

显然(2.1)和(1.1)等价

## 2.2
搞定了(2.1)，剩下两个就简单了。而且(2.2)和(2.3)其实是一个公式。

仍然像(2.1.3.1)那样考查一个底面为曲面侧面为竖直面的柱体，上底面为$S_1$,下底面为$S_2$,侧面为$S_3$.
$$
\iint_{\left( S_3 \right)} R \mathrm{d}x\mathrm{d}y = 0
$$
$$
\begin{aligned}
\iiint_{\left( v \right)} \frac{R}{z} & \mathrm{d}v \\
= & \iint_{\left( D \right)} \mathrm{d}x\mathrm{d}y \int_{z_0(x,y)}^{Z(x,y)} \frac{R}{z} \mathrm{d}z \\
= & \iint_{\left( D \right)} R\left( x,y,Z(x,y) \right) \mathrm{d}x\mathrm{d}y - \iint_{\left( D \right)} R\left( x,y,z_0(x,y) \right) \mathrm{d}x\mathrm{d}y \\
= & \iint_{\left( S_1 \right)} R \mathrm{d}x\mathrm{d}y + \iint_{\left( S_2 \right)} R \mathrm{d}x\mathrm{d}y \\ 
= & \iint_{\left( S_1 \right)} R \mathrm{d}x\mathrm{d}y + \iint_{\left( S_2 \right)} R \mathrm{d}x\mathrm{d}y + \iint_{\left( S_3 \right)} R \mathrm{d}x\mathrm{d}y \\
= & \iint_{\left( S \right)} R \mathrm{d}x\mathrm{d}y 
\end{aligned}
\tag{2.2.1.1}
$$
同样可以推广到任意曲面$S$

同理得，
$$
\iiint_{\left( v \right)} \frac{P}{z} \mathrm{d}v
= \iint_{\left( S \right)} P \mathrm{d}y\mathrm{d}z 
\tag{2.2.1.2}
$$
$$
\iiint_{\left( v \right)} \frac{Q}{z} \mathrm{d}v
= \iint_{\left( S \right)} Q \mathrm{d}x\mathrm{d}z
\tag{2.2.1.3}
$$
这就得到了(2.3), 至于(2.3)怎么推导(2.3),在下一小节再说。

(2.2.1.1~3)相加可以得到(2.2)
#### 向量形式
$$
\text{散度   }
\nabla \cdot \mathbf{A}
=
\frac{\partial P}{\partial x}
+ \frac{\partial Q}{\partial y}
+ \frac{\partial R}{\partial z}
$$
$\mathrm{d}y\mathrm{d}z$是$\mathrm{d}\mathbf{S}$的$x$分量,
$\mathrm{d}z\mathrm{d}x$是$\mathrm{d}\mathbf{S}$的$y$分量,
$\mathrm{d}x\mathrm{d}y$是$\mathrm{d}\mathbf{S}$的$z$分量.

显然,(1.2)是(2.2)的向量形式。

## 2.3
设$P=Q=R = p$,  $p$是$x,y,z$的标量函数,
$$
(2.2.1.2) \cdot \mathbf{i} \quad 
(2.2.1.3) \cdot \mathbf{j} \quad
(2.2.1.1) \cdot \mathbf{k}
$$
这三个式子相加即得(1.3)
