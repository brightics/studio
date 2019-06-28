## Format
### Python
```python
from brightics.function.classification import knn_classification
res = knn_classification(feature_cols = ,label_col = ,k = ,p = ,algorithm = ,leaf_size = ,pred_col_name = ,prob_col_prefix = ,suffix = )
res['out_table']
```

## Description
"In k-NN classification, the output is a class membership. An object is classified by a majority vote of its neighbors, with the object being assigned to the class most common among its k nearest neighbors (k is a positive integer, typically small). If k = 1, then the object is simply assigned to the class of that single nearest neighbor."\n
Reference: https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm

---

## Properties
### VA
#### Inputs
1. **train_table**: table
2. **test_table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : String, Integer, Boolean, Long, Float, Double, Decimal
3. **Number of Neighbors (k) **: Number of neighbors. (default=5)
   - Value type : Integer
   - Default : 5
4. **Minkowski Exponent**: Power parameter for the Minkowski metric. (default = 2)
   - Value type : Integer
   - Default : 2
5. **Algorithm**: Algorithm used to compute the nearest neighbors:

‘ball_tree’ will use BallTree
‘kd_tree’ will use KDTree
‘brute’ will use a brute-force search.
‘auto’ will attempt to decide the most appropriate algorithm based on the values passed to fit method.
   - Available items
      - Auto (default)
      - Ball Tree
      - KD Tree
      - Brute-force Search
6. **Leaf Size**: Leaf size passed to BallTree or KDTree. This can affect the speed of the construction and query, as well as the memory required to store the tree. The optimal value depends on the nature of the problem. (default = 30)
   - Value type : Integer
   - Default : 30
7. **Prediction Column Name**: Prediction column name.
   - Value type : String
   - Default : prediction
8. **Probability Column Prefix**: Probability column prefix.
   - Value type : String
   - Default : probability
9. **Suffix Type**: Type of probability column suffix.
   - Available items
      - Index (default)
      - Label

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **train_table**: table
2. **test_table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : String, Integer, Boolean, Long, Float, Double, Decimal
3. **k**: Number of neighbors. (default=5)
   - Value type : Integer
   - Default : 5
4. **p**: Power parameter for the Minkowski metric. (default = 2)
   - Value type : Integer
   - Default : 2
5. **algorithm**: Algorithm used to compute the nearest neighbors:

‘ball_tree’ will use BallTree
‘kd_tree’ will use KDTree
‘brute’ will use a brute-force search.
‘auto’ will attempt to decide the most appropriate algorithm based on the values passed to fit method.
   - Available items
      - auto (default)
      - ball_tree
      - kd_tree
      - brute
6. **leaf_size**: Leaf size passed to BallTree or KDTree. This can affect the speed of the construction and query, as well as the memory required to store the tree. The optimal value depends on the nature of the problem. (default = 30)
   - Value type : Integer
   - Default : 30
7. **pred_col_name**: Prediction column name.
   - Value type : String
   - Default : prediction
8. **prob_col_prefix**: Probability column prefix.
   - Value type : String
   - Default : probability
9. **suffix**: Type of probability column suffix.
   - Available items
      - index (default)
      - label

#### Outputs
1. **out_table**: table

