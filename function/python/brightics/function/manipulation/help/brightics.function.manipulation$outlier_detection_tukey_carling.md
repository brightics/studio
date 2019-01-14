## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_tukey_carling
res = outlier_detection_tukey_carling(input_cols = ,outlier_method = ,multiplier = ,number_of_removal = ,result_type = ,new_column_prefix = ,group_by = )
res['out_table']
res['model']
```

## Description
Remove outliers. If a value is determined as a outlier, this value is removed from the data.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Column names to remove outlier. Data must be number type(Double, Long, Integer).
   - Allowed column type : Integer, Double, Long, Float, Decimal
2. **Outlier Method**: Outlier-method option (carling, tukey) Two Outlier Removal methods are provided.
1. carling: Remove Y s.t Y < (M - multiplier*IQR) or Y > (M + multiplier*IQR) where IQR = Q3-Q1
2. tukey: Remove Y s.t Y < (Q1 - multiplier*IQR) or Y > (Q3 + multiplier*IQR) where IQR = Q3-Q1
   - Available items
      - tukey (default)
      - carling
3. **Multiplier**: Multiplier value used for outlier method(see explanation of 'Outlier-Method'). Double type value is required. (default of tukey : 1.5, default of carling : 2.3)
   - Value type : Double
   - Default : value>=0 (tukey : 1.5, carling : 2.3)
4. **Number of Outliers in a Row**: The minimum number of outliers in a row that makes a given sample outlier. (default=1)
   - Value type : Integer
   - Default : 1
5. **Result**: Can choose result table between inlier/outlier detection table, filtered table that outliers are removed, or both. (default = Add Prediction)
   - Available items
      - Remove Outliers
      - Add Prediction (default)
      - Both
6. **New Column Prefix**: 
   - Value type : String
   - Default : is_outlier_
7. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column names to remove outlier. Data must be number type(Double, Long, Integer).
   - Allowed column type : Integer, Double, Long, Float, Decimal
2. **outlier_method**: Outlier-method option (carling, tukey) Two Outlier Removal methods are provided.
1. carling: Remove Y s.t Y < (M - multiplier*IQR) or Y > (M + multiplier*IQR) where IQR = Q3-Q1
2. tukey: Remove Y s.t Y < (Q1 - multiplier*IQR) or Y > (Q3 + multiplier*IQR) where IQR = Q3-Q1
   - Available items
      - tukey (default)
      - carling
3. **multiplier**: Multiplier value used for outlier method(see explanation of 'Outlier-Method'). Double type value is required. (default of tukey : 1.5, default of carling : 2.3)
   - Value type : Double
   - Default : value>=0 (tukey : 1.5, carling : 2.3)
4. **number_of_removal**: The minimum number of outliers in a row that makes a given sample outlier. (default=1)
   - Value type : Integer
   - Default : 1
5. **result_type**: Can choose result table between inlier/outlier detection table, filtered table that outliers are removed, or both. (default = Add Prediction)
   - Available items
      - remove_outliers
      - add_prediction (default)
      - both
6. **new_column_prefix**: 
   - Value type : String
   - Default : is_outlier_
7. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

