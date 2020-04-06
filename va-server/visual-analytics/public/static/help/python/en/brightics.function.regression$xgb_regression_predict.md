## Format
### Python
```python
from brightics.function.regression import xgb_regression_predict
res = xgb_regression_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
Using the result of 'XGB Regression Train', this function predicts with the input table.

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

