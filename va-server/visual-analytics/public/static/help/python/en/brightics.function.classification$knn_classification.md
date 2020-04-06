## Format
### Python
```python
from brightics.function.classification import knn_classification
res = knn_classification(train_table = ,test_table = ,feature_cols = ,label_col = ,k = ,p = ,algorithm = ,leaf_size = ,pred_col_name = ,prob_col_prefix = ,suffix = )
res['out_table']
```

## Description
"In k-NN classification, the output is a class membership. An object is classified by a majority vote of its neighbors, with the object being assigned to the class most common among its k nearest neighbors (k is a positive integer, typically small). If k = 1, then the object is simply assigned to the class of that single nearest neighbor."

Reference: 
+ <https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm>

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : String, Integer, Long, Float, Double
3. **Number of Neighbors**: Number of neighbors. (default=5)
   - Value type : Integer
   - Default : 5 (value >= 1)
4. **Minkowski Exponent**: Power parameter for the Minkowski metric. (default = 2)
   - Value type : Integer
   - Default : 2 (value >= 1)
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
   - Default : 30 (value >= 1)
7. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction
8. **Probability Column Prefix**: Prefix for column name of probability
   - Value type : String
   - Default : probability
9. **Suffix Type**: Type of probability column suffix.
   - Available items
      - Index (default)
      - Label

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : String, Integer, Long, Float, Double
3. **k**: Number of neighbors. (default=5)
   - Value type : Integer
   - Default : 5 (value >= 1)
4. **p**: Power parameter for the Minkowski metric. (default = 2)
   - Value type : Integer
   - Default : 2 (value >= 1)
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
   - Default : 30 (value >= 1)
7. **pred_col_name**: Column name for prediction
   - Value type : String
   - Default : prediction
8. **prob_col_prefix**: Prefix for column name of probability
   - Value type : String
   - Default : probability
9. **suffix**: Type of probability column suffix.
   - Available items
      - index (default)
      - label

#### Outputs: table

