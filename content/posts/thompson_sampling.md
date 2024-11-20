---
title: "Thompson Sampling"
date: 2024-11-13T16:41:46Z
draft: false
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Thompson Sampling"
summary: "An overview of Thompson Sampling"
image: "img/thompson_sampling.png"
categories:
  - Probability and Statistics
  - Visualisation
---

---

A `multi-armed bandit` problem is one in which you are faced with a number of options (often called `arms` or `variants`
in A/B testing). You need to decide which one to choose to maximise some `reward`. The problem is that you don't know
how good each option is and you need to balance between trying out new options (`exploration`) and choosing the best
based on what you know so far (`exploitation`).


`Thompson sampling` is a strategy for balancing `exploration` and `exploitation` in a `multi-armed bandit` problem to
maximise `reward`.

To make this more concrete let's imaging we our trying to improve click through on the homepage of a website. Imagine we
have developed three different options which we could show the user. We want to know which is the best at getting users
to click through! In this example the `reward` is deemed to be 1 if the user clicks and 0 if they don't.

In a classic A/B test, if we had three options A, B and C (assuming C is the current control experience) you would
randomly assign users to one of the three options and then measure the click through rate (CTR) for each option
once the experiment has ran for the pre-decided time (likely based on a power calculation)

<!-- below insert an svg with a user icon on the left connected to three computers on the right with labels A, B and C -->
{{< row class="d-flex justify-content-center align-items-center" >}}
{{< column class="pb-3 d-flex align-items-center justify-content-center">}}
{{< bandit_arms >}}
{{< /column >}}
{{< /row >}}

However, in a `multi-armed bandit` problem we want to be more efficient with our data collection. We want to use the
data we collect to continuously inform the decision of which option to show next. Intuitively if very few users
seem to be clicking on the content for option A then we would ideally like to show less users option A. In this
way we can learn more about the more promising candidates B and C whilst also not subjecting too many users to a poor
experience with option A.

Describing a bandit problem more formally, for each arm/action $x_1,...,x_k$ we observe an outcome $y_1,...,y_k$ and a
related reward $r_1(y_1),...,r_k(y_k)$ dependent on the outcome. In the example above the action is which option to
show the user and the outcome is the same as the reward, 1 if the user clicks and 0 if they don't.
The outcome $y$ in this example, either a click or no click, is a binary variable and as such it can be modelled as a
Bernoulli distribution: given option or arm $x_k$ the probability of observing a click is given by a
parameter $\theta_k$.
\begin{align}
P(y_k=1|x_k)&=\theta_k \\\\
P(y_k=0|x_k)&=1-\theta_k
\end{align}
More generally the outcome given each action follows a distribution $y_k \sim q_{\theta_k}(.|x_k)$ parametrised by
$\theta_k$. The value of $\theta_k$ is unknown and we wish to estimate it from the observed data as we go along. Before
making any observations we assume that $\theta_k$ follows some prior distribution $p(\theta_k)$. In the case of the
Bernoulli distribution a common choice of prior is the beta distribution which is the conjugate prior for the Bernoulli.

It makes sense that we wish to choose an action $x_k$ to maximise the expected reward $E[r_k(y_k)|x_k]$.
$$
\underset{k}{\operatorname{argmax}} E[r_k(y_k)|x_k] = \underset{k}{\operatorname{argmax}} \int r_k(y_k)q_{\theta_k}(y_k|x_k)dy_k
$$
Which in the simple bernoulli case boils down to choosing the action with the highest $\theta_k$.
$$
\underset{k}{\operatorname{argmax}} E[r_k(y_k)] = \underset{k}{\operatorname{argmax}} \theta_k
$$

In a so called `greedy` algorithm the value of $\theta_k$ is assumed to be the mean of the current distribution of
$\theta_k$ whereas in a `Thompson sampling` algorithm the value of $\theta_k$ is sampled from the current distribution
$p(\theta_k)$ and it is through this sampling that the algorithm balances exploration and exploitation.

In both cases the distribution of $\theta_k$ is updated as new data is observed using Bayes rule.

So the Thompson sampling algorithm can be boiled down to
1. Initialise the priors $p(\theta_k) = \text{Beta}(a=1, b=1)$ for the conversion probability of each arm $x_k$
2. At each step
   1. **Sample the model**  $\hat{\theta}$ from the current prior $p(\theta_k)$
   2. **Select the optimal action** $x_k$ which correspond to the largest $\hat{\theta}$
   3. **Observe the outcome and update the prior distribution** $p(\theta_k)$ for the selected action $x_k$ using Bayes rule.
      In the bernoulli case update the beta distribution params as $a = a + y_k, b = b + 1 - y_k$


### Thompson sampling simulation

To take this example further let's run a simulation where somehow we actually know the true click through rate for each
option. Select the True CTR for each arm and then simulate the process of Thompson sampling.

{{< thompson_sampling >}}

Notice that once the simulation is complete the Thompson sampling algorithm has converged to showing the best performing
option more often than the other two! This is because the Thompson sampling algorithm is able to balance
exploration and exploitation by sampling from the posterior distribution of the conversion rate for each arm.
