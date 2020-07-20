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
  2. [**The nitty gritty**]({{< relref "#the-nitty-gritty" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

Click
- [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`
- [here]({{< relref "logistic_regression.md" >}}) if you missed `From zero to Logistic Regression`
- [here]({{< relref "decision_trees.md" >}}) if you missed `From zero to Decision Tree`
- [here]({{< relref "random_forests.md" >}}) if you missed `From zero to Random Forest`

Great if you have already read these!

---

## The idea and key concepts

In the last post we talked about `underfitting`, `overfitting`, `bias` and `variance`. We explained how a `random forest` uses the average of the output of multiple trees to reduce the chance of overfitting without introducing bias by oversimplifying (such as using only one tree but restricting the depth).

`Gradient boosting` is a machine learning technique for regression and classification where multiple models are trained `sequentially` with each model trying to learn the mistakes from the previous models. The individual models are known as `weak learners` and in the case of `gradient boosted decision trees` the individual models are decision trees.

In order to give intuition it is easiest to consider first the case of regression. Imagine we are again trying to predict house prices in a desirable area of North London. With training data as below:

{{< table "table table-striped" >}}
| House size 🏠 | Garden size 🌳 | Garage? 🚙 | True House Price 💰 | Predicted house price 💰 |
| ------------ | ------------- | --------- | ------------------ | ----------------------- |
| 1000         | 700           | Garage    | £1m                | £ 1.036m                |
| 770          | 580           | No Garage | £0.75m             | £0.799m                 |
| 660          | 200           | Garage    | £0.72m             | £0.671m                 |
{{</table>}}




---

## The nitty gritty

**The model**

**Python implementation**

As previously we will build the implementation in an object oriented fashion defining a class for the gradient boosted decision tree. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/gradient_boosted_decision_tree.py).

```python

class GradientBoostedDecisionTree():

```

First we define the __init__ method on the class setting the various parameters for each tree as in the previous article. 


Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.


{{< end_post >}}
