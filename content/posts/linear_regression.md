---
title: "Linear Regression"
date: 2020-06-03T16:51:10+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    # weight: 20
    name: "Linear Regression"
summary: "From zero to linear regression"
image: "img/linear_regression.png"
---

What is `linear regression` 🤷‍♂️?

If you're interested read on, if you're not, see yourself out. 🚪

This article is the first of a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works
  2. [**The nitty gritty**]({{< relref "#the-nitty-gritty" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

---

## The idea and key concepts


`Regression` is any algorithm that takes a collection of inputs and predicts an output.

Let's say we are trying to predict how much a house 🏡 will sell for in a desirable area of North London. We may know a few facts about the house e.g. the square footage of the house 🏠, the square footage of the garden 🌳 and whether there is a garage 🚙.

In machine learning we call these facts `variables` or `features`. Intuitively we may value the house using a combination of these features.

Linear regression uses a `linear combination` of the features to predict the output. This just means summing up each feature value multiplied by a number (a `coefficient`) to represent how important that feature is e.g

{{<formula class="responsive-math-unfold">}}
\begin{aligned}
\text{House Price} &= (£1000 * \text{🏠}) \\
& + (£50 * \text{🌳}) \\
& + (£1000 * \text{🚙?})
\end{aligned}
{{</formula>}}

In this example the house price is calculated as $£1000$ for each square foot of the house plus $£50$ for each foot in the garden plus $£1000$ if there is a garage. If we took a nice $600$ square foot property with a small $500$ square foot garden and no garage our linear regression model would predict the house is worth $£625,000$.

{{<formula class="responsive-math-4">}}
\begin{aligned}
\text{House Price} &= (£1000 * \text{🏠}) + (£50 * \text{🌳}) + (£1000 * \text{🚙 ?}) \\
&= (£1000 * 600) + (£50 * 500) + (£1000 * 0)\\
&= £625,000
\end{aligned}
{{</formula>}}

Now that's how the linear regression model works! The question now is how do you choose the coefficients for the features, in our example the $1000$ the $50$ and the $1000$? 🤷‍♂️

A common type of machine learning algorithm called `supervised learning algorithms` find these parameters using `training data`. Training data is just examples where you already know the answer. In our case it is a list of houses where we know both the house features and the house prices in advance. Here is an example of three training examples with the model predictions:

{{< table "table table-striped" >}}
| House size 🏠 | Garden size 🌳 | Garage? 🚙 | True House Price 💰 | Predicted house price 💰 |
| ------------ | ------------- | --------- | ------------------ | ----------------------- |
| 1000         | 700           | Garage    | £1m                | £ 1.036m                |
| 770          | 580           | No Garage | £0.75m             | £0.799m                 |
| 660          | 200           | Garage    | £0.72m             | £0.671m                 |
{{</table>}}

We want to chooses the coefficients to `minimise the average error` when predicting the house price for all the training examples. This `average error` is also known as the `cost` and can be defined in different ways.

To better visualise the error associated with a prediction it is easier to see in a graph. To make the visualisation easier let's assume that we only know one feature - the house size - for each training example. 

The linear regression model in this case can be written as:

{{<formula class="responsive-math-2">}}
\text{House Price} = \text{Price per Sq. ft.} * \text{Size}
{{</formula>}}

Below I have plotted 20 example houses in green showing the price on the y-axis and the house size (in square feet) on the x-axis. I have also plotted the line of best fit (the linear regression model) with the predictions marked as black circles. The red lines shows the absolute error between the predictions and the true house price.


You can vary the price per square foot (the coefficient in the model) to see how this impacts the average error.

{{< linear_regression >}}

The best coefficients - that minimise the error - can be found by solving an equation called the `normal equation` or by `gradient descent`. 

Gradient descent works by iteratively changing the coefficients to reduce the error between the predictions and the true house prices. The specifics of this process requires more maths and is detailed in the next section. I haven't gone into the normal equations in this post.

In short the linear regression algorithm chooses the coefficients to `minimise the average error` when predicting the house prices for all the training examples.

And that's linear regression!

---

## The nitty gritty

In order to keep this as accessible as possible to people less familiar with mathematical concepts and notation I will include footnotes to explain where I think it may help.

**The model**

If we let $y$ represent a single continuous target variable and $x_1,\dots,x_n$ (where $n \in \mathbb{N}$[^1] and $x_0 = 1$) represent the feature values. Then the linear model can be written as 


{{<formula class="responsive-math">}}
\begin{align}
\hat{y}&=\beta_0x_0+\cdots+\beta_nx_n \\
\hat{y}&=\sum^{n}_{i=0}\beta_ix_i
\end{align}
{{</formula>}}

A hat above a variable is often used to represent a prediction of the true value. Here the y hat represents the linear model prediction.

**The cost function**

We define below the `cost` (a.k.a. `error` or `loss`) function $J$ as half of the `mean square error` for the $m$ training samples where $m \in \mathbb{N}$. We use a superscript to represent each training example so $y^j$ is the $j$th training data target value and $x_i^j$ is the $i$th feature value of the $j$th training example.

{{<formula class="responsive-math">}}
\begin{align}
J(\boldsymbol{\beta})
&= \frac{1}{2m}\sum^{m}_{j=1}\left(
y^j-\hat{y}^j
\right)^2\\
&= \frac{1}{2m}\sum^{m}_{j=1}\left(
y^j-\sum^{n}_{i=0}\beta_ix_i^j
\right)^2
\end{align}
{{</formula>}}

**Gradient descent**

In order to find the coefficients that lead to the minimal cost we use `gradient descent`. The `gradient` of the cost function tells you in which direction to change your coefficients in order to reduce the value of the cost function the most. The gradient is defined as the `vector of partial derivatives` with respect to each coefficient so let's first calculate these:

{{<formula class="responsive-math-3">}}
\begin{align}
\frac{\partial J}{\partial\beta_k}\left(\boldsymbol{\beta}\right) 
&= \frac{\partial}{\partial\beta_k}\left(
\frac{1}{2m}\sum^{m}_{j=1}
\left(
y^j-\sum^{n}_{i=0}\beta_ix_i^j
\right)^2
\right)\\
&=
\frac{1}{m}\sum^{m}_{j=1}
\left(
y^j-\sum^{n}_{i=0}\beta_ix_i^j
\right)(-x^j_k)\\
\end{align}
{{</formula>}}

Now we can write the gradient as:

{{<formula class="responsive-math-2">}}
\begin{aligned}
\nabla_{\boldsymbol{\beta}} J
&=
\begin{bmatrix}
    \frac{\partial J}{\partial\beta_0} \\
    \vdots \\
    \frac{\partial J}{\partial\beta_n}
\end{bmatrix} \\
&=
\begin{bmatrix}
       -\frac{1}{m}\sum^{m}_{j=1}
           \left(y^j-\sum^{n}_{i=0}\beta_ix_i^j\right)x^j_0\\
       \vdots \\
       -\frac{1}{m}\sum^{m}_{j=1}
           \left(y^j-\sum^{n}_{i=0}\beta_ix_i^j\right)x^j_n\\
\end{bmatrix}
\end{aligned}
{{</formula>}}

We could calculate the above gradient using the sums defined but it is more efficient for implementing if we `vectorise` the calculation.

**Vectorise**

For this we define the `design matrix` $\mathbf{X}$ by stacking the $m$ training examples on top of each other, so each row of $\mathbf{X}$ represents one training example and the columns represent the different features. We also define $\mathbf{y}$ the vector of target values by stacking the $m$ target variables on top of each other. Finally we also define the vector of $n+1$ coefficients $\boldsymbol{\beta}$. Where:[^2]

{{<formula class="responsive-math-2">}}
\mathbf{X}\in\mathbb{R}^{m\times (n+1)},
\quad \mathbf{y}\in\mathbb{R}^{m\times 1},
\quad \boldsymbol{\beta}\in\mathbb{R}^{(n+1)\times1}
{{</formula>}}

Or more visually

{{<formula class="responsive-math-1">}}
\mathbf{X}=\begin{bmatrix}
    1 & x_1^1  & x_2^1  & \dots  & x_n^1  \\
    1 & x_1^2  & x_2^2  & \dots  & x_n^2  \\
    \vdots & \vdots & \vdots & \ddots & \vdots \\
    1 & x_1^m  & x_2^m  & \dots  & x_n^m  \\
\end{bmatrix}
{{</formula>}}

and

{{<formula class="responsive-math-1">}}
\mathbf{y}=\begin{bmatrix}
    y_1\\y_2\\\vdots\\y_m
\end{bmatrix} \quad
\boldsymbol{\beta} = \begin{bmatrix}
    \beta_0\\\beta_1\\\vdots\\\beta_n
\end{bmatrix}
{{</formula>}}

Now if we take the above gradient we derived above and re-write it splitting the terms we see

{{<formula class="responsive-math-4">}}
\nabla_{\boldsymbol{\beta}} J
=-\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}y^jx^j_0\\
       \vdots \\
       \sum^{m}_{j=1}y^jx^j_n\\
\end{bmatrix}+
\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}\sum^{n}_{i=0}\beta_ix_i^jx^j_0\\
       \vdots \\
       \sum^{m}_{j=1}\sum^{n}_{i=0}\beta_ix_i^jx^j_n
\end{bmatrix}\\
{{</formula>}}

From this (I hope you can convince yourself, assuming you know matrix multiplication) we can write
{{<formula class="responsive-math">}}
\begin{align}
\nabla_{\boldsymbol{\beta}} J
&=\frac{1}{m}\left(
\mathbf{X}^T\mathbf{X}\mathbf{\boldsymbol{\beta}}-\mathbf{X}^T\mathbf{y}
\right)\\
&=\frac{1}{m}\mathbf{X}^T\left(
\mathbf{X}\mathbf{\boldsymbol{\beta}}-\mathbf{y}
\right)\\
&=\frac{1}{m}\mathbf{X}^T\left(
\mathbf{\hat{y}}-\mathbf{y}
\right)
\end{align}
{{</formula>}}

Where $\mathbf{\hat{y}} = \mathbf{X}\mathbf{\boldsymbol{\beta}}$ are the predictions of the linear model.

Now that we have derived the gradient formula 🎉 let's implement gradient descent in python 🐍 to iteratively step towards the optimal coefficients.

**Python implementation**

We will build the implementation in an object oriented fashion defining a class for Linear regression. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/linear_regression.py).

