## Format
### Python
```python
from brightics.function.timeseries import autocorrelation
res = autocorrelation(table = ,input_col = ,nlags = ,conf_level = ,group_by = )
res['model']
```

## Description
Computes the ACF (AutoCorrelation Function) and PACF (Partial AutoCorrelation Function) of a times series. These values can be used to find the Lags p, q of an ARIMA(p,d,q) model.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Double, Integer, Long, Float
2. **Number of Lags**: Number of lags to return autocorrelation for, largest lag for which partial autocorrelation is returned. The default value is 20. This value should be larger or equal to 1.
   - Value type : Integer
   - Default : 20 (value >= 1)
3. **Confidence Level**: If a number is given, the confidence intervals for the given level are returned. For instance if confidence level=.95, 95% confidence intervals are returned where the standard deviation is computed according to Bartlett’s formula.
   - Value type : Double
   - Default : 0.95 (0.0 <= value < 1.0)
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Double, Integer, Long, Float
2. **nlags**: Number of lags to return autocorrelation for, largest lag for which partial autocorrelation is returned. The default value is 20. This value should be larger or equal to 1.
   - Value type : Integer
   - Default : 20 (value >= 1)
3. **conf_level**: If a number is given, the confidence intervals for the given level are returned. For instance if confidence level=.95, 95% confidence intervals are returned where the standard deviation is computed according to Bartlett’s formula.
   - Value type : Double
   - Default : 0.95 (0.0 <= value < 1.0)
4. **group_by**: Columns to group by

#### Outputs: model

