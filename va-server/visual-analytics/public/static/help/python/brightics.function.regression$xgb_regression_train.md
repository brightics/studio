## Format
### Python
```python
from brightics.function.regression import xgb_regression_train
res = xgb_regression_train(table = ,feature_cols = ,label_col = ,max_depth = ,learning_rate = ,n_estimators = ,importance_type = ,random_state = ,group_by = )
res['model']
```

## Description
"XGBoost stands for 'Extreme Gradient Boosting', where the term 'Gradient Boosting' originates from the paper Greedy Function Approximation: A Gradient Boosting Machine, by Friedman. This is a tutorial on gradient boosted trees, and most of the content is based on these slides by Tianqi Chen, the original author of XGBoost.
The gradient boosted trees has been around for a while, and there are a lot of materials on the topic. This tutorial will explain boosted trees in a self-contained and principled way using the elements of supervised learning. We think this explanation is cleaner, more formal, and motivates the model formulation used in XGBoost."

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float
3. **Max Depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
4. **Learning Rate**: 
   - Value type : Double
   - Default : 0.1 (0 <= value)
5. **Number of Trees**: 
   - Value type : Integer
   - Default : 100 (1 <= value)
6. **Importance Type**: Importance Type is a feature importance type property.
   - Available items
      - Gain (default)
      - Weight
      - Cover
      - Total Gain
      - Total Cover
7. **Seed**: The seed used by the random number generator.
   - Value type : Integer
8. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float
3. **max_depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
4. **learning_rate**: 
   - Value type : Double
   - Default : 0.1 (0 <= value)
5. **n_estimators**: 
   - Value type : Integer
   - Default : 100 (1 <= value)
6. **importance_type**: Importance Type is a feature importance type property.
   - Available items
      - gain (default)
      - weight
      - cover
      - total_gain
      - total_cover
7. **random_state**: The seed used by the random number generator.
   - Value type : Integer
8. **group_by**: Columns to group by

#### Outputs: model

