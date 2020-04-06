## Format
### Python
```python
from brightics.function.statistics import ljung_box_test
res = ljung_box_test(table = ,input_cols = ,lags = ,group_by = )
res['result']
```

## Description
The Ljung-Box test is a type of statistical test of whether any of a group of autocorrelations of a time series are different from zero. Instead of testing randomness at each distinct lag, it tests the “overall” randomness based on a number of lags

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Lags**: If lags is an integer then this is taken to be the largest lag that is included, the test result is reported for all smaller lag length. If lags is None, then the default maxlag is ‘min((nobs // 2 - 2), 40)’
   - Value type : Integer
3. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **lags**: If lags is an integer then this is taken to be the largest lag that is included, the test result is reported for all smaller lag length. If lags is None, then the default maxlag is ‘min((nobs // 2 - 2), 40)’
   - Value type : Integer
3. **group_by**: Columns to group by

#### Outputs: model

