## Format
### Python
```python
from brightics.function.timeseries import holt_winters_predict
res = holt_winters_predict(model = ,prediction_num = )
res['model']
res['out_table']
```

## Description
Given a seasonal time series data and a Holt-Winters model, this function predicts the data.

---

## Properties
### VA
#### Inputs: model

#### Parameters
1. **Prediction Number**<b style="color:red">*</b>: Number of rows to predict.
   - Value type : Integer
   - Default : (value >= 1)

#### Outputs: model, table

### Python
#### Inputs: model

#### Parameters
1. **prediction_num**<b style="color:red">*</b>: Number of rows to predict.
   - Value type : Integer
   - Default : (value >= 1)

#### Outputs: model, table

