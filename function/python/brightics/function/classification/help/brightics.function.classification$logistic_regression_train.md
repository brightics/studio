## Format
### Python
```python
from brightics.function.classification import logistic_regression_train
res = logistic_regression_train(feature_cols = ,label_col = ,fit_intercept = ,penalty = ,C = ,solver = ,random_state = ,max_iter = ,tol = ,group_by = )
res['model']
```

## Description
Fit a logistic regression model. In statistics, logistic regression, or logit regression, or logit model[1] is a regression model where the dependent variable (DV) is categorical. This covers the case of a binary dependent variable. That is, where it can take only two values, '0' and '1', which represent outcomes such as pass/fail, win/lose, alive/dead or healthy/sick.

https://en.wikipedia.org/wiki/Logistic_regression

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns
   - Allowed column type : Integer, Long, Float, Double
2. **Label Column**<b style="color:red">*</b>: Label column
   - Allowed column type : Integer, Long, Float, Double, String
3. **Fit Intercept**: Whether to fit an intercept
4. **Penalty**: Penalty term
   - Available items
      - l1
      - l2 (default)
5. **Inverse of Regularization**: Regularization term
   - Value type : Double
6. **Solver**: Solver to use
   - Available items
      - newton-cg
      - lbfgs
      - liblinear (default)
      - sag
      - saga
7. **Seed**: Seed
   - Value type : Integer
8. **Max Iteration**: Maximum number of iteration
   - Value type : Integer
9. **Tolerance**: Tolerance for stopping criterion
   - Value type : Double
10. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature columns
   - Allowed column type : Integer, Long, Float, Double
2. **label_col**<b style="color:red">*</b>: Label column
   - Allowed column type : Integer, Long, Float, Double, String
3. **fit_intercept**: Whether to fit an intercept
4. **penalty**: Penalty term
   - Available items
      - l1
      - l2 (default)
5. **C**: Regularization term
   - Value type : Double
6. **solver**: Solver to use
   - Available items
      - newton-cg
      - lbfgs
      - liblinear (default)
      - sag
      - saga
7. **random_state**: Seed
   - Value type : Integer
8. **max_iter**: Maximum number of iteration
   - Value type : Integer
9. **tol**: Tolerance for stopping criterion
   - Value type : Double
10. **group_by**: Columns to group by

#### Outputs
1. **model**: model

