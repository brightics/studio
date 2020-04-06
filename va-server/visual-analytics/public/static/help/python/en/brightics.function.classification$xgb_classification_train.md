## Format
### Python
```python
from brightics.function.classification import xgb_classification_train
res = xgb_classification_train(table = ,feature_cols = ,label_col = ,objective = ,max_depth = ,learning_rate = ,n_estimators = ,class_weight = ,importance_type = ,subsample = ,random_state = ,group_by = )
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
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float, String
3. **Objective for Binary Classification**: The learning task and the corresponding learning objective. For multi-class classification (the number of calsses is greater than or equal to 3), the learning task uses softmax objective.
4. **Max Depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
5. **Learning Rate**: Boosting learning rate.
   - Value type : Double
   - Default : 0.1 (0 <= value)
6. **Number of Trees**: Number of boosted trees to fit.
   - Value type : Integer
   - Default : 100 (1 <= value)
7. **Class Weights**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
8. **Importance Type**: Importance Type is a feature importance type property.
   - Available items
      - Gain (default)
      - Weight
      - Cover
      - Total Gain
      - Total Cover
9. **Fraction of Samples**: The fraction of samples to be used for fitting the individual base learners. If smaller than 1.0 this results in Stochastic Gradient Boosting. Fraction of Subsample interacts with the parameter Number of Trees. Choosing Fraction of Subsample < 1.0 leads to a reduction of variance and an increase in bias.
   - Value type : Double
   - Default : 1.0 (0 < value <= 1.0)
10. **Seed**: The seed used by the random number generator.
    - Value type : Integer
11. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Double, Float, String
3. **objective**: The learning task and the corresponding learning objective. For multi-class classification (the number of calsses is greater than or equal to 3), the learning task uses softmax objective.
4. **max_depth**: Maximum tree depth for base learners.
   - Value type : Integer
   - Default : 3 (1 <= value)
5. **learning_rate**: Boosting learning rate.
   - Value type : Double
   - Default : 0.1 (0 <= value)
6. **n_estimators**: Number of boosted trees to fit.
   - Value type : Integer
   - Default : 100 (1 <= value)
7. **class_weight**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
8. **importance_type**: Importance Type is a feature importance type property.
   - Available items
      - gain (default)
      - weight
      - cover
      - total_gain
      - total_cover
9. **subsample**: The fraction of samples to be used for fitting the individual base learners. If smaller than 1.0 this results in Stochastic Gradient Boosting. Fraction of Subsample interacts with the parameter Number of Trees. Choosing Fraction of Subsample < 1.0 leads to a reduction of variance and an increase in bias.
   - Value type : Double
   - Default : 1.0 (0 < value <= 1.0)
10. **random_state**: The seed used by the random number generator.
    - Value type : Integer
11. **group_by**: Columns to group by

#### Outputs: model

