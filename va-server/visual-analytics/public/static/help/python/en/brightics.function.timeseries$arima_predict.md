## Format
### Python
```python
from brightics.function.timeseries import arima_predict
res = arima_predict(model = ,prediction_num = )
res['table']
```

## Description
This function generate predictions for ARIMA model.

---

## Properties
### VA
#### Inputs: model

#### Parameters
1. **Prediction Number**<b style="color:red">*</b>: Number of rows to predict.
   - Value type : Integer
   - Default : (value >= 1)

#### Outputs: table

### Python
#### Inputs: model

#### Parameters
1. **prediction_num**<b style="color:red">*</b>: Number of rows to predict.
   - Value type : Integer
   - Default : (value >= 1)

#### Outputs: table

