## Format
### Python
```python
from brightics.function.timeseries import auto_arima_train
res = auto_arima_train(table = ,input_cols = ,max_p = ,max_q = ,d = ,group_by = )
res['model']
```

## Description
Fit the best non-seasonal ARIMA(p,d,q) model for a given time series data, and non-negative integers max P, max Q, D. To fit the ARMA(p,q) model, set D -> 0.

Reference:
+ <https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Max p**: The maximum p to test for ARIMA(p,d,q).
   - Value type : Integer
   - Default : 5 (value >= 2)
3. **Max q**: The maximum q to test for ARIMA(p,d,q).
   - Value type : Integer
   - Default : 5 (value >= 2)
4. **d (the degree of differencing)**: The degree of differencing. If empty, this will be selected automatically.
   - Value type : Integer
   - Default : None (0 <= value <= 2)
5. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **max_p**: The maximum p to test for ARIMA(p,d,q).
   - Value type : Integer
   - Default : 5 (value >= 2)
3. **max_q**: The maximum q to test for ARIMA(p,d,q).
   - Value type : Integer
   - Default : 5 (value >= 2)
4. **d**: The degree of differencing. If empty, this will be selected automatically.
   - Value type : Integer
   - Default : None (0 <= value <= 2)
5. **group_by**: Columns to group by

#### Outputs: model

