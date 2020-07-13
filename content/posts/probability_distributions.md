---
title: "Probability Distributions"
date: 2020-05-31T10:10:39+01:00
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    # weight: 20
    name: "Probability Distributions"
summary: A visual 👀 tour of probability distributions
image: "img/probability_distributions.png"
---


# Bernoulli Distribution
The Bernoulli distribution is a simple discrete distribution having two possible outcomes - think success ✅ and failure ❌.

The shorthand $X \sim {\rm Bernoulli}(p)$ is used to indicate that the random variable $X$ has the Bernoulli distribution with parameter $p$ - the chance of success on an individual trial, where $0 < p < 1$. We can write the probability mass function as
$$
\begin{aligned}
P(X=0) &= 1-p \\\\
P(X=1) &= p
\end{aligned}
$$
This can also be written as
$$
P(X = k) = p^k(1 - p)^{1 - k}\qquad \text{for } k \in \\{0,1\\}
$$
For intuition a Bernoulli distribution could be used to represent flipping a coin once. Here the chance of success (flipping heads) is equal to $p$ (where $p=0.5$ assuming you have a normal coin). A Bernoulli distribution could also be used to represent whether a user clicks a certain link or signs up when visiting a website.

#### Bernoulli distribution chart

Try varying $p$ to see the impact on the Bernoulli distribution

{{< bernoulli_distribution >}}

---

# Binomial Distribution
The Binomial distribution with parameters n and p is the discrete probability distribution of the number of successes in a sequence of n independent experiments. Each trial is a bernoulli random variable (see above) representing two possible outcomes - think success ✅ and failure ❌.

The shorthand $X \sim B(n, p)$ is used to indicate that the random variable $X$ has the Binomial distribution with parameters $n, p$ - where $p$ is the chance of success on an individual trial where $0 < p < 1$ and $n$ is the number of trials. We can write the probability mass function as
$$
P(X=k) = {n \choose k}p^k(1 - p)^{n - k}\qquad \text{for }k\in \\{0,\dots,n\\}
$$
For intuition a Binomial distribution can be used to represent the number of heads in a series of $n$ coin flips.

#### Binomial distribution chart

Try varying $p$ and $n$ to see the impact on the Binomial distribution

{{< binomial_distribution >}}

---

# Normal Distribution
The Normal or Gaussian distribution is a continuous probability distribution that has a bell-shaped probability density function governed by two parameters, the mean $\mu$ and the variance $\sigma^2$. The shorthand $X \sim \mathcal{N}(\mu,\sigma^2)$ means X is normally distributed with mean $\mu$ and variance $\sigma^2$

The Normal distribution is important due to the central limit theorem. This states that the average of many samples of a random variable converges to a normal distribution as the number of samples increases.

The probability density function of the normal distribution is
$$
f(x)=\frac{1}{\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
\qquad \text{for }x\in (-\infty,\infty)
$$

#### Normal distribution chart

Try varying mean - $\mu$ and variance - $\sigma^2$ to see the impact on the Normal distribution

{{< normal_distribution >}}

---

# Beta Distribution

The beta distribution is a family of continuous probability distributions defined on the interval $[0, 1]$ parametrized by two positive shape parameters, denoted by $\alpha$ and $\beta$. The Beta distribution has the following probability density function. It is often used in Bayesian statistics as it is the conjugate prior of the Bernoulli, Binomial, Negative Binomial and geometric distributions. 
$$
f(x) = \frac{1}{B(\alpha,\beta)}x^{\alpha-1}(1-x)^{\beta-1}
\qquad \text{for }x\in [0,1]\\\\
$$
Where
$$
\begin{aligned}
B(\alpha,\beta) = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}\\\\
\Gamma(z) = \int_0^{\infty}x^{z-1}e^{-x}dx
\end{aligned}
$$

#### Beta distribution chart

Try varying $\alpha$ and $\beta$ to see the impact on the Beta distribution

{{< beta_distribution >}}

---

# LogNormal Distribution

A lognormal distribution is a continuous probability distribution of a random variable whose logarithm is normally distributed. That means if $X$ is log-normally distributed, then $Y = ln(X)$ has a normal distribution. A random variable which is log-normally distributed takes only positive values.

The shorthand $ln(X) \sim \mathcal{N}(\mu,\sigma^2)$ means the logarithm of X is normally distributed with mean $\mu$ and variance $\sigma^2$ i.e. X is lognormally distributed.

The probability density function of the lognormal distribution is
$$
f(x)=\frac{1}{x\sqrt{2\pi\sigma^2}}e^{-\frac{1}{2}\left(\frac{ln(x)-\mu}{\sigma}\right)^2}
\qquad \text{for }x\in (0,\infty)
$$

#### LogNormal distribution chart

Try varying $\mu$ and $\sigma^2$ to see the impact on the Log-Normal distribution

{{< lognormal_distribution >}}

---

{{< end_post >}}