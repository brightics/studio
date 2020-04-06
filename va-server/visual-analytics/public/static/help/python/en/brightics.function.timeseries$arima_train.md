## Format
### Python
```python
from brightics.function.timeseries import arima_train
res = arima_train(table = ,input_cols = ,p = ,d = ,q = ,intercept = ,group_by = )
res['model']
```

## Description
This function calculate Non-seasonal ARIMA models which are generally denoted ARIMA(p,d,q) where parameters p, d, and q are non-negative integers.

Reference:
+ <https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **p**<b style="color:red">*</b>: The order (number of time lags) of the autoregressive model.
   - Value type : Integer
   - Default : (value >=0)
3. **d**<b style="color:red">*</b>: The degree of differencing (the number of times the data have had past values subtracted).
   - Value type : Integer
   - Default : (0 <= value <= 2)
4. **q**<b style="color:red">*</b>: The order of the moving-average model.
   - Value type : Integer
   - Default : (value >=0)
5. **Intercept**: The trend parameter.
6. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **p**<b style="color:red">*</b>: The order (number of time lags) of the autoregressive model.
   - Value type : Integer
   - Default : (value >=0)
3. **d**<b style="color:red">*</b>: The degree of differencing (the number of times the data have had past values subtracted).
   - Value type : Integer
   - Default : (0 <= value <= 2)
4. **q**<b style="color:red">*</b>: The order of the moving-average model.
   - Value type : Integer
   - Default : (value >=0)
5. **intercept**: The trend parameter.
6. **group_by**: Columns to group by

#### Outputs: model

