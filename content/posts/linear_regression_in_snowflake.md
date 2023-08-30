---
title: "Linear Regression in Snowflake"
date: 2021-04-20T17:01:59+01:00
draft: false
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

A simple linear regression model is a linear regression model where there is only one independent variable $x$. The dependent variable $y$ is modelled as a linear function of $x$. More simply put the relationship between $x$ and $y$ is described as a straight line with slope $\beta$ (a.k.a gradient) and intercept $\alpha$.

{{<formula class="formular" >}}
y=\alpha + \beta x
{{</formula>}}

In regression we want to find the optimal intercept $\alpha$ and slope $\beta$ to minimise the sum of square errors (or residuals). The residuals are the distances from each point vertically to the model line.

[Snowflake](https://www.snowflake.com/) ❄️ has some really helpful functions to help with simple linear regression. The three key regression functions are `REGR_SLOPE` , `REGR_INTERCEPT`  and `REGR_R2` used to find the optimal slope, intercept and corresponding r-squared respectively but the rest are useful helpers functions!

 - [`REGR_VALX` and `REGR_VALY`]({{< relref "#regr_valx-and-regr_valy" >}})
 - [`REGR_COUNT`]({{< relref "#regr_count" >}})
 - [`REGR_AVGX` and `REGR_AVGY`]({{< relref "#regr_avgx-and-regr_avgy" >}})
 - [`REGR_SXX`, `REGR_SYY` and `REGR_SXY`]({{< relref "#regr_sxx-regr_syy-and-regr_sxy" >}})
 - [`REGR_SLOPE`, `REGR_INTERCEPT` and `REGR_R2`]({{< relref "#regr_slope-regr_intercept-and-regr_r2" >}})

All of these functions have the same call signature `function_name(y, x)` where y is the dependent variable and x is the independent variable in the regression.

The following chart visualises simple linear regression and allows you to vary the slope and intercept and see the impact on the r-squared and other statistics below the chart.

{{< snowflake_linear_regression >}}

Before we get started with the sql functions let's make some toy data to play with! The following query generates the numbers from 1 to 10 for the x column and defines y as `(4 * x) + 3` with some noise. We also added a few naughty rows with null values, this will help show off snowflakes functions above.

```sql
create temporary table temp_table as (
    select
        row_number() over (order by seq8()) as x,
        4 * x + normal(0, 10, random(10)) + 3 as y
    from table(generator(rowcount => 20)) G

    union all

    select
        *
    from values (null, 100), (50, null)
)
```

Ok, now that's done let's take a look at the table. The data is the same as the chart above.
```sql
select
    x,
    y
from temp_table;
```
{{< table "table table-striped" >}}
| X    | Y            |
| ---- | ------------ |
| 1    | -5.940727153 |
| 2    | -6.435786057 |
| 3    | 12.874649301 |
| 4    | 35.910490613 |
| 5    | 40.969651455 |
| 6    | 27.466977488 |
| 7    | 28.339904759 |
| 8    | 48.022369501 |
| 9    | 36.211253796 |
| 10   | 55.04814023  |
| null | 100          |
| 50   | null         |
{{</table>}}

### `REGR_VALX` and `REGR_VALY`

`REGR_VALX`, `REGR_VALY` are helper functions to make sure we only include points (x, y) in the regression where both x and y are not null. `REGR_VALX(y , x)` returns x if y is not null else it returns null and `REGR_VALY(y , x)` returns y if x is not null else it returns null.

That means the following two queries are equivalent
```sql
select
    REGR_VALX(y , x) as x_val
from temp_table
```

```sql
select
    case when y is not null then x else null end as x_val
from temp_table
```
Similarly `REGR_VALY(y , x)` is equivalent to `case when x is not null then y else null end`

### `REGR_COUNT`
`REGR_COUNT` is similar to the normal sql `count` function but only returns the number of non null pairs (x, y). In terms of regression this can be used to calculate the sample size $n$. The following query calculates the same thing 3 times (starting to show how the functions in Snowflake help to simplify)

```sql
select
    regr_count(y, x) as n,
    count(regr_valx(y, x)) as n_2,
    count(case when y is not null then x else null end) as n_3
from temp_table;
```

### `REGR_AVGX` and `REGR_AVGY`
`REGR_AVGX` and `REGR_AVGY` are both similar to the `avg` function but only include rows where both x and y are non null in the calculation. These are used to calculate the mean values $\bar{x}$ and $\bar{y}$ which are important to calculate the regression `gradient`, `intercept` and `r-squared`. The following query again calculates the same thing three times each for x and y to show how it works.

```sql
select
    REGR_AVGX(y, x) as x_mean,
    avg(regr_valx(y, x)) as x_mean_2,
    avg(case when y is not null then x else null end) as x_mean_3,

    REGR_AVGY(y, x) as y_mean,
    avg(regr_valy(y, x)) as y_mean_2,
    avg(case when x is not null then y else null end) as y_mean_3
from temp_table;
```

### `REGR_SXX`, `REGR_SYY` and `REGR_SXY`

`SXX`, `SYY` and `SXY` are useful statistics to calculate the slope, intercept and r-squared. Their formulas are in the table above [here](.#sxx).

The following two queries both calculate `SXX`, `SYY` and `SXY`, the first in vanilla SQL the second using the snowflake helper functions.

```sql
with averages as (
    select
        avg(case when y is not null then x else null end) as x_mean,
        avg(case when x is not null then y else null end) as y_mean
    from temp_table
)
select
    sum(pow(case when y is not null then x else null end - x_mean, 2)) as sxx,
    sum(pow(case when x is not null then y else null end - y_mean, 2)) as syy,
    sum(
        (case when y is not null then x else null end - x_mean) *
        (case when x is not null then y else null end - y_mean)
    ) as sxy
from temp_table
inner join averages
;

```
Using the helpers:
```sql
select
    regr_sxx(y, x) as sxx,
    regr_syy(y, x) as syy,
    regr_sxy(y, x) as sxy
from temp_table;
;
```

{{< table "table table-striped" >}}
| SXX  | SYY      | SXY    |
| ---- | -------- | ------ |
| 82.5 | 3,992.00 | 493.48 |
{{</table>}}


### `REGR_SLOPE`, `REGR_INTERCEPT` and `REGR_R2`

`REGR_SLOPE` and `REGR_INTERCEPT` calculate the optimal slope and intercept to minimise the sum of squares of the residuals. The `REGR_R2` function calculates the r-squared for the optimal line. This number is between 0 and 1 and explains how much of the variance is explained by the model, the closer the value to 1 the better the fit.

The formulas are given in the tables above [here](.#beta).

Again we show this in vanilla sql and using the snowflake helpers:

```sql
with averages as (
    /* First we calculate the average of x and y */
    select
        avg(case when y is not null then x else null end) as x_mean,
        avg(case when x is not null then y else null end) as y_mean
    from temp_table
),

statistics as (
    /* Calculate SXX, SYY and SXY as an intermediate step */
    select
        x_mean,
        y_mean,
        sum(pow(case when y is not null then x else null end - x_mean, 2)) as sxx,
        sum(pow(case when x is not null then y else null end - y_mean, 2)) as syy,
        sum(
            (case when y is not null then x else null end - x_mean) *
            (case when x is not null then y else null end - y_mean)
        ) as sxy
    from temp_table
    inner join averages
    group by 1, 2
)

select
    /* Finally calculate the optimal slope and intercept
     as well as the corresponding r-squared */
    sxy / sxx as slope,
    y_mean - slope * x_mean as intercept,
    (sxy * sxy) / (sxx * syy) as r_squared
from statistics;
```


```sql
;
select
    regr_slope(y, x) as slope,
    regr_intercept(y, x) as intercept,
    regr_r2(y, x) as r_squared
from temp_table;
;
```

{{< table "table table-striped" >}}
| SLOPE       | INTERCEPT    | R_SQUARED    |
| ----------- | ------------ | ------------ |
| 5.981534878 | -5.651749436 | 0.7394144386 |
{{</table>}}


The functions above allow you to quickly calculate regression values in snowflake and understand the relationships between columns - but remember correlation is not causation s that.

For more about linear regression see my other linear regression article [here]({{< relref "linear_regression.md" >}})

Thanks for reading! 👏 Please get in touch with any questions, mistakes or improvements.

{{< end_post >}}
