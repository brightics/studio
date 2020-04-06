## Format
### Python
```python
from brightics.function.regression import ada_boost_regression_train
res = ada_boost_regression_train(table = ,feature_cols = ,label_col = ,max_depth = ,n_estimators = ,learning_rate = ,loss = ,random_state = ,group_by = )
res['model']
```

## Description
AdaBoost, short for Adaptive Boosting, is a machine learning meta-algorithm which can be conjunction with many other types of learning algorithms to improve performance. The output of the other learning algorithms ('weak learners') is combined into a weighted sum that represents the final output of the boosted classifier. AdaBoost is adaptive in the sense that subsequent weak learners are tweaked in favor of those instances misclassified by previous classifiers. AdaBoost is sensitive to noisy data and outliers. In some problems it can be less susceptible to the overfitting problem than other learning algorithms. The individual learners can be weak, but as long as the performance of each one is slightly better than random guessing, the final model can be proven to converge to a strong learner.

Reference:
+ <https://en.wikipedia.org/wiki/AdaBoost>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Boolean, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
3. **Maximum Depth**: The max_depth of the base_estimator's DecisionTreeRegressor.
   - Value type : Integer
   - Default : 3 (value >= 2)
4. **Number of Estimators**: The maximum number of estimators at which boosting is terminated.
   - Value type : Integer
   - Default : 50 (value >= 1)
5. **Learning Rate**: Learning rate shrinks the contribution of each classifier by learning_rate.
   - Value type : Double
   - Default : 1.0 (value > 0)
6. **Loss**: The loss function to use when updating the weights after each boosting iteration.
   - Available items
      - LINEAR (default)
      - SQUARE
      - EXPONENTIAL
7. **Seed**: The seed used by the random number generator.
   - Value type : Integer
8. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Boolean, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
3. **max_depth**: The max_depth of the base_estimator's DecisionTreeRegressor.
   - Value type : Integer
   - Default : 3 (value >= 2)
4. **n_estimators**: The maximum number of estimators at which boosting is terminated.
   - Value type : Integer
   - Default : 50 (value >= 1)
5. **learning_rate**: Learning rate shrinks the contribution of each classifier by learning_rate.
   - Value type : Double
   - Default : 1.0 (value > 0)
6. **loss**: The loss function to use when updating the weights after each boosting iteration.
   - Available items
      - linear (default)
      - square
      - exponential
7. **random_state**: The seed used by the random number generator.
   - Value type : Integer
8. **group_by**: Columns to group by

#### Outputs: model

