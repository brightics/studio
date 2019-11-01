## Format
### Python
```python
from brightics.function.classification import xgb_classification_train
res = xgb_classification_train(table = ,feature_cols = ,label_col = ,max_depth = ,learning_rate = ,n_estimators = ,class_weight = ,importance_type = ,random_state = ,group_by = )
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
   - Allowed column type : Integer, Long, Double, Float
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float, String
3. **Max Depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
4. **Learning Rate**: Boosting learning rate.
   - Value type : Double
   - Default : 0.1 (0 <= value)
5. **Number of Trees**: Number of boosted trees to fit.
   - Value type : Integer
   - Default : 100 (1 <= value)
6. **Class Weights**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
7. **Importance Type**: Importance Type is a feature importance type property.
   - Available items
      - Gain (default)
      - Weight
      - Cover
      - Total Gain
      - Total Cover
8. **Seed**: The seed used by the random number generator.
   - Value type : Integer
9. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double, Float
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float, String
3. **max_depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
4. **learning_rate**: Boosting learning rate.
   - Value type : Double
   - Default : 0.1 (0 <= value)
5. **n_estimators**: Number of boosted trees to fit.
   - Value type : Integer
   - Default : 100 (1 <= value)
6. **class_weight**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
7. **importance_type**: Importance Type is a feature importance type property.
   - Available items
      - gain (default)
      - weight
      - cover
      - total_gain
      - total_cover
8. **random_state**: The seed used by the random number generator.
   - Value type : Integer
9. **group_by**: Columns to group by

#### Outputs: model

