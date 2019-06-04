## Format
### Python
```python
from brightics.function.regression import knn_regression
res = knn_regression(feature_cols = ,label_col = ,k = ,p = ,algorithm = ,leaf_size = ,pred_col_name = )
res['out_table']
```

## Description
"In k-NN regression, the output is the property value for the object. This value is the average of the values of its k nearest neighbors."\n
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
   - Allowed column type : Integer, Boolean, Long, Float, Double, Decimal
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
   - Allowed column type : Integer, Boolean, Long, Float, Double, Decimal
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

#### Outputs
1. **out_table**: table

