## Format
### Python
```python
from brightics.function.manipulation import outlier_detection_lof_model
res = outlier_detection_lof_model(table = ,model = ,new_column_name = )
res['out_table']
```

## Description
Predict the labels (in: inlier, out: outlier) of input table according to LOF.
This method allows to generalize prediction to new observations (not in the training set). The model to compute the Local Outlier Factor with respect to the training samples should be given.

Reference:
+ <https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.LocalOutlierFactor.html>

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **New Column Name**: Column name for new column.
   - Value type : String
   - Default : is_outlier

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **new_column_name**: Column name for new column.
   - Value type : String
   - Default : is_outlier

#### Outputs: table

