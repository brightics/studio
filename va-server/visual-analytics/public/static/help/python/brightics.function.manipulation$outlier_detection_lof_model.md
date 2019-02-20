## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_lof_model
res = outlier_detection_lof_model(new_column_name = ,group_by = )
res['out_table']
```

## Description
Predict the labels (1 inlier, -1 outlier) of input array according to LOF.
This method allows to generalize prediction to new observations (not in the training set). Only available for novelty detection (when novelty is set to True). The query sample or samples to compute the Local Outlier Factor w.r.t. to the training samples should be given.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **New Column Name**: 
   - Value type : String
   - Default : is_outlier
2. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **new_column_name**: 
   - Value type : String
   - Default : is_outlier
2. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

