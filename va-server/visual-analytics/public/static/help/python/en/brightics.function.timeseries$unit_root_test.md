## Format
### Python
```python
from brightics.function.timeseries import unit_root_test
res = unit_root_test(table = ,input_col = ,maxlag = ,regression = ,autolag = ,group_by = )
res['model']
```

## Description
Augmented Dickey-Fuller unit root test

The Augmented Dickey-Fuller test can be used to test for a unit root in a univariate process in the presence of serial correlation.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Data Series**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Maximum lag**: Maximum lag which is included in test, default 12*(nobs/100)^{1/4} where nobs is the Number of observations used for the ADF regression and calculation of the critical values.
   - Value type : Integer
   - Default : 12*(nobs/100)^{1/4} (1 <= value)
3. **Regression**: Constant and trend order to include in regression
   - Available items
      - Constant only (default)
      - Constant and linear trend
      - Constant, and linear and quadratic trend
      - No constant, no trend
4. **Auto lag**:         * if None, then maxlag lags are used
        * if 'AIC' (default) or 'BIC', then the number of lags is chosen
          to minimize the corresponding information criterion
        * 'T-statistic' based choice of maxlag.  Starts with maxlag and drops a
          lag until the t-statistic on the last lag length is significant
          using a 5%-sized test
   - Available items
      - AIC (default)
      - BIC
      - T-statistic
      - None
5. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **maxlag**: Maximum lag which is included in test, default 12*(nobs/100)^{1/4} where nobs is the Number of observations used for the ADF regression and calculation of the critical values.
   - Value type : Integer
   - Default : 12*(nobs/100)^{1/4} (1 <= value)
3. **regression**: Constant and trend order to include in regression
   - Available items
      - c (default)
      - ct
      - ctt
      - nc
4. **autolag**:         * if None, then maxlag lags are used
        * if 'AIC' (default) or 'BIC', then the number of lags is chosen
          to minimize the corresponding information criterion
        * 'T-statistic' based choice of maxlag.  Starts with maxlag and drops a
          lag until the t-statistic on the last lag length is significant
          using a 5%-sized test
   - Available items
      - AIC (default)
      - BIC
      - t-stat
      - None
5. **group_by**: Columns to group by

#### Outputs: model

