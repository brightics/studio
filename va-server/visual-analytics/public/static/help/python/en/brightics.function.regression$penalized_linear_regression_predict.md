## Format
### Python
```python
from brightics.function.regression import penalized_linear_regression_predict
res = penalized_linear_regression_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
This function predict data using the trained penalized linear regression model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **New Column Name**: Column name for prediction
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

