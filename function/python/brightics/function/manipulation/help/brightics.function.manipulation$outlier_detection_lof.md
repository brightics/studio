## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_lof
res = outlier_detection_lof(input_cols = ,n_neighbors = ,result_type = ,new_column_name = ,group_by = )
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
2. **Number of Neighbors**: Number of neighbors to use by default for k-neighbors queries. If n_neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20
3. **Result**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed. (default = Add Prediction)
   - Available items
      - Remove Outliers
      - Add Prediction (default)
      - Both
4. **New Column Name**: 
   - Value type : String
   - Default : is_outlier
5. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Input columns.
   - Allowed column type : Integer, Long, Double, Decimal, Float
2. **n_neighbors**: Number of neighbors to use by default for k-neighbors queries. If n_neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20
3. **result_type**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed. (default = Add Prediction)
   - Available items
      - remove_outliers
      - add_prediction (default)
      - both
4. **new_column_name**: 
   - Value type : String
   - Default : is_outlier
5. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

