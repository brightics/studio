## Format
### Python
```python
from brightics.function.regression import random_forest_regression_train
res = random_forest_regression_train(table = ,feature_cols = ,label_col = ,n_estimators = ,criterion = ,max_depth = ,min_samples_split = ,min_samples_leaf = ,max_features = ,random_state = ,group_by = )
res['model']
```

## Description
Fit a random forest regression model. 
"This is an ensemble learning method for regression that operates by constructing a multitude of decision trees at training time and outputting the class that is the mean prediction of the individual trees. Random decision forests correct for decision trees' habit of overfitting to their training set."

Reference: 
+ <https://en.wikipedia.org/wiki/Random_forest>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **Number of Trees**: The number of trees in the forest.
   - Value type : Integer
   - Default : 10 (value >= 1)
4. **Feature Selection Criterion**: The function to measure the quality of a split. Supported criteria are “mse” for the mean squared error, which is equal to variance reduction as feature selection criterion, and “mae” for the mean absolute error.
   - Available items
      - Mean Squared Error (default)
      - Mean Absolute Error
5. **Maximum Depth**: The maximum depth of the tree. If None, then nodes are expanded until all leaves are pure or until all leaves contain less than min_samples_split samples.
   - Value type : Integer
   - Default : value >= 1
6. **Minimum Number of Samples to Split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **Minimum Number of Samples in a Leaf**: The minimum number of samples required to be at a leaf node. A split point at any depth will only be considered if it leaves at least min_samples_leaf training samples in each of the left and right branches. This may have the effect of smoothing the model, especially in regression.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **Number of Features**: The number of features to consider when looking for the best split:

If int, then consider max_features features at each split.
If float, then max_features is a fraction and int(max_features * n_features) features are considered at each split.

If “sqrt”, then max_features=sqrt(n_features) (same as “auto”).
If “log2”, then max_features=log2(n_features).
If None, then max_features=n_features.
   - Available items
      - sqrt(n)
      - log2(n)
      - n (default)
9. **Seed**: If int, random_state is the seed used by the random number generator; 
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
3. **n_estimators**: The number of trees in the forest.
   - Value type : Integer
   - Default : 10 (value >= 1)
4. **criterion**: The function to measure the quality of a split. Supported criteria are “mse” for the mean squared error, which is equal to variance reduction as feature selection criterion, and “mae” for the mean absolute error.
   - Available items
      - mse (default)
      - mae
5. **max_depth**: The maximum depth of the tree. If None, then nodes are expanded until all leaves are pure or until all leaves contain less than min_samples_split samples.
   - Value type : Integer
   - Default : value >= 1
6. **min_samples_split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **min_samples_leaf**: The minimum number of samples required to be at a leaf node. A split point at any depth will only be considered if it leaves at least min_samples_leaf training samples in each of the left and right branches. This may have the effect of smoothing the model, especially in regression.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **max_features**: The number of features to consider when looking for the best split:

If int, then consider max_features features at each split.
If float, then max_features is a fraction and int(max_features * n_features) features are considered at each split.

If “sqrt”, then max_features=sqrt(n_features) (same as “auto”).
If “log2”, then max_features=log2(n_features).
If None, then max_features=n_features.
   - Available items
      - sqrt
      - log2
      - None (default)
9. **random_state**: If int, random_state is the seed used by the random number generator; 
   - Value type : Integer
10. **group_by**: Columns to group by

#### Outputs: model

