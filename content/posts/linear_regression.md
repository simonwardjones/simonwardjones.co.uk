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
summary: "From zero to Linear Regression"
---

What is linear regression 🤷‍♂️?

If your interested read on, if you're not, see you self out. 🚪

This article is the first of a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works 🤞
  2. [**The nitty gritty**]({{< relref "#the-nitty-gritty" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python 🐍

---

## The idea and key concepts


Regression is any algorithm that takes a collection of inputs and predicts a continuous output. I'll forgive you if you still don't follow.

Let's give an example and this should make much more sense. Let's say we are trying to predict how much a house 🏡 will sell for? We may know a few facts about the house e.g. the square footage of the house 🏠, the square footage of the garden 🌾 and whether there is a garage 🚙.

In machine learning we call these facts variables or features. Intuitively we may value the house using a combination of these features. 🏠🌾🚙

Linear regression uses a linear combination of the features to predict the output. This just means summing up each feature value multiplied by a number (called a coefficient) to represent how important that feature is e.g

{{<formula class="responsive-math-unfold">}}
\begin{aligned}
\text{House Price} &= (£600 * \text{🏠}) \\
& + (£50 * \text{🌾}) \\
& + (£1000 * \text{🚙?})
\end{aligned}
{{</formula>}}

In this example the House price is calculated as £$600$ for each square foot of the house plus $£50$ for each foot in the garden plus $£1000$ if there is a garage. If we took a nice $1000$ square foot property with a small $500$ square foot garden and no garage our linear regression model would predict the house is worth $£625,000$.

{{<formula class="responsive-math-4">}}
\begin{aligned}
\text{House Price} &= (£600 * \text{🏠}) + (£50 * \text{🌾}) + (£1000 * \text{🚙 x  ?}) \\
&= (£600 * 1000) + (£50 * 500) + (£1000 * 0)\\
&= £625,000
\end{aligned}
{{</formula>}}

Now that's how the linear regression model works! The question now is how do you choose the coefficients for the features, in our example the $600$ the $50$ and the $1000$? 🤷‍♂️

As with many machine learning models (so called supervised learning algorithms) we find these parameters by looking at training data. Training data is just examples where you already know the answer. In our case it is a list of houses where we know the house prices in advance. Here is an example of three training examples:

{{< table "table table-striped" >}}
| House size 🏠 | Garden size 🌾 | Garage? 🚙 | House Price 💰 |
| ------------ | ------------- | --------- | ------------- |
| 1000         | 700           | Garage    | £700,000      |
| 770          | 580           | No Garage | £650,000      |
| 660          | 200           | Garage    | £580,000      |
{{</table>}}

The linear regression algorithm chooses the coefficients to minimise the average error when predicting the house price for all the training examples.

And that's linear regression!

---

## The nitty gritty

**The model**

If we let $y$ represent a single continuous target variable and $x_1,\dots,x_n$ (where $n \in \mathbb{N}$) represent the feature values. Then the linear model can be written as 


{{<formula class="responsive-math">}}
\begin{align}
\hat{y}&=\beta_0x_0+\cdots+\beta_nx_n \\
\hat{y}&=\sum^{n}_{i=0}\beta_ix_i \\
\hat{y}&=\mathbf{\boldsymbol{\beta}^Tx}
\end{align}
{{</formula>}}
Where $\boldsymbol{\beta},\mathbf{x}\in\mathbb{R}^{n\times1}$

**The cost function**

We define below the cost (a.k.a. error or loss) function $J$ as half of the mean square error for the $m$ training samples where $m \in \mathbb{N}$. We use a superscript to represent each training example so $y^j$ is the $j$th training data target value and $x_i^j$ is the $i$th feature value of the $j$th training example.

{{<formula class="responsive-math">}}
\begin{align}
J(\boldsymbol{\beta})
&= \frac{1}{2m}\sum^{m}_{j=1}\left(
y^j-\hat{y}^j
\right)^2\\
&= \frac{1}{2m}\sum^{m}_{j=1}\left(
y^j-g(\boldsymbol{\beta}^T\mathbf{x}^j)
\right)^2
\end{align}
{{</formula>}}

**Gradient descent**

In order to find the coefficients that lead to the minimal cost we use gradient descent. The gradient of the cost function tells you in which direction to change your coefficients in order to reduce the value of the cost function the most. The gradient is defined as the vector of partial derivatives with respect to each coefficient so let's first calculate these:

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
    \frac{\partial J}{\partial\beta_1} \\
    \vdots \\
    \frac{\partial J}{\partial\beta_n}
\end{bmatrix} \\
&=
\begin{bmatrix}
       -\frac{1}{m}\sum^{m}_{j=1}
           \left(y^j-\sum^{n}_{i=0}\beta_ix_i^j\right)x^j_1\\
       \vdots \\
       -\frac{1}{m}\sum^{m}_{j=1}
           \left(y^j-\sum^{n}_{i=0}\beta_ix_i^j\right)x^j_n\\
\end{bmatrix}
\end{aligned}
{{</formula>}}

We could calculate the above gradient using the sums defined but it is more efficient for implementing if we `vectorise` the calculation.

For this we define the design matrix $\mathbf{X}$ by stacking the $m$ training examples on top of each other, and $\mathbf{y}$ the vector of target values by stacking the $m$ target variables on top of each other. This means:
{{<formula class="responsive-math">}}
\mathbf{X}\in\mathbb{R}^{m\times n},
\quad \mathbf{y}\in\mathbb{R}^{m\times 1}
{{</formula>}}

Or more visually

{{<formula class="responsive-math-1">}}
\mathbf{X}=\begin{bmatrix}
    \dots & (\mathbf{x}^1)^T & \dots\\
    \dots & (\mathbf{x}^2)^T & \dots\\
    \dots & \vdots  & \dots\\
    \dots & (\mathbf{x}^m)^T & \dots
\end{bmatrix}\quad
\mathbf{y}=\begin{bmatrix}
    y_1\\y_2\\\vdots\\y_m
\end{bmatrix}
{{</formula>}}

Now if we take the above gradient we derived above and re-write it splitting the terms we see

{{<formula class="responsive-math-4">}}
\nabla_{\boldsymbol{\beta}} J
=-\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}y^jx^j_1\\
       \vdots \\
       \sum^{m}_{j=1}y^jx^j_n\\
\end{bmatrix}+
\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}\sum^{n}_{i=0}\beta_ix_i^jx^j_1\\
       \vdots \\
       \sum^{m}_{j=1}\sum^{n}_{i=0}\beta_ix_i^jx^j_n
\end{bmatrix}\\
{{</formula>}}

From this (I hope you can convince yourself) we can write
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

We will build the implementation in an objected oriented fashion defining a class for Linear regression. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/linear_regression.py).

```python

class LinearRegression():

```

Next we define the __init__ method on the class setting the learning rate. Remember the gradient tells you in which direction to change the coefficients. The gradient descent algorithm repeatedly updates the coefficients by stepping in the direction of negative gradient. The size of the step is governed by the learning rate.

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

And that's it. Here's and example use of the class

```python

linear_regression = LinearRegression()
linear_regression.fit(X, y)

linear_regression.predict(X_new)

```

Thanks for reading! 👏 Please let me know any question, mistakes or improvements