```python

class LinearRegression():

```

Next we define the __init__ method on the class setting the `learning rate`. Remember the gradient tells you in which direction to change the coefficients. The gradient descent algorithm repeatedly updates the coefficients by stepping in the direction of `negative gradient`. The size of the step is governed by the learning rate.

```python

def __init__(self, learning_rate=0.05):
    self.learning_rate = learning_rate
    print('Creating linear model instance')

```

Next let's define a method for the `cost function` as defined above
```python

def cost(self, y, y_pred):
    m = y.shape[0]
    cost = (1 / (2 * m)) * \
        (y - y_pred).T @ (y - y_pred)
    return cost

```
Next let's define a method to calculate the `gradient` of the `cost function`

```python

def gradient(self, y, y_pred, X):
    m = X.shape[0]
    gradient = (1 / m) * \
         X.T @ (y_pred - y)
    return gradient

```
Before we define the `fit` method to implement `gradient descent` let's define one last method which predicts the target variable $y$ given the current coefficients and features $X$
```python

def predict(self, X):
    y_pred = X @ self.beta
    return y_pred

```

And finally here is the `fit` method implementing `n_iter` iterations of gradient descent.

```python

def fit(self, X, y, n_iter=1000):
    m, n = X.shape
    print(f'fitting with m={m} samples with n={n-1} features\n')
    self.beta = np.zeros(shape=(n, 1))
    self.costs = []
    self.betas = [self.beta]
    for iteration in range(n_iter):
        y_pred = self.predict(X)
        cost = self.cost(y, y_pred)
        self.costs.append(cost[0][0])
        gradient = self.gradient(y, y_pred, X)
        self.beta = self.beta - (
            self.learning_rate * gradient)
        self.betas.append(self.beta)

```

And that's it. Here’s an example use of the class:

```python

linear_regression = LinearRegression()
linear_regression.fit(X, y)

linear_regression.predict(X_new)

```

Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.

{{< end_post >}}

[^1]: $\mathbb{N}$ means the natural numbers i.e. $0,1,2,3,\dots$ and $\in$ means "in", so $n\in\mathbb{N}$ is notation for $n$ is in $0,1,2,3,\dots$.
[^2]: $\mathbb{R}$ represents any real value e.g. -2.5, 1367.324, $\pi$, ... there are a lot!  $\mathbb{R}^{n\times m}$ is a matrix with $n$ rows and $m$ columns. So $\boldsymbol{\beta}\in\mathbb{R}^{(n+1)\times1}$ means $\boldsymbol{\beta}$ is a vector of length $n+1$. $\mathbf{y}\in\mathbb{R}^{m\times 1}$ means y is a vector of length $m$. $\mathbf{X}\in\mathbb{R}^{m\times (n+1)}$ means $\mathbf{X}$ is a matrix with $m$ rows and $(n+1)$ columns.