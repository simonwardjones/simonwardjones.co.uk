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
---


What is a `random forest`? 🤷‍♂️

This article is the fourth in a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works
  2. [**The nitty gritty**]({{< relref "#the-nitty-gritty" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

Click
- [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`.
- [here]({{< relref "logistic_regression.md" >}}) if you missed `From zero to Logistic Regression`.
- [here]({{< relref "decision_trees.md" >}}) if you missed `From zero to Decision Tree`.

Great if you have already read these!

---

## The idea and key concepts

Check this material out: https://towardsdatascience.com/an-implementation-and-explanation-of-the-random-forest-in-python-77bf308a9b76

In the last post we saw how a decision tree can classify data using a series of questions in order to group "similar" data together, where the prediction is made using the most common label of the training data in the same leaf of the tree. We introduced the idea of `impurity` and how this is used to find the optimum questions to include in the decision tree.

We looked specifically at predicting whether a student will pass an exam based on their I.Q. and how much revision they did as in the tree below.

{{< decision_example >}}


**Bias and Variance**

A single decision tree provides great flexibility and can learn complex relationships between features and the target variable. However with this flexibility comes the issue of potentially overfitting the training data.

Overfitting occurs when the tree (or more generally when any model) is too finely tuned to the specific training data that was used. Overfitting is characterised by great to almost perfect performance on the training data but poor performance on new "unseen" data. Flexible models such as decision trees often have high `variance`, this is because the questions or parameters that define the tree often vary significantly on changing the training data.

With more inflexible models (such as linear regression) with more assumptions on the relationships between features and the target variable we often have another problem - high `bias`. Bias (or `underfitting`) occurs when the model is too simple to capture the true relationships between the features and the target variable.

Often in machine learning we need to balance the flexibility of the model so that we do not overfit and vice versa that we do not underfit. This is often referred to as bias-variance trade-off. There are various approaches that have been developed to address this issue.

When considering decision trees a simple way to reduce the flexibility of the model is to reduce the max depth of the tree. This simple step can often reduce the overfitting issue but if the depth is reduced too far the model can end up to simple with high bias!


**How a random forest reduces variance and overfitting**

In order to reduce the variance without introducing bias we could use multiple trees and average the prediction of the collection of trees.

{{< image src="/img/random_forest.png" >}}

A random forest trains multiple decision trees to reduce the variance but has two further extensions

  1. **Randomise the training data**
  2. **Randomise the features used when splitting**


**Randomise the training data**

Each tree is built (or "grown") using a random `bootstrap` sample of the data. A bootstrap sample is made by repeatedly randomly selecting a training example from all the possible training data examples and adding it to the sample. A bootstrap sample is said to be `drawn with replacement` - as each specific training datum can be included multiple times. Normally the size of the sample matches the original number of training examples - however not all training data will be in each sample due to duplicates. This idea of training multiple decision trees on bootstrap samples is known as `bagging`.


**Randomise the features used when splitting**

Normally when building a decision tree at each split the feature and splitting value are chosen to decrease the impurity the most. In a decision tree the feature is chosen from all the available features.In a random forest only a random subset of features are considered - hence the name `random` forest. Typically the number of features considered is equal to the square root of the total number of features

$$\text{# Features Used} = \sqrt{\text{# Total Features}}$$


**Random forest in practice**

 - train multiple trees
 - make a prediction as the average of the individual trees

And that's it!

---

## The nitty gritty

**The model**

Let the data at node $m$ be represented by $Q$. For a split $\theta = (j,t_m)$ consisting of feature with index $j$ and threshold value $t_m$ the impurity $G$ of the split is given by

{{<formula class="responsive-math-3">}}
G(Q,\theta) = 
    \frac{n_{left}}{N_m}G(Q_{left}(\theta)) + 
    \frac{n_{right}}{N_m}G(Q_{right}(\theta))
{{</formula>}}

Where the data $(x_i,y_i)$ is in $Q_{left}$ if $x_{i,j} <= t_m$ else $(x_i,y_i)$ is in $Q_{right}$. We define $n_{left}$ and $n_{right}$ as the number of training samples in $Q_{left}$ and $Q_{right}$ respectively.

**Classification**

If there are a set of classes $C$, often $C=\{0,1\}$, then for a given data set $Q$ the gini impurity is defined as 

{{<formula class="responsive-math">}}
G(Q) = \sum_{c\in{C}} p_c(1-p_c)
{{</formula>}}

where $p_c$ is the probability of class $c$ in $Q$

{{<formula class="responsive-math">}}
p_c = \frac{1}{N_Q}\sum_{x\in{Q}}\mathbb{1}(y_{class} = c)
{{</formula>}}

where $N_Q = |Q|$


**Regression**

In regression, with a continuous target variable $y$, the mean square error is often used as the impurity.

{{<formula class="responsive-math">}}
G(Q) = \frac{1}{N_Q}\sum_{y_i\in Q}(y_i - \bar{y})^{2}
{{</formula>}}

where $\bar{y}$ is the mean value of $y$ in the node $Q$

{{<formula class="responsive-math">}}
\bar{y} = \frac{1}{N_Q}\sum_{y_i\in Q}y_i
{{</formula>}}

🎉 Now let's implement a decision tree in python 🐍 

---

**Python implementation**

We will build the implementation in an object oriented fashion defining a class for a decision tree. For the full code (with doc strings) it's on github [here](https://github.com/simonwardjones/machine_learning/blob/master/machine_learning/decision_tree.py).

```python

class DecisionTree():

```

First we define the __init__ method on the class setting the various parameters for the tree. The `max depth` governs how deep the tree can be. The `min_samples_split` defines a minimum number of samples for a node to be considered for a split. The `min_samples_leaf` defines the minimum number of samples allowed in a leaf. A split candidate leading to less samples in a node than the `min_samples_leaf` will be rejected. The `max_features` parameter governs how many features are considered when splitting a node, by default this is all the features. The `impurity` is the setting for which impurity function to use - I have only implemented `'gini'` and `'mse'` (mean square error) for now. Finally the `is_classifier` flag is used to denote whether the decision tree is to be used for regression or classification.

```python

def __init__(self,
                max_depth=2,
                min_samples_split=2,
                min_samples_leaf=1,
                n_classes=2,
                max_features=None,
                impurity='gini',
                is_classifier=True):
    self.max_depth = max_depth
    self.min_samples_split = min_samples_split
    self.min_samples_leaf = min_samples_leaf
    self.n_classes = n_classes
    self.max_features = max_features
    self.impurity = impurity
    self.is_classifier = is_classifier

    self.is_fitted = False
    self.tree = None

```

The fit method below builds the tree. Most of the hard work is actually done by another class called `TreeNode`. The TreeNode instances represent one node of the decision tree. We will look more at this class below.

```python

def fit(self, X, y):
    y_shape = (X.shape[0], 1)
    data = np.concatenate((X, y.reshape(y_shape)), axis=1)
    self.tree = TreeNode(
        data=data,
        max_depth=self.max_depth,
        min_samples_split=self.min_samples_split,
        min_samples_leaf=self.min_samples_leaf,
        n_classes=self.n_classes,
        max_features=self.max_features,
        impurity=self.impurity,
        is_classifier=self.is_classifier)
    self.tree.recursive_split()
    self.is_fitted = True

```

The key method to look into is the `recursive_split` method on the `TreeNode`. This method recursively "grows" the tree by splitting the data to reduce impurity the most. The function finds the best split using the `find_best_split` method. If there is a split found, two children nodes are created - left and right. Finally the `recursive_split` method is called on each of the new children nodes to continue "growing" the tree.

Note the depth of the children nodes are incremented, otherwise the tree settings such as `min_samples_split` are passed to the children nodes.

```python

def recursive_split(self):
    self.find_best_split()
    if self.best_feature_index is not None:
        logger.info(f'Splitting tree on feature_index '
                    f'{self.best_feature_index} and feature_split_val '
                    f'{self.best_feature_split_val:.2f}')
        left, right = self.split(
            feature_index=self.best_feature_index,
            feature_split_val=self.best_feature_split_val,
            only_y=False)
        del self.data
        self.left = TreeNode(
            data=left,
            max_depth=self.max_depth,
            min_samples_split=self.min_samples_split,
            min_samples_leaf=self.min_samples_leaf,
            n_classes=self.n_classes,
            max_features=self.max_features,
            depth=self.depth + 1,
            impurity=self.impurity,
            is_classifier=self.is_classifier)
        self.right = TreeNode(
            data=right,
            max_depth=self.max_depth,
            min_samples_split=self.min_samples_split,
            min_samples_leaf=self.min_samples_leaf,
            n_classes=self.n_classes,
            max_features=self.max_features,
            depth=self.depth + 1,
            impurity=self.impurity,
            is_classifier=self.is_classifier)
        self.left.recursive_split()
        self.right.recursive_split()
    else:
        logger.info('Reached max depth or no splits reduce impurity')
        self.is_leaf = True

```

The `find_best_split` method loops through each feature and each unique value of that feature checking for the best candidate split (i.e. the split that reduces the impurity the most).

The method first checks if we have reached the max depth or if the number of samples is less than `min_samples_split`. In either case no further split is allowed and the function returns.

```python

def find_best_split(self):
    if self.depth == self.max_depth:
        return
    if self.data.shape[0] < self.min_samples_split:
        logger.info(f"{self} can't split as samples < min_samples_split")
        return None
    if self.node_impurity == 0:
        logger.info(f"Can't improve as node pure")
        return None
    n_features = self.data.shape[1] - 1
    all_feature_indices = np.arange(n_features)
    if self.max_features == 'sqrt':
        features_to_check = np.random.choice(
            all_feature_indices,
            size=np.sqrt(n_features).astype(int))
    else:
        features_to_check = all_feature_indices
    logger.info(f'Checking features {features_to_check}')
    for feature_index in features_to_check:
        for feature_split_val in np.unique(self.data[:, feature_index]):
            self.check_split(feature_index, feature_split_val)
    self.split_attempted = True

```

The `check_split` method updates the current best split if the candidate split is better. The method first splits the data into groups using `self.split` and then checks the `min_samples_leaf` condition after splitting. It calculates the impurity of the split and then if this is less than best split already found and less than the current node impurity the `best_feature_index`, the `best_feature_split_val` and the `best_split_impurity` values are updated.

```python

def check_split(self, feature_index, feature_split_val):
        groups = self.split(feature_index, feature_split_val)
    if any(len(group) < self.min_samples_leaf for group in groups):
        logger.debug(
            f"Can't split node on feature {feature_index} with split "
            f"val {feature_split_val} due to min_samples_leaf condition")
        return None
    split_impurity = self.calculate_impurity(groups)
    best_current_impurity = (
        10**10 if self.best_split_impurity is None
        else self.best_split_impurity)
    if ((split_impurity < best_current_impurity) and
            (split_impurity < self.node_impurity)):
        logger.debug(
            f'Found new best split with feature_split_val='
            f'{feature_split_val} for feature_index = {feature_index} '
            f'and split_impurity = {split_impurity:.2f}')
        self.best_feature_index = feature_index
        self.best_feature_split_val = feature_split_val
        self.best_split_impurity = split_impurity

```

Finally, now that we have a fitted tree, let's look at the method `predict_row_proba` on the `TreeNode` class used to predict the class probabilities of one new sample. The method iteratively walks the tree until a leaf is reached. At this point the probability of each class is simply the proportion of training data in each class in that leaf (the class counts are stored in the `self.value` property of the leaf node).

```python

def predict_row_proba(self, row):
    if self.is_leaf:
        group_size = self.value.sum()
        class_probs = self.value / group_size
        return class_probs
    elif row[self.best_feature_index] <= self.best_feature_split_val:
        return self.left.predict_row_proba(row)
    else:
        return self.right.predict_row_proba(row)

```

There are a few more methods on the two classes, but I think that covers the main idea!

Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.


{{< end_post >}}
