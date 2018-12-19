## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_lof
res = outlier_detection_lof(input_cols = ,choice = ,n_neighbors = ,algorithm = ,leaf_size = ,metric = ,p = ,contamination = ,new_column_name = )
res['out_table']
res['model']
```

## Description
This function detects outliers based on Local Outlier Factor (LOF) algorithm. The algorithm is an unsupervised anomaly detection method which computes the local density deviation of a given data point with respect to its neighbors. It considers as outliers the samples that have a substantially lower density than their neighbors.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Input columns.
   - Allowed column type : Integer, Long, Double, Decimal, Float
2. **Result**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed. (default = Add Prediction)
   - Available items
      - Remove Outliers
      - Add Prediction (default)
      - Both
3. **Number of Neighbors**: Number of neighbors to use by default for k-neighbors queries. If n_neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20
4. **Algorithm**: Algorithm used to compute the nearest neighbors:

- ‘ball_tree’ will use BallTree
- ‘kd_tree’ will use KDTree
- ‘brute’ will use a brute-force search.
- ‘auto’ will attempt to decide the most appropriate algorithm based on the values passed to fit method.

(dafault = 'auto')
   - Available items
      - Auto (default)
      - BallTree
      - KDTree
      - Brute-force search
5. **Leaf Size**: Leaf size passed to BallTree or KDTree. This can affect the speed of the construction and query, as well as the memory required to store the tree. (default = 30)
   - Value type : Integer
   - Default : 30
6. **Metric**: Metric used for the distance computation. (string, default = ‘minkowski’)

Reference: https://docs.scipy.org/doc/scipy/reference/spatial.distance.html
7. **Minkowski Exponent**: Parameter for the Minkowski metric. When p = 1, this is equivalent to using manhattan distance (l1), and euclidean distance (l2) for p = 2. For arbitrary p, minkowski distance (l_p) is used. (default=2)
   - Value type : Integer
   - Default : 2
8. **Contamination**: The amount of contamination of the data set, i.e. the proportion of outliers in the data set. Float in (0., 0.5). (default=0.1)
   - Value type : Double
   - Default : 0.1 (0.<value<0.5)
9. **Prefix**: 
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Input columns.
   - Allowed column type : Integer, Long, Double, Decimal, Float
2. **choice**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed. (default = Add Prediction)
   - Available items
      - remove_outliers
      - add_prediction (default)
      - both
3. **n_neighbors**: Number of neighbors to use by default for k-neighbors queries. If n_neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20
4. **algorithm**: Algorithm used to compute the nearest neighbors:

- ‘ball_tree’ will use BallTree
- ‘kd_tree’ will use KDTree
- ‘brute’ will use a brute-force search.
- ‘auto’ will attempt to decide the most appropriate algorithm based on the values passed to fit method.

(dafault = 'auto')
   - Available items
      - auto (default)
      - ball_tree
      - kd_tree
      - brute
5. **leaf_size**: Leaf size passed to BallTree or KDTree. This can affect the speed of the construction and query, as well as the memory required to store the tree. (default = 30)
   - Value type : Integer
   - Default : 30
6. **metric**: Metric used for the distance computation. (string, default = ‘minkowski’)

Reference: https://docs.scipy.org/doc/scipy/reference/spatial.distance.html
7. **p**: Parameter for the Minkowski metric. When p = 1, this is equivalent to using manhattan distance (l1), and euclidean distance (l2) for p = 2. For arbitrary p, minkowski distance (l_p) is used. (default=2)
   - Value type : Integer
   - Default : 2
8. **contamination**: The amount of contamination of the data set, i.e. the proportion of outliers in the data set. Float in (0., 0.5). (default=0.1)
   - Value type : Double
   - Default : 0.1 (0.<value<0.5)
9. **new_column_name**: 
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table
2. **model**: model

