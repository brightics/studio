## Format
### Python
```python
from brightics.function.regression import glm_predict
res = glm_predict(prediction_col = ,group_by = )
res['out_table']
```

## Description
Predict data using a GLM model.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction column name**: Column name for prediction
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

