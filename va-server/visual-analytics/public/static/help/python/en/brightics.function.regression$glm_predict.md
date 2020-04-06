## Format
### Python
```python
from brightics.function.regression import glm_predict
res = glm_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
Predict data using a GLM model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Prediction column name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

