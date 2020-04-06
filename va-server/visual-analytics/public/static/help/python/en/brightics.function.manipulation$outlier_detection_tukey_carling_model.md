## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_tukey_carling_model
res = outlier_detection_tukey_carling_model(table = ,model = ,new_column_prefix = )
res['out_table']
```

## Description
Predict the labels (inlier, outlier) of input array according to Tueky / Carling method.
This method allows to generalize prediction to new observations (not in the training set).

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **New Column Prefix**: Column prefix for new columns.
   - Value type : String
   - Default : is_outlier_

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **new_column_prefix**: Column prefix for new columns.
   - Value type : String
   - Default : is_outlier_

#### Outputs: table

