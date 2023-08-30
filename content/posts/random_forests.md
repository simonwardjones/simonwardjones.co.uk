---
title: "Random forests"
date: 2020-07-12T17:22:08+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Random forests"
summary: "From zero to random forest"
image: "img/random_forest.png"
categories:
  - Machine Learning
  - Decision trees
---


This article is the fourth in a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - how the algorithm works.
  2. [**The maths**]({{< relref "#the-maths" >}})
    - derivations followed by an implementation in Python.

Click
- [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`
- [here]({{< relref "logistic_regression.md" >}}) if you missed `From zero to Logistic Regression`
- [here]({{< relref "decision_trees.md" >}}) if you missed `From zero to Decision Tree`

---

## The idea and key concepts


In the last post we saw how a decision tree can classify data using a series of questions in order to group similar data together. We saw how a prediction is made using the most common label of the training data in the same leaf of the tree as the sample we are predicting. We introduced the idea of `impurity` and how this is used to find the optimum questions to include in the decision tree.

We looked specifically at predicting whether a student will pass an exam based on their I.Q. and how much revision they did as in the tree below.

{{< decision_example >}}


**Bias and Variance**

A single decision tree provides great flexibility and can learn complex relationships between features and the target variable. However with this flexibility comes the issue of potentially overfitting the training data.

Overfitting occurs when the tree (or more generally when any model) is too finely tuned to the specific training data that was used. Overfitting is characterised by great to almost perfect performance on the training data but poor performance on new "unseen" data. Flexible models such as decision trees suffering from overfitting are said to have high `variance`. This is because the questions or parameters that define the model often vary significantly when changing the training data.

With more inflexible models (such as linear regression) with more assumptions on the relationships between features and the target variable we often have another problem - high `bias`. Bias (or `underfitting`) occurs when the model is too simple to capture the true relationships between the features and the target variable.

Often in machine learning we need to balance the flexibility of the model so that we do not overfit and vice versa so that we do not underfit. This is often referred to as bias-variance trade-off. There are various approaches that have been developed to address this issue.

When considering decision trees a simple way to reduce the flexibility of the model is to reduce the max depth of the tree. This simple step can often reduce the overfitting issue but if the depth is reduced too far the model can end up too simple with high bias!


**How a random forest reduces variance and overfitting**

In order to reduce the variance without introducing bias we could use multiple trees and average the prediction of the collection of trees.

{{< image src="/img/random_forest.png" >}}

A random forest does this but has two further extensions:

  1. **Randomise the training data**
  2. **Randomise the features used when splitting**


**Randomise the training data**

Each tree is built (or "grown") using a random `bootstrap` sample of the data. A bootstrap sample is made by repeatedly randomly selecting a training example from all the possible training data examples and adding it to the sample. A bootstrap sample is said to be `drawn with replacement` - as each specific training datum can be included multiple times. Normally the size of the sample matches the original number of training examples - however not all training data will be in each sample due to duplicates. This idea of training multiple decision trees on bootstrap samples is known as `bagging`.


**Randomise the features used when splitting**

When building a decision tree at each split the feature and splitting value are chosen to decrease the impurity the most. In a decision tree the feature is chosen from all the available features.In a random forest only a random subset of features are considered - hence the name `random` forest. Typically the number of features considered is equal to the square root of the total number of features.

{{<formula class="responsive-math-2">}}
\text{# Features Used} = \sqrt{\text{# Total Features}}
{{</formula>}}


**Random forest summary**

So in summary a random forest builds a collection of decision trees where each tree is trained on a bootstrap sample and when building only a random subset of features are considered at each split. Both of these steps help to reduce the variance of the model without oversimplifying causing high bias.

To make a prediction using a random forest you predict the probability of success from each tree and then average the result.

The number of trees to include in the forest is a parameter you choose when building the model.


---

## The maths


**Python implementation**

As previously we will build the implementation in an object oriented fashion defining a class for the random forest. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/random_forest.py).

```python
class RandomForest():
```

First we define the \_\_init\_\_ method on the class setting the various parameters for each tree as in the previous article.


However we also define the number of trees in the forest as `n_trees`. The parameter `bootstrap` defines whether to use a bootstrap sample, True by default. The `max_features` parameter governs how many random features are considered when splitting a node, by default this the square root of the total number of features as explained above.


```python
def __init__(self,
             max_depth=2,
             min_samples_split=2,
             min_samples_leaf=1,
             n_classes=2,
             max_features='sqrt',
             impurity='gini',
             is_classifier=True,
             n_trees=10,
             bootstrap=True):
    self.max_depth = max_depth
    self.min_samples_split = min_samples_split
    self.min_samples_leaf = min_samples_leaf
    self.n_classes = n_classes
    self.max_features = max_features
    self.impurity = impurity
    self.is_classifier = is_classifier

    self.n_trees = n_trees
    self.bootstrap = bootstrap
    self.is_fitted = False
    self.trees = []
    np.random.seed(1)
```

The fit method below builds `n_trees` decision trees storing them in the `trees` attribute. Most of the hard work is actually done by the `DecisionTree` class from the previous article.

```python
def fit(self, X, y):
    y_shape = (X.shape[0], 1)
    data = np.concatenate((X, y.reshape(y_shape)), axis=1)
    for i, data in enumerate(self._samples(data)):
        tree = DecisionTree(
            max_depth=self.max_depth,
            min_samples_split=self.min_samples_split,
            min_samples_leaf=self.min_samples_leaf,
            n_classes=self.n_classes,
            max_features=self.max_features,
            impurity=self.impurity,
            is_classifier=self.is_classifier)
        logger.info(f'Fitting tree {i}')
        tree.fit(X, y)
        self.trees.append(tree)
    self.is_fitted = True
```

Next we will look at the `_samples` method that is used to create the bootstrap samples.

```python
def _samples(self, data):
    n_rows = data.shape[0]
    for _ in range(self.n_trees):
        if not self.bootstrap:
            yield data
        else:
            random_rows = np.random.choice(
                np.arange(n_rows),
                size=n_rows,
                replace=True)
            yield data[random_rows, :]
```

Finally we will look at the `predict_proba` method used to predict the class probabilities of a new sample by averaging the probabilities from each tree.

```python
def predict_proba(self, data):
    if self.is_classifier:
        return np.argmax(self.predict_proba(data), axis=-1)
    else:
        return np.stack(
            list(tree.predict(data) for tree in self.trees),
            axis=-1).mean(axis=-1)
```

Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.


{{< end_post >}}
