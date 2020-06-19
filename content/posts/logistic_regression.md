---
title: "Logistic Regression"
date: 2020-06-08T18:30:08+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Logistic Regression"
summary: "From zero to logistic regression"
image: "img/logistic_regression.png"
---


What is `logistic regression`? 🤷‍♂️

If you're interested read on, if you're not ... well there's no harm in giving it a go!

This article is the second in a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works
  2. [**The nitty gritty**]({{< relref "#the-nitty-gritty" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

Click [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`. If you have already read that congratulations!

---

## The idea and key concepts

In `regression` (for example `linear regression` - as discussed in the previous article) we predict a continuous output such as house prices where the correct answer can be any number. `Logistic regression` is part of a family of machine learning algorithms called `classification algorithms`. These are used to predict the outcome from a discrete set of `categories`. Logistic regression in particular is used when we are trying to predict a binary outcome, by this we mean a $1$ or a $0$, think success ✅ or failure ❌.

Again it is much easier to explain with an example. Let's say we are trying to predict whether a student is going to pass an exam. As with linear regression we use the input `features` to predict the result. In this case let's say we know the students I.Q. 🧠 and how many hours ⏱ of revision they have done. We use these features to make a prediction.

In linear regression we used a `linear combination` of the features to make a prediction, but this doesn't work when trying to predict a binary outcome. Remember a linear combination is just the sum of the each feature scaled by a coefficient representing how important the feature is.

Logistic regression works instead by predicting a probability of success ✅ but a probability has to be between $0$ and $1$! In order that the prediction is between $0$ and $1$ logistic regression takes the linear combination and `transforms` (think squeezes) it to be between 0 and 1.

Logistic regression takes the combination of the features and coefficients and transforms them to be between $0$ and $1$ so that large values have a high probability and small values have a low probability (in case of predicting whether a student will pass an exam we expect students with a high combined I.Q. and revision time to have a high chance of passing). The exact details of this transformation are quite technical but it uses the `sigmoid function` as plotted below (notice the large $x$ values have high probability and vice versa).

For our example we would likely predict a student has passed if the logistic model says they have more than a $0.5$ probability of passing. This step of converting the probability to an outcome is called a `decision rule`.

**Sigmoid Function**

{{< sigmoid_function >}}

Like linear regression, logistic regression is a `supervised learning algorithm` which means it uses `training data` to find the best coefficients. The Logistic regression algorithm chooses the coefficients to minimise the average error between the predicted results and the true results for the training data:

{{< table "table table-striped" >}}
| I.Q. 🧠 | Hours revision ⏱ | Exam result? | Predicted result |
| ------ | ---------------- | ------------ | ---------------- |
| 85     | 6                | ✅ Pass       | ❌ Fail           |
| 90     | 2                | ❌ Fail       | ❌ Fail           |
| 90     | 8                | ✅ Pass       | ✅ Pass           |
{{</table>}}

It does this by iteratively changing the coefficients to reduce the error. The specifics of this is process is more complex (detailed in the next section).

---

## The nitty gritty

**The model**

If we let $y$ represent the discrete target variable where $y\in0,1$  and $x_1,\dots,x_n$ represent the feature values (where $n \in \mathbb{N}$[^1] and $x_0 = 1$). Then the logistic model can be written as 

{{<formula class="responsive-math">}}
\begin{aligned}
\hat{y} &= \sigma\left(\beta_0x_0+\cdots+\beta_nx_n\right) \\
\hat{y} &= \sigma\left(\sum^{n}_{i=0}\beta_ix_i\right)
\end{aligned}
{{</formula>}}

Where $\sigma$ is the sigmoid function defined as:

{{<formula class="responsive-math">}}
\sigma(x) = \frac{1}{1+e^{-x}}
{{</formula>}}

So the logistic model is:

{{<formula class="responsive-math">}}
\hat{y} = \frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}
{{</formula>}}

A hat above a variable is often used to represent a prediction of the true value. Here the y hat represents the logistic model prediction of the `probability` of success.

**Different formulation**

The `odds` of an event with probability $p$ is defined as the chance of the event happening divided by the chance of the event not happening:

{{<formula class="responsive-math">}}
\frac{p}{1-p}
{{</formula>}}

Taking the above formula for $\hat{y}$ we can re-arrange to show that it is equivalent to modelling the log of the odds as a linear combination of the features. 


The logarithm of the odds is also know as the `logit`. This is why logistic regression is also know as the `logit model`.

{{<formula class="responsive-math">}}
\begin{aligned}
\hat{y} &= \frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}} \\
\hat{y} + \hat{y}e^{-\sum^{n}_{i=0}\beta_ix_i} &= 1\\
\hat{y}e^{-\sum^{n}_{i=0}\beta_ix_i} &= 1 - \hat{y}\\
\frac{\hat{y}}{1 - \hat{y}} &= e^{\sum^{n}_{i=0}\beta_ix_i} \\
\ln\left(\frac{\hat{y}}{1 - \hat{y}}\right) &= \sum^{n}_{i=0}\beta_ix_i
\end{aligned}
{{</formula>}}

**The cost function**

We define below the `cost function` denoted as $J$ (a.k.a. `error` or `loss`) as the `cross entropy` which is also known as the `log loss`. For one sample $\mathbf{x}$ and corresponding $y$:

{{<formula class="responsive-math">}}
\begin{align}
J(\mathbf{x})
&= \begin{cases}
-\log\left(\hat{y}\right) &\text{if y=1}\\
-\log\left(1-\hat{y}\right) &\text{if y=0}\\
\end{cases}
\end{align}
{{</formula>}}

We define the full cost for the $m$ training samples where $m \in \mathbb{N}$ below. We use a superscript to represent each training example so $y^j$ is the $j$th training data target value and $x_i^j$ is the $i$th feature value of the $j$th training example.

{{<formula class="responsive-math-3">}}
\begin{aligned}
J(\mathbf{x})
&= -\frac{1}{m}\sum_{j=1}^my^j\log\left(\hat{y}^j\right)
+(1-y^j)\log\left(1-\hat{y}^j\right)\\
\end{aligned}
{{</formula>}}

{{<formula class="responsive-math-2 responsive-math-unfold">}}
\begin{aligned}
J(\mathbf{x}) &= -\frac{1}{m}\sum_{j=1}^m\left(y^j\log\left(\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i^j}}\right)\right. \\
& + \left.(1-y^j)\log\left(1-\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i^j}}
\right)\right)
\end{aligned}
{{</formula>}}


**Gradient descent**

In order to find the coefficients that lead to the minimal cost we use `gradient descent`. The `gradient` of the cost function tells you in which direction to change your coefficients in order to reduce the value of the cost function the most. The gradient is defined as the `vector of partial derivatives` with respect to each coefficient.

From above we know 
{{<formula class="responsive-math">}}
\hat{y} = \frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}} \\
{{</formula>}}

So differentiating with respect to the coefficient $\beta_k$ we see
{{<formula class="responsive-math-3">}}
\begin{align}
\frac{\partial\hat{y}}{\partial\beta_k} &= -\left(1+e^{-\sum^{n}_{i=0}\beta_ix_i}\right)^{-2}e^{-\sum^{n}_{i=0}\beta_ix_i} (-x_k^j)\\
&=\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}
\frac{e^{-\sum^{n}_{i=0}\beta_ix_i} (x_k^j)}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}\\
&=\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}
\frac{(1-1+e^{-\sum^{n}_{i=0}\beta_ix_i})(x_k^j)}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}\\
&=\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}
\frac{(1+e^{-\sum^{n}_{i=0}\beta_ix_i}-1)(x_k^j)}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}\\
&=\frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}
\left(1 - \frac{1}{1+e^{-\sum^{n}_{i=0}\beta_ix_i}}\right)(x_k^j)\\
&=\hat{y}(1-\hat{y})x_k^j
\end{align}
{{</formula>}}

Now we differentiate the cost function:

{{<formula class="responsive-math-4">}}
\frac{\partial J}{\partial\beta_k}
=
\frac{\partial}{\partial\beta_k}\left(
-\frac{1}{m}\sum_{j=1}^my^j\log\left(\hat{y}^j\right)
+(1-y^j)\log\left(1-\hat{y}^j\right)
\right)
{{</formula>}}

{{<formula class="responsive-math-2">}}
\begin{aligned}
&= 
-\frac{1}{m}\sum_{j=1}^m
\frac{y^j}{\hat{y}^j}\frac{\partial\hat{y}}{\partial\beta_k}
+ \frac{y^j-1}{1-\hat{y}^j}\frac{\partial\hat{y}}{\partial\beta_k}\\
&= 
-\frac{1}{m}\sum_{j=1}^m
\left(
\frac{y^j}{\hat{y}^j} + \frac{y^j-1}{1-\hat{y}^j}
\right)
\frac{\partial\hat{y}}{\partial\beta_k} \\
&= 
-\frac{1}{m}\sum_{j=1}^m
\left(
\frac{y^j}{\hat{y}^j} + \frac{y^j-1}{1-\hat{y}^j}
\right)
(\hat{y}^j(1-\hat{y}^j)x^j_k) \\
&= 
-\frac{1}{m}\sum_{j=1}^m
\left(
  y^j(1-\hat{y}^j)x^j_k + (y^j-1)\hat{y}^jx^j_k
\right) \\
&= -\frac{1}{m}\sum_{j=1}^m (y^j - \hat{y}^j)x^j_k \\
&= \frac{1}{m}\sum_{j=1}^m (\hat{y}^j - y^j)x^j_k \\
\end{aligned}
{{</formula>}}

Now we can write the gradient as:

{{<formula class="responsive-math">}}
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
       \frac{1}{m}\sum_{j=1}^m (\hat{y}^j - y^j)x^j_0 \\
       \vdots \\
       \frac{1}{m}\sum_{j=1}^m (\hat{y}^j - y^j)x^j_n
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

{{<formula class="responsive-math-3">}}
\nabla_{\boldsymbol{\beta}} J
=\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}\hat{y}^jx^j_0\\
       \vdots \\
       \sum^{m}_{j=1}\hat{y}^jx^j_n\\
\end{bmatrix}-
\frac{1}{m}
\begin{bmatrix}
       \sum^{m}_{j=1}y^jx^j_0\\
       \vdots \\
       \sum^{m}_{j=1}y^jx^j_n
\end{bmatrix}\\
{{</formula>}}

From this (I hope you can convince yourself, assuming you know matrix multiplication) we can write
{{<formula class="responsive-math">}}
\begin{align}
\nabla_{\boldsymbol{\beta}} J
&=\frac{1}{m}\left(
\mathbf{X}^T\mathbf{\hat{y}}-\mathbf{X}^T\mathbf{y}
\right)\\
&=\frac{1}{m}\mathbf{X}^T\left(
\mathbf{\hat{y}}-\mathbf{y}
\right)
\end{align}
{{</formula>}}

where
{{<formula class="responsive-math">}}
\mathbf{\hat{y}} = \sigma(\mathbf{X}\mathbf{\boldsymbol{\beta}})
{{</formula>}}

Now that we have derived the gradient formula 🎉 let's implement gradient descent in python 🐍 to iteratively step towards the optimal coefficients.

**Python implementation**

We will build the implementation in an object oriented fashion defining a class for Logistic regression. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/logistic_regression.py).

```python

class LogisticRegression():

```

Next we define the __init__ method on the class setting the `learning rate`. Remember the gradient tells you in which direction to change the coefficients. The gradient descent algorithm repeatedly updates the coefficients by stepping in the direction of `negative gradient`. The size of the step is governed by the learning rate.


```python

def __init__(self, learning_rate=0.05):
    self.learning_rate = learning_rate
    print('Creating logistic model instance')

```

We also define the `sigmoid` function.

```python

def sigmoid(self, x):
    return 1 / (1 + np.exp(-x))

```

Next we define a method `predict_proba` to predict the probability of success given the samples $X$.

```python

def predict_proba(self, X):
    y_pred = self.sigmoid(X @ self.beta)
    return y_pred

```

Similarly we define a `predict` method to predict the outcome target variable $y$ using a the decision rule described above.

```python

def predict(self, X, descision_prob=0.5):
    y_pred = self.predict_proba(X)
    return (y_pred > descision_prob) * 1

```

Next let's define a method `fit` to implement gradient descent. This function calculates the `cost` and `gradient` at each iteration of gradient descent.

```python

def fit(self, X, y, n_iter=1000):
    m, n = X.shape
    print(f'fitting with m={m} samples'
          f' with n={n-1} features\n')
    self.beta = np.zeros(shape=(n, 1))
    self.costs = []
    self.betas = [self.beta]
    for iteration in range(n_iter):
        y_pred = self.predict_proba(X)
        cost = (-1 / m) * (
            (y.T @ np.log(y_pred)) +
            ((np.ones(shape=y.shape) - y).T @ np.log(
                np.ones(shape=y_pred.shape) - y_pred))
        )
        self.costs.append(cost[0][0])
        gradient = (1 / m) * X.T @ (y_pred - y)
        self.beta = self.beta - (
            self.learning_rate * gradient)
        self.betas.append(self.beta)

```

And that's it. Here’s an example use of the class:

```python

logistic_regression = LogisticRegression()
logistic_regression.fit(X, y)

logistic_regression.predict(example_X)

```


Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.


{{< end_post >}}



[^1]: $\mathbb{N}$ means the natural numbers i.e. $0,1,2,3,\dots$ and $\in$ means "in", so $n\in\mathbb{N}$ is notation for $n$ is in $0,1,2,3,\dots$.
[^2]: $\mathbb{R}$ represents any real value e.g. -2.5, 1367.324, $\pi$, ... there are a lot!  $\mathbb{R}^{n\times m}$ is a matrix with $n$ rows and $m$ columns. So $\boldsymbol{\beta}\in\mathbb{R}^{(n+1)\times1}$ means $\boldsymbol{\beta}$ is a vector of length $n+1$. $\mathbf{y}\in\mathbb{R}^{m\times 1}$ means y is a vector of length $m$. $\mathbf{X}\in\mathbb{R}^{m\times (n+1)}$ means $\mathbf{X}$ is a matrix with $m$ rows and $(n+1)$ columns.
