## Format
### Python
```python
from brightics.function.classification import decision_tree_classification_train
res = decision_tree_classification_train(feature_cols = ,label_col = ,criterion = ,splitter = ,max_depth = ,min_samples_split = ,min_samples_leaf = ,min_weight_fraction_leaf = ,max_features = ,random_state = ,max_leaf_nodes = ,min_impurity_decrease = ,group_by = )
res['model']
```

## Description
A decision tree is a decision support tool that uses a tree-like graph or model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility. It is one way to display an algorithm. Decision trees are commonly used in operations research, specifically in decision analysis, to help identify a strategy most likely to reach a goal, but are also a popular tool in machine learning.

https://en.wikipedia.org/wiki/Decision_tree

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Boolean
2. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
3. **Criterion**: Measure of the quality of a split.
   - Available items
      - Gini (default)
      - Entropy
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
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
3. **criterion**: Measure of the quality of a split.
   - Available items
      - gini (default)
      - entropy
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

