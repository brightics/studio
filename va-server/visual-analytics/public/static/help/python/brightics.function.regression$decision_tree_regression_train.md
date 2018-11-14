## Format
### Python
```python
from brightics.function.regression import decision_tree_regression_train
res = decision_tree_regression_train(feature_cols = ,label_col = ,criterion = ,splitter = ,max_depth = ,min_samples_split = ,min_samples_leaf = ,min_weight_fraction_leaf = ,max_features = ,random_state = ,max_leaf_nodes = ,min_impurity_decrease = ,group_by = )
res['model']
```

## Description
A decision tree regressor.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Boolean
2. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Float, Double, Boolean
3. **Criterion**: The function to measure the quality of a split.
   - Available items
      - MSE (default)
      - Friedman MSE
      - MAE
4. **Splitter**: The strategy used to choose the split at each node. 
   - Available items
      - Best (default)
      - Random
5. **Max Depth**: The maximum depth of the tree.
   - Value type : Integer
6. **Min Samples Splits**: The minimum number of samples required to split an internal node.
   - Value type : Integer
7. **Min Samples Leaf**: The minimum number of samples required to be at a leaf node.
   - Value type : Integer
8. **Min Weight Fraction Leaf**: The minimum weighted fraction of the sum total of weights (of all the input samples) required to be at a leaf node.
   - Value type : Double
9. **Max Features**: The number of features to consider when looking for the best split.
   - Value type : Integer
10. **Seed**: The seed used by the random number generator.
   - Value type : Integer
11. **Max Leaf Nodes**: Grow a tree with this value in best-first fashion.
   - Value type : Integer
12. **Min Impurity Decrease**: A node will be split if this split induces a decrease of the impurity greater than or equal to this value.
   - Value type : Double
13. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Boolean
2. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Float, Double, Boolean
3. **criterion**: The function to measure the quality of a split.
   - Available items
      - mse (default)
      - friedman_mse
      - mae
4. **splitter**: The strategy used to choose the split at each node. 
   - Available items
      - best (default)
      - random
5. **max_depth**: The maximum depth of the tree.
   - Value type : Integer
6. **min_samples_split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
7. **min_samples_leaf**: The minimum number of samples required to be at a leaf node.
   - Value type : Integer
8. **min_weight_fraction_leaf**: The minimum weighted fraction of the sum total of weights (of all the input samples) required to be at a leaf node.
   - Value type : Double
9. **max_features**: The number of features to consider when looking for the best split.
   - Value type : Integer
10. **random_state**: The seed used by the random number generator.
   - Value type : Integer
11. **max_leaf_nodes**: Grow a tree with this value in best-first fashion.
   - Value type : Integer
12. **min_impurity_decrease**: A node will be split if this split induces a decrease of the impurity greater than or equal to this value.
   - Value type : Double
13. **group_by**: Columns to group by

#### Outputs
1. **model**: model

