---
title: "Bayesian Inference"
date: 2017-03-06T10:10:42+01:00
draft: true
---

## Introduction to Bayesian

A good place to start when trying to understanding Bayseian inference is to consider how to estimate the parameter $\theta$ in a Bernouill distribution $X∼Ber(θ)$. The notation $X∼Ber(θ)$ means $P(X=1)= \theta$ and $P(X=0)=1−\theta$.

As an intuitive example $X$ can be the result of flipping a coin, here $\theta$ represents the probabilty of flipping a heads and we can say $P(X=1) = P(\,flip = heads)$ and $P(X=0) = P(\,flip = tails)$

Now assume you are given the data - $D$ of having seen n (i.i.d) samples of the Bernouille Random Variable or n flips of the coin $D = \{x_1,...,x_n\}$ where $x_i \in \{0,1\}$ or in our example of the coin $x_i \in \{\,tails,heads\}$.

let's define $k$ to be the number of successes out of the n samples $k \in \{0,...,n\}$

For our simple coin example lets assume $n = 3$ and $k = 3$ so we have seen three heads in a row.

## Frequentist estimation
One method of estimating $\theta$ is to maximise the "likelihood" of having seen the data $D$. We can define that likelihood as 
$$
\begin{align} 
P(D|\theta)
& = \prod_{i=1}^nP(X = x_i|\theta) \\
& = \prod_{i=1}^n\theta^{x_i}(1-\theta)^{1-x_i}\\
& = \theta^k(1-\theta)^{n-k}
\end{align}
$$
The $\theta$ that maximises this is called the maximum likelihood estimator denoted $\theta_{ML}$

Maximising the likelihood in practise is acheived by maximising the log(likelihood) and the result is $\theta_{ML} = \frac{1}{n}\sum_{i=1}^nx_i$ which is just the average of the observed data.

In our example we have seen three heads so $x_1=x_2=x_3=1$ and then $\theta = 1$. Thereore having seen three heads in a row we estimate the probability of seeing a fourth as $P(X=1)=\theta_{ML} = 1$. Not exactly a genius prediction... This is were baysian inference comes in and the concept of having a prior opinion (like tossing a heads probably has a probability near 1/2)

## Baysian prior

In a basysian setting we think of the parameter $\theta$ itself as a random variable and we have a prior opinion of what it's distribution is.

A good distribution to choose as a starting Prior is the Beta distribution which iteself has two parameters $a,b$. It's pdf function is displayed in the graph below:

