---
title: "Bayesian Inference"
date: 2017-03-06T10:10:42+01:00
draft: false
mathjax: true
menu: 
  main:
    # weight: 1 # bring to top with high weight
    parent: Posts
summary: Explaining the basics of bayesian inference with the example of flipping a coin 💰
image: "img/bayes.png"
categories:
  - Probability and Statistics
---

## Introduction

A good place to start when trying to understanding Bayesian inference is to consider how to estimate the parameter $\theta$ in a Bernoulli distribution $X∼Ber(θ)$. A Bernoulli distribution is a simple distribution with a fixed chance of success.

\begin{align}
P(X=1)=\theta \\\\
P(X=0)=1-\theta
\end{align}

As an intuitive example $X$ can be the result of flipping a coin, here $\theta$ represents the probability of flipping a heads so

\begin{align}
P(X=1)&=P(\text{flip}=\text{heads})=\theta \\\\
P(X=0)&=P(\text{flip}=\text{tails})=1-\theta
\end{align}

Now assume you are given the data $D$ of having seen $n$ independent identically distributed (iid) samples of the Bernoulli random variable or $n$ flips of the coin $D = \\{x_1,...,x_n\\}$ where $x_i \in \\{0,1\\}$ or in our example of the coin $x_i \in\\{\text{tails}, \text{heads}\\}$.

Let's define $k$ to be the number of successes out of the n samples so$k \in \\{0,...,n\\}$. In our example $k$ is the number of heads in $n$ flips

For our simple coin example lets assume $n = 3$ and $k = 3$ so we have seen three heads in a row.

### Frequentist estimation

One method of estimating $\theta$ is to maximise the "likelihood" of having seen the data $D$. We can define that likelihood as 

\begin{align} 
P(D|\theta)
& = \prod_{i=1}^nP(X = x_i|\theta) \\\\
& = \prod_{i=1}^n\theta^{x_i}(1-\theta)^{1-x_i} \\\\
& = \theta^k(1-\theta)^{n-k}
\end{align}


The $\theta$ that maximises this likelihood is called the maximum likelihood estimator denoted $\theta_{ML}$ (which makes sense 🤪).

Maximising the likelihood in practise is achieved by maximising the log of the likelihood and the result is  the average of the observed data

$$
\theta_{ML} = \frac{1}{n}\sum_{i=1}^nx_i
$$

In our example we have seen three heads so $x_1=x_2=x_3=1$ and then $\theta_{ML} = 1$. Therefore having seen three heads in a row we estimate the probability of seeing a fourth as $P(X=1)=\theta_{ML} = 1$. 

Not exactly a genius prediction... 🤭

This is where bayesian inference comes in and the concept of having a prior opinion (like tossing a heads probably has a probability near 1/2)

## Bayesian prior

In a bayesian setting we think of the parameter $\theta$ itself as a random variable and we have a prior opinion of what it's distribution is. A good distribution to choose is the Beta distribution which itself has two parameters $a, b$. The Beta distribution pdf function is displayed in the graph below:

{{< beta_distribution >}}


We assume that $\theta$ ~ $Beta(a,b)$. In our example of the coin this graph makes sense as the density of $\theta$ (the probability of getting heads) is centred around a half (assuming you haven't changed the graph).

Bayes' law says 

sa

$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)}
$$

sa

sa


Using this we can say that the posterior probability is proportional to the product of the Likelihood and the Prior, or

$$
P(\theta|D)\propto P(D|\theta)*P(\theta)
$$

Hence using Bayes' theorem we can calculate the posterior distribution of $\theta$ using our initial prior and the information gained from having seen the data $D = \{x_1,...,x_n\}$. The posterior Distribution can be shown to also follow a Beta distribution, specifically 
$$
P(\theta|D) \sim Beta(a+k,b+n-k)
$$

The below plot allows you to vary your prior belief with $a$ and $b$ and view the posterior probability distribution after having seen n samples with k successes (n flips with k heads)

<h2>Beta prior on Bernoulli Distribution</h2>

{{< beta_prior_posterior_chart >}}

{{< end_post >}}