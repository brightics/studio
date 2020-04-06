## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_lof
res = outlier_detection_lof(table = ,input_cols = ,n_neighbors = ,result_type = ,new_column_name = ,group_by = )
res['out_table']
res['model']
```

## Description
This function detects outliers based on Local Outlier Factor (LOF) algorithm. 

"The algorithm is an unsupervised anomaly detection method which computes the local density deviation of a given data point with respect to its neighbors. By comparing the local density of a sample to the local densities of its neighbors, one can identify samples that have a substantially lower density than their neighbors. These are considered outliers."

Reference:
+ <https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.LocalOutlierFactor.html>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float
2. **Number of Neighbors**: Number of neighbors to use by default for k-neighbors queries. If the number of neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20 (value >= 1)
3. **Result**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed.
   - Available items
      - Remove Outliers
      - Add Prediction (default)
      - Both
4. **New Column Name**: Column name for new column.
   - Value type : String
   - Default : is_outlier
5. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float
2. **n_neighbors**: Number of neighbors to use by default for k-neighbors queries. If the number of neighbors is larger than the number of samples provided, all samples will be used.
   - Value type : Integer
   - Default : 20 (value >= 1)
3. **result_type**: Can choose result table between inlier/outlier detection table and filtered table that outliers are removed.
   - Available items
      - remove_outliers
      - add_prediction (default)
      - both
4. **new_column_name**: Column name for new column.
   - Value type : String
   - Default : is_outlier
5. **group_by**: Columns to group by

#### Outputs: table, model

