- 本节主题 ---  线性分类器的应用和训练

- Linear Classifiers 线性分类器 --- 感知器
	- 输入 是 feature values 特征值
		- 比如 f 是统计 x 的词频
	- 每个 feature 有 weight 权重
	- 它们的和是 激活值
	- $activation_w(x)=\sum_i w_i f_i(x)=wf(x)$

- Binary Decision Rule
	- activation > 0 是一个区间，activation<0 是一个区间，activation=0 是中间态，这样就二分了，计算得到的值在哪个区间就用对应的label

- Weight Updates
	- 开始 weights=0
	- 对于每个训练数据
		- 如果正确（即y=y*），则无需更改！
		- 如果错误：通过添加或减去特征向量来调整权重向量。$w = w+y^* \cdot f$

- Multi-class Decision Rule
	- 对每个类有一个权重向量 $w_y$ 
	- f(x) 对每个类的分数是 $w_y \cdot f(x)$ 
	- 最后的标签类 $y = argmax_y \ w_y \cdot f(x)$

	- Weight Updates
		- 和之前一样，开始 weights = 0
		- 对每个训练数据
			- 如果正确，则不做任何改变！
			- 如果错误：降低错误答案的分数，提高正确答案的分数$w_y = w_y - f(x)$ 和 $w_{y^*}=w_{y^*} + f(x)$


- 线性分类的局限
	- 噪声：如果数据不可分离，权重可能会混乱
	- 过度训练：测试/保留集准确率通常先上升，然后下降