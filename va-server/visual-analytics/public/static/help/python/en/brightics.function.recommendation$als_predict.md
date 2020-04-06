## Format
### Python
```python
from brightics.function.recommendation import als_predict
res = als_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
This function predicts ratings for user-item pairs.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
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

