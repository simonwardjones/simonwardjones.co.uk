---
title: "Gradient Boosted Decision Trees"
date: 2020-07-20T18:30:01+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Gradient Boosted Decision Trees"
summary: "From zero to gradient boosted decision trees"
image: "img/gradient_boosted_decision_tree.png"
---


What is a `gradient boosted decision tree`? 🤷‍♂️

This article is the fifth in a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works
  2. [**The maths**]({{< relref "#the-maths" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

Click
- [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`
- [here]({{< relref "logistic_regression.md" >}}) if you missed `From zero to Logistic Regression`
- [here]({{< relref "decision_trees.md" >}}) if you missed `From zero to Decision Tree`
- [here]({{< relref "random_forests.md" >}}) if you missed `From zero to Random Forest`

Great if you have already read these!

---

## The idea and key concepts

In the last post we talked about `underfitting`, `overfitting`, `bias` and `variance`. We explained how a `random forest` uses the average output of multiple trees to reduce the chance of overfitting without introducing bias by oversimplifying (such as using only one tree but restricting the depth).

`Gradient boosting` is a machine learning technique for regression and classification where multiple models are trained `sequentially` with each model trying to learn the mistakes from the previous models. The individual models are known as `weak learners` and in the case of `gradient boosted decision trees` the individual models are decision trees.

In order to give intuition it is easiest to consider first the case of regression. Imagine we are again trying to predict house prices in a desirable area of north London. With training data that looks like the following

{{< table "table table-striped" >}}
|     | House size 🏠 | Garden size 🌳 | Garage? 🚙 | True House Price 💰 |
| --- | ------------ | ------------- | --------- | ------------------ |
| 1   | 1000         | 700           | Garage    | £1m                |
| 2   | 770          | 580           | No Garage | £0.75m             |
| 3   | 660          | 200           | Garage    | £0.72m             |
{{</table>}}

**Initial prediction $f_0$**

We can make an initial prediction for each of the house prices based on an initial model, let's call this initial model $f_0$. Often this model is very simple - just using the mean of the target variable in the training data. The following table shows the initial predictions as well as the `errors` $e_1$ (also known as the `residuals`) defined for each sample as $e_1 = y - f_0$ where $y$ is the true value and $f_0$ is our initial prediction

{{< table "table table-striped" >}}
|     | True House Price 💰 | Initial Prediction $f_0$ | Error $e_1$                |
| --- | ------------------ | ------------------------ | -------------------------- |
| 1   | £1m                | £0.82m                   | £(1m - 0.82) = £0.18m      |
| 2   | £0.75m             | £0.82m                   | £(0.75m - 0.82m) = -£0.07m |
| 3   | £0.72m             | £0.82m                   | £(0.72m - 0.82m) = -£0.1m  |
{{</table>}}

**Predicting the error**

Our initial prediction isn't very accurate as it is just the mean house price of the training data! In order to improve this we introduce another model $f_1$ trying to predict the error $e_1$ from the sample feature values. In gradient boosted decision trees this model is itself a decision tree. So now we can predict what the error $e_1$ will be for each sample using $f_1$

{{< table "table table-striped" >}}
|     | True House Price 💰 | Initial Prediction $f_0$ | Error $e_1$                | Predicted Error $f_1$ |
| --- | ------------------ | ------------------------ | -------------------------- | --------------------- |
| 1   | £1m                | £0.82m                   | £(1m - 0.82) = £0.18m      | £0.17m                |
| 2   | £0.75m             | £0.82m                   | £(0.75m - 0.82m) = -£0.07m | £-0.09m               |
| 3   | £0.72m             | £0.82m                   | £(0.72m - 0.82m) = -£0.1m  | £-0.1m                |
{{</table>}}

**Updating our prediction using the error prediction**

For the first house our initial prediction $f_0$ was £0.82m (using the mean) and as we actually know the true value we can see this gave an error $e_1$ of 0.18m. We then trained $f_1$ - a decision tree - to predict the error $e_1$ for each sample. In practise this is only a prediction of the error so it wont be exactly equal, in this toy example our $f_1$ model predicted an error of £0.17m. We could now combine the two models into a new second prediction called $F_1$ by adding the predicted error $f_1$ to the initial prediction $f_0$ as in the table below

{{< table "table table-striped" >}}
|     | True House Price 💰 | Initial Prediction $f_0$ | Predicted Error $f_1$ | Prediction $F_1 =f_0 + f_1$ |
| --- | ------------------ | ------------------------ | --------------------- | ---------------------- |
| 1   | £1m                | £0.82m                   | £0.17m                | £0.99m                 |
| 2   | £0.75m             | £0.82m                   | -£0.09m               | £0.73m                 |
| 3   | £0.72m             | £0.82m                   | -£0.1m                | £0.71m                 |
{{</table>}}

**Additive model**

Now we have a second prediction $F_1$ we can continue in a sequential manner, again calculating the error of our second prediction $e_2$ and training a tree $f_2$ to predict this second error. Then once again we add this second predicted error to the second prediction to get a third prediction $F_2 = F_1 + f_2$ and so on. As the models are summed together this approach is known as an `aditive model`. In general we have 
$$F_m =  F_{m-1} + f_m$$ 
Where the next prediction $F_m$ is made up of the current prediction $F_{m-1}$ and the prediction of the error $f_m \sim e_m =y - F_{m-1}$ at this stage. In general the number of `weak learners` is a `hyper parameter` you have to choose.

**learning rate**

We can think of each individual `weak learner` $f_m$ as stepping our predictions closer to the true target values $y$. To reduce the variance and overfitting rather than stepping the whole predicted error we can instead add only a fraction of the step controlled by the learning rate. So rather than
$$F_m =  F_{m-1} + f_m$$ 
In gradient boosting we use
$$F_m =  F_{m-1} + (\text{learning rate}*f_m)$$
This process requires more steps but reduces the variance and overfitting overall.

**Summary of the algorithm**

1. Make initial model $f_0$ (often the mean of y)
2. Train decision tree model $f_1$ on the error $e_1 = y - f_0$ where y is the true value
3. Calculate new prediction $F_1 = f_0 + \eta * f_1$ where $\eta$ is the learning rate
4. Repeat 2, 3 as many times as chosen where in general
    1. Train model $f_m$ on the error $e_m = y - F_{m-1}$
    2. Calculate new prediction as $F_{m-1} + \eta * f_m$

In short gradient boosting uses an initial prediction and then sequentially updates this prediction by fitting a model to the error at that stage.

In the following section we explore the mathematical details and extend the algorithm to the classification setting. We also cover the intuition behind gradient boosting as gradient descent. 


---

## The maths

**Why is it called gradient boosting?**

In general in `supervised learning` we aim to find a model $F$ to fit the data such that the predicted value $\hat{y}_i$ for the $j$th training example $\mathbf{x}_i$ is approximately equal to the $j$th target value $y_i$ or equivalently


{{<formula class="responsive-math">}}
\hat{y}_i=F(\mathbf{x}_i)\sim y_i \quad\forall j \in {1,\dots,n} 
{{</formula>}}
Where n is the number of training samples.

Equivalently we aim to minimise a loss function $\mathcal{L(y, \hat{y})}$ which tells us how badly the model $\hat{y}$ currently fits the data $y$.

In a `parametric` setting (e.g. logistic regression) the model can be written as 
{{<formula class="responsive-math">}}
\hat{y}_i=F_{\mathbf{\theta}}(\mathbf{x}_i)
{{</formula>}}

Where the subscript $\mathbf{\theta}$ indicates the models dependence on the parameters. We can also write the loss in terms of $\mathbf{\theta}$ as $\mathcal{L(y, \hat{y}(\mathbf{\theta})})$. In this setting we update the model parameters using gradient descent. That is we iteratively update the model parameters by stepping the parameters in the direction of the negative gradient of the loss function with respect to the parameters (where $\eta$ is the learning rate).

{{<formula class="responsive-math">}}
\mathbf{\theta}^{m+1} = \mathbf{\theta}^{m} - \eta* \frac{\partial\mathcal{L}}{\partial{\mathbf{\theta}^m}}
{{</formula>}}


Instead of differentiating the loss with respect to $\mathbf{\theta}$ we can differentiate with respect to the prediction $\hat{y}$ directly. If we think about gradient descent ideally we would update $\hat{y}$ as follows to reduce the cost function

{{<formula class="responsive-math">}}
\hat{y}_i \to \hat{y}_i - \eta\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}
{{</formula>}}

Equivalently we update $F_{m-1}$ by adding another "delta model" $f_{m+1}$

{{<formula class="responsive-math">}}
\hat{y}_i = F_m(\mathbf{x}_i) + f_{m+1}(\mathbf{x}_i) \quad\forall j \in {1,\dots,n} 
{{</formula>}}

Where $\eta$ is the learning rate and
{{<formula class="responsive-math">}}
f_{m+1}(\mathbf{x}_i)= -\eta\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}
{{</formula>}}

In practise we cannot set this delta model exactly so we train a model on the data to fit 
{{<formula class="responsive-math">}}
 - \eta\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}{{</formula>}}
In general this gradient can be fitted with any model but gradient boosted decision trees use a decision tree - hence the name! Note each tree will have it's own Loss $\mathcal{L}^{f_{m+1}}$ separate to the global loss $\mathcal{L}$.

**Key Point**

The gradient boosted decision tree is not trained on the residuals at each step. Rather it is trained on the negative gradient of the loss function evaluated using the prediction of the current step - which happens to be the residual for some common cost functions.

### Regression
In the case of regression we define the loss function as the mean square error

$$
\mathcal{L}(\hat{y}) = \frac{1}{2n}\sum_{i=1}^{n}(y_i-\hat{y}_i)^2
$$
hence
$$
-\eta\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}} = \frac{\eta}{n}(y_i-\hat{y}_i)
$$

How the process looks:

We fit $f_0(x)\sim y$ then $F_0(x) = f_0(x)$  
We fit $f_1(x)\sim (y-F_0(x))$ then $F_1(x) = F_0(x) + \eta f_1(x)$  
We fit $f_2(x)\sim (y-F_1(x))$ then $F_2(x) = F_1(x) + \eta f_2(x)$  
We fit $f_3(x)\sim (y-F_2(x))$ then $F_3(x) = F_2(x) + \eta f_3(x)$  
...  
We fit $f_m(x)\sim (y-F_{m-1}(x))$ then $F_m(x) = F_{m-1}(x) + \eta f_m(x)$

Then predictions $\hat{y} = F_m(x)$

#### Binomial Classification

Suppose our iterative model was $\hat{y}_i = F_m(x_i)$ where the $\hat{y}_i$ directly represented the probability $x_i$ is in class 1. i.e. $P(x_i \in C_1)$ where $C_1$ represents class 1.  

Then the delta model doesn't make sense as we would be directly adding to a probability value. As in logistic regression it is often the case to fit the model to a transformation of probability.

We define a model 
$$
\hat{y}\sim F(x)
$$
where 
$$
\hat{p} = \frac{1}{1+e^{-\hat{y}}} 
$$
so 
$$
\hat{y} = \log\left(\frac{\hat{p}}{1-\hat{p}}\right)
$$

where $\hat{p}$ represents the probability of being in class 1, $\hat{y}$ is sometimes known as the logit.

Note $\hat{p}\in[0,1],\quad \hat{y}\in(-\infty,\infty),\quad y\in\{0,1\}$

With this set up the model F is additive. Hence in the classification setting the gradient boosted decision tree predicts $\hat{y}$ as a sum of multiple delta models. The probability values are then calculated by transforming $\hat{y}$ using the sigmoid function (a.k.a the expit function).

We will use the following fact later on

{{<formula class="responsive-math">}}
\begin{align}
\hat{p} &= \frac{1}{1+e^{-\hat{y}}} \quad so \\
\hat{p} &= \frac{e^{\hat{y}}}{e^{\hat{y}}+1} \quad so \\
1 - \hat{p} &= \frac{e^{\hat{y}}+1 -e^{\hat{y}}}{e^{\hat{y}}+1} \quad so \\
\log\left(1 - \hat{p}\right) &= -\log\left(e^{\hat{y}}+1\right)
\end{align}
{{</formula>}}

In the case of classification we define the loss function as cross entropy

{{<formula class="responsive-math">}}
\begin{align}
\mathcal{L}(\hat{y}) &= \frac{1}{n}\sum_{i=1}^{n}\left(
    -y_i\log(\hat{p}_i)-(1-y_i)\log(1-\hat{p}_i)
\right)\\
&= \frac{1}{n}\sum_{i=1}^{n}\left(
    -y_i\log(\hat{p}_i)+y_i\log(1-\hat{p}_i)-\log(1-\hat{p}_i)
\right)\\
&= \frac{1}{n}\sum_{i=1}^{n}\left(
    -y_i\log(\frac{\hat{p}_i}{1-\hat{p}_i})-\log(1-\hat{p}_i)
\right)\\
&= \frac{1}{n}\sum_{i=1}^{n}\left(
    -y_i\hat{y}_i+\log\left(e^{\hat{y}}+1\right)
\right)
\end{align}
{{</formula>}}

In order to choose $f_{m+1}$ we fit to $-\eta\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}$


{{<formula class="responsive-math">}}
\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}
= \frac{1}{n}\left(-y_i + \frac{e^{\hat{y}}}{e^{\hat{y}}+1} \right)
= \frac{1}{n}\left(\hat{p}_i - y_i \right)
{{</formula>}}

hence 

{{<formula class="responsive-math">}}
-\frac{\partial\mathcal{L}}{\partial{\hat{y}_i}}
= \frac{1}{n}\left(y_i - \hat{p}_i \right)
= \frac{1}{n}\left(y_i - \sigma(\hat{y}_i) \right)
{{</formula>}}

where $\sigma$ is the sigmoid function. Note this is the residual again!

How the process looks again:

we define initial values
$f_0(x) = \log\left(\frac{\sum{y_i\in C_1}}{\sum{y_i\notin C_1}}\right)$ then set $F_0(x) = f_0(x)$  
We fit $f_1(x)\sim (y-\sigma(F_0(x)))$ then $F_1(x) = F_0(x) + \eta f_1(x)$  
We fit $f_2(x)\sim (y-\sigma(F_1(x)))$ then $F_2(x) = F_1(x) + \eta f_2(x)$  
We fit $f_3(x)\sim (y-\sigma(F_2(x)))$ then $F_3(x) = F_2(x) + \eta f_3(x)$  
$\quad\quad\vdots$  
We fit $f_m(x)\sim (y-\sigma(F_{m-1}(x)))$ then $F_m(x) = F_{m-1}(x) + \eta f_m(x)$

Then predictions $\hat{p} = \sigma(F_m(x)$)

#### Multi class classification

In multi class classification where K is equal to the number of classes we have to define the model set up a little differently. We model the log of each class probability as as an additive model.
{{<formula class="responsive-math">}}
\begin{align}
\log(\hat{p}^1_i) &\sim F_1(x) = \hat{y}_i^1\\
\log(\hat{p}^2_i) &\sim F_2(x) = \hat{y}_i^2\\
&\vdots\\
\log(\hat{p}^K_i) &\sim F_K(x) = \hat{y}_i^K
\end{align}
{{</formula>}}


and we define  
{{<formula class="responsive-math">}}
\hat{p}^k_i = \frac{e^{F^k(x_i)}}{\sum_{j=1}^{K}e^{F^j(x_i)}}
{{</formula>}}

Once again we use Cross entropy but for multi class setting

$$
\mathcal{L}(F^1,\dots,F^K) 
= -\frac{1}{n}\sum_{i=1}^{n}\sum_{k=1}^{K}\mathbb{1}(y_i\in C^k)\log(\hat{p}_i^k)
$$

Let $y^k$ be the indicator variable for class k, then

{{<formula class="responsive-math">}}
\begin{align}
\mathcal{L}(F^1,\dots,F^K) 
&= -\frac{1}{n}\sum_{i=1}^{n}\sum_{k=1}^{K}y^k_i\log\left(
\frac{e^{F^k(x_i)}}{\sum_{i=j}^{K}e^{F_j(x_i)}}\right)\\
&= -\frac{1}{n}\sum_{i=1}^{n}\sum_{k=1}^{K}y^k_i\log\left(
\frac{e^{\hat{y}_i^k}}{\sum_{j=1}^{K}e^{\hat{y}^j_i}}\right)\\
&= -\frac{1}{n}\sum_{i=1}^{n}\sum_{k=1}^{K}\left(
y^k_i\log\left(e^{\hat{y}^k_i}\right)
- y^k_i \log\left(\sum_{j=1}^{K}e^{\hat{y}^j_i}\right)
\right)\\
&= \frac{1}{n}\sum_{i=1}^{n}\left(
\log\left(\sum_{j=1}^{K}e^{\hat{y}^j_i}\right)
 - \sum_{k=1}^{K}y^k_i\hat{y}^k_i
\right)
\end{align}
{{</formula>}}


Hence we see the negative gradient is again the 
{{<formula class="responsive-math">}}
\begin{align}
-\frac{\partial\mathcal{L}}{\partial{\hat{y}^k_i}}
&= \frac{1}{n}\left(y^k_i - \frac{e^{\hat{y}^k_i}}{\sum_{j=1}^{K}e^{\hat{y}^j_i}}
\right)\\
&= \frac{1}{n}\left(y^k_i - \hat{p}^k_i
\right)
\end{align}
{{</formula>}}

Note this is the residual again! Hence the process looks like the following:

We initialise $f_0$ as 
{{<formula class="responsive-math">}}
f_0(x)^k = \log\left(\frac{\sum{y_i\in C_k}}{\sum{y_i\notin C_k}}\right)
{{</formula>}}

Then sequentially fit $f_1^k,f_2^k,f_3^k,\dots, f_m^k$ against the residuals for each class $k$ to calculate additive models $F_1^k,F_2^k,F_3^k,\dots, F_m^k$
such that $\forall k\in\{1,\dots, K\}$
{{<formula class="responsive-math">}}
\begin{align}
f_1^k(x)&\sim (y^k-\sigma_k(F_0^1,\dots,F_0^K))\\
F_1^k(x)&= F_0^k(x) + \eta f_1^k(x) \\
f_2^k(x)&\sim (y^k-\sigma_k(F_1^1,\dots,F_1^K))\\
F_2^k(x)&= F_1^k(x) + \eta f_2^k(x) \\
\quad&\vdots\\
f_m^k(x)&\sim (y^k-\sigma_k(F_{m-1}^1,\dots,F_{m-1}^K))\\
F_m^k(x)&= F_{m-1}^k(x) + \eta f_m^k(x)\\
\end{align}
{{</formula>}} 

Then the probability predictions $\hat{p}^k$ for class $k$ is defined as 
{{<formula class="responsive-math">}}
\hat{p}^k = \sigma_k(F_{m}^1,\dots,F_{m}^K)
{{</formula>}} 

Where $\sigma$ is the softmax function.


**Python implementation**

We will build the implementation in an object oriented fashion defining a class for the gradient boosted decision tree. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/gradient_boosted_decision_tree.py).

```python

class GradientBoostedDecisionTree():

```

First we define the __init__ method on the class setting the various parameters for each tree as in the previous article. 



**Further reading**

Honestly these three are excellent resources:
 - [Understanding Gradient Boosting as gradient descent - Nicolus Hug](http://nicolas-hug.com/blog/gradient_boosting_descent)
 - [Understanding Gradient Boosting Tree for Binary Classification - Zepu Zhang](http://zpz.github.io/blog/gradient-boosting-tree-for-binary-classification/)
 - [How to explain gradient boosting - Terence Parr and Jeremy Howard](https://explained.ai/gradient-boosting/index.html)

Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.

{{< end_post >}}