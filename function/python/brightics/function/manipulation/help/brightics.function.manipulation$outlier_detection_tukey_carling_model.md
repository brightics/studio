## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_tukey_carling_model
res = outlier_detection_tukey_carling_model(new_column_prefix = ,group_by = )
res['out_table']
```

## Description
Predict the labels (inlier, outlier) of input array according to Tueky / Carling method.
This method allows to generalize prediction to new observations (not in the training set).

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **New Column Prefix**: 
   - Value type : String
   - Default : is_outlier_
2. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **new_column_prefix**: 
   - Value type : String
   - Default : is_outlier_
2. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

