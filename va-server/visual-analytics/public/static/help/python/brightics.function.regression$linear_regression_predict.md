## Format
### Python
```python
from brightics.function.regression import linear_regression_predict
res = linear_regression_predict(prediction_col = ,group_by = )
res['out_table']
```

## Description
Predict data using a linear regression model.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
   - Value type : String
2. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
2. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

