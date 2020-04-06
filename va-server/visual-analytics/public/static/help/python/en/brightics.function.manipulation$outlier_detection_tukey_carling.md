## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_tukey_carling
res = outlier_detection_tukey_carling(table = ,input_cols = ,outlier_method = ,multiplier = ,result_type = ,new_column_prefix = ,group_by = )
res['out_table']
res['model']
```

## Description
Detect outliers. If a value is determined as a outlier, this value can be removed from the data.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Double, Long, Float
2. **Outlier Method**: Outlier-method option (tukey, carling). Two Outlier Removal methods are provided.
- tukey: Remove Y s.t Y < (Q1 - multiplier*IQR) or Y > (Q3 + multiplier*IQR) where IQR = Q3-Q1. 
- carling: Remove Y s.t Y < (M - multiplier*IQR) or Y > (M + multiplier*IQR) where M=median, IQR = Q3-Q1.

   - Available items
      - tukey (default)
      - carling
3. **Multiplier**: Multiplier value used for outlier method (see explanation of 'Outlier Method'). Double type value is required.
   - Value type : Double
   - Default : tukey: 1.5, carling: 2.3 (value > 0.0)
4. **Result**: Can choose result table between inlier/outlier detection table, filtered table that outliers are removed, or both.
   - Available items
      - Remove Outliers
      - Add Prediction (default)
      - Both
5. **New Column Prefix**: Column prefix for new columns.
   - Value type : String
   - Default : is_outlier_
6. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Double, Long, Float
2. **outlier_method**: Outlier-method option (tukey, carling). Two Outlier Removal methods are provided.
- tukey: Remove Y s.t Y < (Q1 - multiplier*IQR) or Y > (Q3 + multiplier*IQR) where IQR = Q3-Q1. 
- carling: Remove Y s.t Y < (M - multiplier*IQR) or Y > (M + multiplier*IQR) where M=median, IQR = Q3-Q1.

   - Available items
      - tukey (default)
      - carling
3. **multiplier**: Multiplier value used for outlier method (see explanation of 'Outlier Method'). Double type value is required.
   - Value type : Double
   - Default : tukey: 1.5, carling: 2.3 (value > 0.0)
4. **result_type**: Can choose result table between inlier/outlier detection table, filtered table that outliers are removed, or both.
   - Available items
      - remove_outliers
      - add_prediction (default)
      - both
5. **new_column_prefix**: Column prefix for new columns.
   - Value type : String
   - Default : is_outlier_
6. **group_by**: Columns to group by

#### Outputs: table, model

