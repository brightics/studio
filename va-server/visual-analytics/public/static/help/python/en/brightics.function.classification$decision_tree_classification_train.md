## Format
### Python
```python
from brightics.function.classification import decision_tree_classification_train
res = decision_tree_classification_train(table = ,feature_cols = ,label_col = ,criterion = ,splitter = ,max_depth = ,min_samples_split = ,min_samples_leaf = ,min_weight_fraction_leaf = ,max_features = ,random_state = ,max_leaf_nodes = ,min_impurity_decrease = ,class_weight = ,group_by = )
res['model']
```

## Description
A decision tree is a decision support tool that uses a tree-like graph or model of decisions and their possible consequences, including chance event outcomes, resource costs, and utility. It is one way to display an algorithm. Decision trees are commonly used in operations research, specifically in decision analysis, to help identify a strategy most likely to reach a goal, but are also a popular tool in machine learning.

https://en.wikipedia.org/wiki/Decision_tree

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
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
   - Default : (value >= 1)
6. **Min Samples Splits**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **Min Samples Leaf**: The minimum number of samples required to be at a leaf node.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **Min Weight Fraction Leaf**: The minimum weighted fraction of the sum total of weights (of all the input samples) required to be at a leaf node.
   - Value type : Double
   - Default : 0.0 (0.0 <= value <= 0.5)
9. **Max Features**: The number of features to consider when looking for the best split.
   - Value type : Integer
   - Default : (value >= 1)
10. **Seed**: The seed used by the random number generator.
    - Value type : Integer
11. **Max Leaf Nodes**: Grow a tree with this value in best-first fashion.
    - Value type : Integer
    - Default : (value > 1)
12. **Min Impurity Decrease**: A node will be split if this split induces a decrease of the impurity greater than or equal to this value.
    - Value type : Double
    - Default : (value >= 0.0)
13. **Class Weights**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
14. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
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
   - Default : (value >= 1)
6. **min_samples_split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **min_samples_leaf**: The minimum number of samples required to be at a leaf node.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **min_weight_fraction_leaf**: The minimum weighted fraction of the sum total of weights (of all the input samples) required to be at a leaf node.
   - Value type : Double
   - Default : 0.0 (0.0 <= value <= 0.5)
9. **max_features**: The number of features to consider when looking for the best split.
   - Value type : Integer
   - Default : (value >= 1)
10. **random_state**: The seed used by the random number generator.
    - Value type : Integer
11. **max_leaf_nodes**: Grow a tree with this value in best-first fashion.
    - Value type : Integer
    - Default : (value > 1)
12. **min_impurity_decrease**: A node will be split if this split induces a decrease of the impurity greater than or equal to this value.
    - Value type : Double
    - Default : (value >= 0.0)
13. **class_weight**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
14. **group_by**: Columns to group by

#### Outputs: model

