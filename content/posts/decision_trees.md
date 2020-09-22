---
title: "Decision Trees"
date: 2020-06-14T09:22:08+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Decision Trees"
summary: "From zero to decision tree"
image: "img/decision_tree.png"
---


What is a `decision tree`? 🤷‍♂️

If you're interested read on, if you're not ... well this one is surprisingly intuitive, go on treat yourself, read on!

This article is the third in a series covering fundamental machine learning algorithms. Each post will be split into two parts
  1. [**The idea and key concepts**]({{< relref "#the-idea-and-key-concepts" >}})
    - Most people should be able to follow this section and learn how the algorithm works
  2. [**The maths**]({{< relref "#the-maths" >}})
    - This is for the interested reader and will include detailed mathematical derivations followed by an implementation in Python

Click
- [here]({{< relref "linear_regression.md" >}}) if you missed `From zero to Linear Regression`
- [here]({{< relref "logistic_regression.md" >}}) if you missed `From zero to Logistic Regression`

If you have already read these congratulations!

---

## The idea and key concepts

So far we have seen `linear regression` introducing the idea of `regression` (predicting a `continuous` variable like house prices) and `logistic regression` introducing the idea of `classification` (predicting `discrete` variables like whether a student will pass an exam). Both these were examples of `supervised learning algorithms` depending on `training data` to `fit` the model.

A `decision tree` is also a supervised learning algorithm and can be used for either regression or for classification!

Let's use the example of trying to predict whether a student 👨‍🎓 is going to pass an exam to explain.

A decision tree works by splitting the training data into buckets (a.k.a `leaves`) by asking a series of questions. Imagine we have 100 training examples from the same exam last year where we know the student's I.Q. 🧠, how many hours ⏱ of revision they did and whether they passed the exam. We can split them based on whether they did more than 5 hours revision and  whether their I.Q. is above 100. It is easier to see this decision tree in the diagram below:

{{< decision_example >}}

Now given a new student taking the exam this year we can predict whether they will pass using the decision tree and the student's `feature` values. We work out which `leaf` the new student would end up in by asking the questions in the decision tree. Our prediction is made using the most common result of the training data in the the same `leaf`.

For example if a student has an I.Q. 🧠 of 110 and did 8 hours of revision ⏱ we would answer yes to both questions in the decision tree. Looking at this `leaf` we see that 18/20 students in the training data passed so we would predict this student will also pass. We can go further and say there is a 18/20 = 90% chance that they will pass.

Now we know how to use a decision tree to make predictions we can look at how to build the tree. Which questions should we ask when splitting the data?

**Impurity**

When building the decision tree ideally we want to split the training data into leaves so that the students in each leaf either all passed ✅ or all failed ❌; that way we know if another student ends up being in the same `leaf` they are very likely to have the same result. In reality this perfect split might not be possible but we want to get as close as we can. The `impurity` of a leaf quantifies how mixed it is. If we looked in our example above, the 1st group has 18 passes and only 2 fails so has a low `impurity`.

**Gini impurity**

There are different ways to define the `impurity` but one of the most common is `gini impurity`. The gini impurity of a leaf is equal to the probability that two randomly selected training examples from the leaf have different results. 

The diagram below helps to visualise the gini impurity. The group of hexagons represents a leaf in the decision tree. Each hexagon represents a student's result where blue is a pass and red is a fail. They all start off blue but you can click the hexagons to change them to red and see the impact on the impurity value shown below. The two sliders allow you to change the size of the hexagons and how many there are. You can see when all the hexagons are blue, the impurity is 0.


{{< gini >}}

We said above that ideally we want to have low impurity in the leaves of the decision tree, i.e. a low chance that two random students in a leaf have different results. The decision tree is built so that each split decreases the average impurity.

The algorithm checks splitting the data based on each different feature and each different feature value in the training data in order to find the best split. The best split is the one that decreases the impurity the most. The number of layers in the tree (or `depth`) is a parameter you get to choose when building the tree.

And that's it!

---

## The maths

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
