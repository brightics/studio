## Format
### Python
```python
from brightics.function.regression import pls_regression_predict
res = pls_regression_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
Predict data using a trained PLS model

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

