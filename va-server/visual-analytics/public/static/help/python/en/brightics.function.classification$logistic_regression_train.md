## Format
### Python
```python
from brightics.function.classification import logistic_regression_train
res = logistic_regression_train(table = ,feature_cols = ,label_col = ,fit_intercept = ,penalty = ,C = ,solver = ,random_state = ,max_iter = ,tol = ,class_weight = ,group_by = )
res['model']
```

## Description
Fit a logistic regression model. In statistics, logistic regression, or logit regression, or logit model[1] is a regression model where the dependent variable (DV) is categorical. This covers the case of a binary dependent variable. That is, where it can take only two values, '0' and '1', which represent outcomes such as pass/fail, win/lose, alive/dead or healthy/sick.

https://en.wikipedia.org/wiki/Logistic_regression

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **Fit Intercept**: Whether to fit an intercept
4. **Penalty**: Penalty term
   - Available items
      - l1
      - l2 (default)
5. **Inverse of Regularization**: Regularization term
   - Value type : Double
   - Default : 1.0 (value > 0.0)
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
   - Default : 100 (value >=1)
9. **Tolerance**: Tolerance for stopping criterion
   - Value type : Double
   - Default : 0.0001 (value > 0.0)
10. **Class Weights**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
11. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **fit_intercept**: Whether to fit an intercept
4. **penalty**: Penalty term
   - Available items
      - l1
      - l2 (default)
5. **C**: Regularization term
   - Value type : Double
   - Default : 1.0 (value > 0.0)
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
   - Default : 100 (value >=1)
9. **tol**: Tolerance for stopping criterion
   - Value type : Double
   - Default : 0.0001 (value > 0.0)
10. **class_weight**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
11. **group_by**: Columns to group by

#### Outputs: model

