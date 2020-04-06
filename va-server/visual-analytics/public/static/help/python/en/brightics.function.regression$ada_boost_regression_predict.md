## Format
### Python
```python
from brightics.function.regression import ada_boost_regression_predict
res = ada_boost_regression_predict(table = ,model = ,pred_col_name = )
res['out_table']
```

## Description
Predict data using an adaptive boost regression model.

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
1. **pred_col_name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

