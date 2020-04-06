## Format
### Python
```python
from brightics.function.regression import penalized_linear_regression_train
res = penalized_linear_regression_train(table = ,feature_cols = ,label_col = ,regression_type = ,alpha = ,l1_ratio = ,fit_intercept = ,max_iter = ,tol = ,random_state = ,group_by = )
res['model']
```

## Description
This model solves a regression model where the loss function is the linear least squares function and regularization is given. 

1. Ridge model solves a regression model where the loss function is the linear least squares function and regularization is given by the L2-norm. 

2. Lasso is a linear model trained with L1 prior as regularizer. 

3. ElasticNet is a linear regression with combined L1 and L2 priors as regularizer. Technically the Lasso model is optimizing the same objective function as the ElasticNet without L2 penalty.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **Regression Type**: Choose among 'Ridge', 'Lasso', and 'ElasticNet'.
   - Available items
      - Ridge (default)
      - Lasso
      - ElasticNet
4. **Regularization (Penalty Weight)**: Constant that multiplies the penalty terms.
   - Value type : Double
   - Default : 1.0 (value >= 0.0)
5. **L1 Ratio**: The ElasticNet mixing parameter, with 0 <= 'L1 ratio' <= 1. For 'L1 ratio' = 0, the penalty is an L2 penalty. For 'L1 ratio' = 1, it is an L1 penalty. For 0 < 'L1 ratio' < 1, the penalty is a combination of L1 and L2.
   - Value type : Double
   - Default : 0.5 (0.0 <= value <= 1.0)
6. **Fit Intercept**: Whether the intercept should be estimated or not. If False, the data is assumed to be already centered.
7. **Iterations**: The maximum number of iterations.
   - Value type : Integer
   - Default : 1000 (value >= 1)
8. **Tolerance**: The tolerance for the optimization: if the updates are smaller than tolerance, the optimization code checks the dual gap for optimality and continues until it is smaller than tolerance.
   - Value type : Double
   - Default : 0.0001 (value > 0.0)
9. **Seed**: The seed of the pseudo random number generator that selects a random feature to update (default=None).
   - Value type : Integer
10. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **regression_type**: Choose among 'Ridge', 'Lasso', and 'ElasticNet'.
   - Available items
      - ridge (default)
      - lasso
      - elastic_net
4. **alpha**: Constant that multiplies the penalty terms.
   - Value type : Double
   - Default : 1.0 (value >= 0.0)
5. **l1_ratio**: The ElasticNet mixing parameter, with 0 <= 'L1 ratio' <= 1. For 'L1 ratio' = 0, the penalty is an L2 penalty. For 'L1 ratio' = 1, it is an L1 penalty. For 0 < 'L1 ratio' < 1, the penalty is a combination of L1 and L2.
   - Value type : Double
   - Default : 0.5 (0.0 <= value <= 1.0)
6. **fit_intercept**: Whether the intercept should be estimated or not. If False, the data is assumed to be already centered.
7. **max_iter**: The maximum number of iterations.
   - Value type : Integer
   - Default : 1000 (value >= 1)
8. **tol**: The tolerance for the optimization: if the updates are smaller than tolerance, the optimization code checks the dual gap for optimality and continues until it is smaller than tolerance.
   - Value type : Double
   - Default : 0.0001 (value > 0.0)
9. **random_state**: The seed of the pseudo random number generator that selects a random feature to update (default=None).
   - Value type : Integer
10. **group_by**: Columns to group by

#### Outputs: model

