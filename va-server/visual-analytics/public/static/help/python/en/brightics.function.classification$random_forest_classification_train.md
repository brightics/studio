## Format
### Python
```python
from brightics.function.classification import random_forest_classification_train
res = random_forest_classification_train(table = ,feature_cols = ,label_col = ,n_estimators = ,criterion = ,max_depth = ,min_samples_split = ,min_samples_leaf = ,max_features = ,class_weight = ,random_state = ,group_by = )
res['model']
```

## Description
Fit a random forest classification model. 
"This is an ensemble learning method for classification that operates by constructing a multitude of decision trees at training time and outputting the class that is the mode of the classes of the individual trees. Random decision forests correct for decision trees' habit of overfitting to their training set."

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
   - Allowed column type : Integer, Long, Float, Double, String
3. **Number of Trees**: The number of trees in the forest.
   - Value type : Integer
   - Default : 10 (value >= 1)
4. **Feature Selection Criterion**: The function to measure the quality of a split.
   - Available items
      - Gini Impurity (default)
      - Entropy
5. **Maximum Depth**: The maximum depth of the tree. If None, then nodes are expanded until all leaves are pure or until all leaves contain less than min_samples_split samples.
   - Value type : Integer
   - Default : value >= 1
6. **Minimum Number of Samples to Split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **Minimum Number of Samples in a Leaf**: The minimum number of samples required to be at a leaf node. A split point at any depth will only be considered if it leaves at least min_samples_leaf training samples in each of the left and right branches. This may have the effect of smoothing the model, especially in regression.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **Number of Features**: The number of features to consider when looking for the best split.
   - Available items
      - sqrt(n) (default)
      - log2(n)
      - n
9. **Class Weights**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
10. **Seed**: If int, random_state is the seed used by the random number generator.
    - Value type : Integer
11. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **n_estimators**: The number of trees in the forest.
   - Value type : Integer
   - Default : 10 (value >= 1)
4. **criterion**: The function to measure the quality of a split.
   - Available items
      - gini (default)
      - entropy
5. **max_depth**: The maximum depth of the tree. If None, then nodes are expanded until all leaves are pure or until all leaves contain less than min_samples_split samples.
   - Value type : Integer
   - Default : value >= 1
6. **min_samples_split**: The minimum number of samples required to split an internal node.
   - Value type : Integer
   - Default : 2 (value >= 2)
7. **min_samples_leaf**: The minimum number of samples required to be at a leaf node. A split point at any depth will only be considered if it leaves at least min_samples_leaf training samples in each of the left and right branches. This may have the effect of smoothing the model, especially in regression.
   - Value type : Integer
   - Default : 1 (value >= 1)
8. **max_features**: The number of features to consider when looking for the best split.
   - Available items
      - sqrt (default)
      - log2
      - n
9. **class_weight**: Weights associated with classes. If weights are not given, all classes are supposed to have weight one. Note that the class labels are considered in lexicographical order.
10. **random_state**: If int, random_state is the seed used by the random number generator.
    - Value type : Integer
11. **group_by**: Columns to group by

#### Outputs: model

