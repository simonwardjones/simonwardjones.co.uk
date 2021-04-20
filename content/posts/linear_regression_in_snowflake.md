---
title: "Linear Regression in Snowflake"
date: 2021-04-20T17:01:59+01:00
draft: true
mathjax: true
menu:
  main:
    parent: 'Posts'
    name: "Linear Regression in Snowflake"
summary: "Simple Linear Regression in Snowflake"
image: "img/linear_regression_in_snowflake.png"
categories:
  - SQL
  - Code
  - Linear Models
---

[Snowflake](https://www.snowflake.com/) ❄️ has some really helpful functions to help with simple linear regression. In this article I will quickly recap simple linear regression and then cover the following snowflake functions `REGR_VALX` ,  `REGR_VALY` ,  `REGR_AVGX` ,  `REGR_AVGY` ,  `REGR_COUNT` ,  `REGR_INTERCEPT` ,  `REGR_SLOPE` ,  `REGR_R2` ,  `REGR_SXX` ,  `REGR_SYY` and finally `REGR_SXY`.

### A brief introduction to linear regression

A simple linear regression model is a linear regression model where there is only one independent variable $x$. The dependent variable $y$ is modelled as a linear function of $x$. More simply put the relationship between $x$ and $y$ is described as a straight line with slope $\beta$ (a.k.a gradient) and intercept $\alpha$. 

{{<formula class="formular" >}}
y=\alpha + \beta x
{{</formula>}}

The below chart allows you to vary the parameters and observe the average error.

{{< snowflake_linear_regression >}}



For more about linear regression see my other linear regression article [here]({{< relref "linear_regression.md" >}}))


### A refresher on statistics


Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.

{{< end_post >}}