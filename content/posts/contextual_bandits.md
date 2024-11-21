---
title: "Contextual Bandits"
date: 2024-11-19T13:16:07Z
draft: false
mathjax: true
menu:
  main:
    parent: "Posts"
    name: "Contextual Bandits"
summary: "Contextual Bandits and LinUCB algorithm"
image: "img/bandit.png"
categories:
  - Probability and Statistics
  - Visualisation
---

This articles provides an overview of `Contextual Bandits`, specifically focusing on the `LinUCB` algorithm
as described in the paper [A Contextual-Bandit Approach to Personalized News Article Recommendation](https://arxiv.org/pdf/1003.0146).

---

# Contextual Bandits

In my previous article on [Thompson sampling]({{< relref "thompson_sampling.md" >}}) I introduced the `Multi-arm Bandit` problem where
we have a fixed set of `actions` (A.K.A `arms`) and we need to decide which action to take in order to maximise our `reward`. In the case
of `Thompson Sampling` a Bayesian approach is used to continuously update our beliefs about the reward distribution of each
action.

The `Contextual Multi-arm Bandit` problem is an extension of the `Multi-arm Bandit` problem where we have additional information
about the `context` in which the `action` is taken. This context information can be used to improve the decision making process.

{{< row class="d-flex justify-content-center align-items-center" >}}
{{< column class="pb-3 d-flex align-items-center justify-content-center container">}}
{{< slots >}}
{{< slots >}}
{{< slots >}}
{{< /column >}}
{{< /row >}}

In the paper linked above the authors describe a `Contextual Bandit` approach to personalised news article recommendation.
In this example the `action` to take is the choice of article to recommend. The `context` in this kind of problem is
often represented as both a vector of features describing the user and a vector of features describing the article.

The user features might include information such as gender, age, location and aggregated previous click history and the
article features might include information such as the category of the article, the author or the publication date.

The goal of the `Contextual Bandit` algorithm is to learn a model that can predict the reward of each action given the context
so that the algorithm can recommend the best article to the user.

In the paper the authors describe the contextual bandit formerly as:

For trials, $t = 1, 2, ... , $ in trial $t$

1. For a user $u_t$ there is a set of arms or actions $A_t$ together with their feature vectors $x_{t,a}$. The vector $x_{t,a}$ summarizes information of both the user $u_t$ and arm $a$, and will be referred to as the `context`.
2. Based on observed payoffs in previous trials, the algorithm chooses an arm $a_t \in A_t$, and receives payoff $r_{t,a_t}$ whose expectation depends on both the user $u_t$ and arm $a_t$.
3. The algorithm then improves its arm-selection strategy with the new observation, $(x_{t,a_t}, a_t, r_{t,a_t}$). It is important to note that the reward $r_{t,a_t}$ is only observed for the chosen action $a_t$ and not for the other actions in $a\in A_t$.

The aim is to define a policy or algorithm A that maximises the expected cumulative reward over time $\sum_{t=1}^{T} r_{t,a_t}$. We define the optimal expected payoff as $E[\sum_{t=1}^{T} r_{t,a^{\*}_t}]$ where $a^*_t$ is the action with the maximum expected payoff at time $t$.
Equivalently one can define the `regret` of the algorithm as the difference between the expected cumulative reward of the algorithm and the expected cumulative reward of the optimal policy. The regret is defined as

{{<formula class="responsive-math">}}
\begin{align}
R(T) = E[\sum_{t=1}^{T} r_{t,a^{*}_t}] - E[\sum_{t=1}^{T} r_{t,a_t}]
\end{align}
{{</formula>}}

### Upper Confidence Bound algorithms

For each trial t, an upper confidence bound (UCB) algorithm estimates both the mean payoff $\hat{\mu}\_{t, a}$ as well as an interval $c_{t,a}$ around the mean. The algorithm then chooses the action with the `highest upper confidence bound`.
By choosing the action with the highest upper confidence bound the algorithm is able to balance the `exploration-exploitation` trade-off. The algorithm is able to explore actions with high uncertainty and exploit actions with high expected payoff.
{{<formula class="responsive-math">}}
a_t = \underset{a}{\operatorname{argmax}}(\hat{\mu}_{t,a} + c_{t,a})
{{</formula>}}

#### Disjoint Linear Upper Confidence Bound

In the paper the authors propose `LinUCB` by assuming a `linear` model for the expected payoff of each action given the context $x_{t,a}$

{{<formula class="responsive-math">}}
\begin{align}
E[r_{t, a} | x_{t,a}] = x_{t,a}^T \theta_a
\end{align}
{{</formula>}}

In this first `disjoint` formulation the parameters $\theta_a$ as well as the standard deviation $c_{t, a}$ are **learned independently for each arm** based on the observed data so far for that arm.
The algorithm then chooses the action with the highest upper confidence bound as described above.
In this `disjoint` formulation with a separate model for each arm the features relate to the user e.g. the users age,
their interest in different categories of article or their historical behaviour.
Features about the article wouldn't be helpful in the disjoint problem as the regressions are independent for each arm/action $a$.

Let $D_a$ be the `m x d` design matrix whose `m` rows represent the `m` previous contexts $x_{t,a}$ where arm `a` was selected, and let $c_a$ be the `m x 1` vector of rewards (or clicks) received for each of these contexts. The algorithm then estimates the parameters $\theta_a$ by solving the `ridge regression` with training data $(D_a, c_a)$

{{<formula class="responsive-math">}}
\begin{align}
\theta_a = (D_a^T D_a + I)^{-1} D_a^T c_a
\end{align}
{{</formula>}}

From the paper it can be show that with probability at least $1 - \delta$

{{<formula class="responsive-math">}}
\begin{align}
|x_{t,a}^T\theta_a - E[r_{t, a} | x_{t,a}]| \leq \alpha \sqrt{x_{t,a}^T (D_a^T D_a + I)^{-1} x_{t,a}}
\end{align}
{{</formula>}}

where $\alpha = 1 + \sqrt{\log(\frac{2}{\delta})/2}$ and $\delta > 0$.

From this `linUCB` selects the action $a_t$ with the highest upper confidence bound

{{<formula class="responsive-math">}}
\begin{align}
a_t &= \underset{a}{\operatorname{argmax}}(x_{t,a}^T \theta_a + \alpha \sqrt{x_{t,a}^T (D_a^T D_a + I)^{-1} x_{t,a}}) \\
&= \underset{a}{\operatorname{argmax}}(x_{t,a}^T \theta_a + \alpha \sqrt{x_{t,a}^T A_a^{-1} x_{t,a}})
\end{align}
{{</formula>}}

where $A_a = D_a^T D_a + I$

{{< accordion title="Click to see the algorithm using iterative parameter updates as described in the paper" >}}

- For t = 1, 2, ... , T
  - Observe context $x_{t,a}$ for each arm $a \in A_t$
  - For each arm $a \in A_t$
    - If $a$ is new: set
      - $A_a = I$ (d x d identity matrix where d is the number of features)
      - $b_a = 0$ (d dimensional vector)
    - Update current mean and variance estimates
      - $\theta_a = A_a^{-1} b_a$
      - $p_a = x_{t,a}^T \theta_a + \alpha \sqrt{x_{t,a}^T A_a^{-1} x_{t,a}}$
    - Choose action $a_t = \underset{a}{\operatorname{argmax}} p_a$
    - Observe reward $r_{t,a_t}$ and update $A_{a_t}$ and $b_{a_t}$
      - $A_{a_t} = A_{a_t} + x_{t,a_t} x_{t,a_t}^T$
      - $b_{a_t} = b_{a_t} + x_{t,a_t} r_{t,a_t}$

{{< /accordion >}}

#### LinUCB with Shared Features

As described in the paper in many situations it is helpful to use features that are shared across all arms. For instance
in the news article recommendation it might be useful to have features that interact the users category preferences with
the categories of the articles. For instance if a user has a preference for sports articles then it might be useful to have a
feature such as `user_likes_sports_and_article_is_sports`. This coefficient tieing this feature to the reward is learnt across arms.

In this case we still have a linear model for the expected payoff but the features are now a combination the `shared` features $z_{t,a}$ and `arm` specific features $x_{t,a}$

{{<formula class="responsive-math">}}
\begin{align}
E[r_{t, a} | x_{t,a}] = x_{t,a}^T \theta_a + z_{t,a}^T \beta
\end{align}
{{</formula>}}

{{< accordion title="Click to see the full algorithm for shared features" >}}

- Initialise global parameters:
  - $A_0 = I_k$ (k x k identity matrix where k is the number of shared features)
  - $b_0 = 0$ (k dimensional vector)
- For $t=1, 2, 3, ..., T$
  - Observe context $x_{t,a}$ for each arm $a \in A_t$
  - $\hat{\beta} = A_0^{-1} b_0$
  - For all arms $a \in A_t$
    - If $a$ is new: set
      - $A_a = I$ (d x d identity matrix where d is the number of features)
      - $B_a = 0_{d x k} $ (d x k matrix of zeros)
      - $b_a = 0$ (d dimensional zero vector)
    - Update current mean and variance estimates
      - $\theta_a = A_a^{-1} (b_a - B_a\hat{\beta})$
      - $s_{t, a} = z_{t, a}^T A_0^{-1}z_{t, a} - 2 z_{t, a}^TA_0^{-1}B_a^TA_a^{-1}x_{t, a} +$
    $x_{t, a}^T A_a^{-1}x_{t, a} + x_{t, a}^T A_a^{-1} B_aA_0^{-1}B_a^TA_a^{-1}x_{t, a}$
      - $p_a = x_{t, a}^T \theta_a + z_{t, a}^T \hat{\beta} + \alpha \sqrt{s_{t, a}}$
    - Update shared feature blocks based on current information for chosen action $a_t$
      - $A_0 = A_0 + B_{a_t}^TA_{a_t}^{-1}B_{a_t}$
      - $b_0 = b_0 + B_{a_t}^TA_{a_t}^{-1}b_{a_t}$
    - Update the arms specific blocks based on chosen action $a_t$
      - $A_{a_t} = A_{a_t} + x_{t, a_t}x_{t, a_t}^T$
      - $B_{a_t} = B_{a_t} + x_{t, a_t}z_{t, a_t}^T$
      - $b_{a_t} = b_{a_t} + x_{t, a_t}r_{t, a_t}$
    - Update the share feature blocks based on chosen action $a_t$ and updated information
      - $A_0 = A_0 + z_{t, a_t}z_{t, a_t}^T - B_{a_t}^TA_{a_t}^{-1}B_{a_t}$
      - $b_0 = b_0 + z_{t, a_t}r_{t, a_t} - B_{a_t}^TA_{a_t}^{-1}b_{a_t}$
{{< /accordion >}}

## Simulations with Disjoint LinUCB

In the following simulation we will simulate a disjoint LinUCB algorithm with just one feature in the `context` $x_{t,a}$ which is just the age of user. To keep the example simple we will consider the case where we have three different articles we can show the users, A - a sports article, B - a politics article and C - a technology article. The `reward` is simply 1 if the user clicks on the article and 0 if they don't.

In this simulation we will assume that the user is more likely to click on the sports article if they are younger and more likely to click on the politics article if they are older. The technology article is not dependent on the age of the user. More specifically we will assume that users age is drawn from a uniform distribution between 20 and 60 and the probability of clicking is:

- For sports article is $0.5 - (age - 20)*0.01$
- For politics article is $0.3 + (age - 20)*0.005$
- For technology article is $0.2$

The visualization shows the true conversion parameter $\theta_k$ for each arm (dotted line) varying by age as well as the predicted linear model and error bounds updated by the LinUCB algorithm. Below, a table displays the number of times each arm is selected and the clicks generated. Finally, a chart shows the cumulative pseudo-regret of the LinUCB algorithm over time, defined as the difference between the optimal reward and the reward generated by the algorithm.
Note the "optimal" reward here is defined as selecting the arm with the highest expected reward based on the true conversion parameters.

{{< lin_ucb >}}
