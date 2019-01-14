## Format
### Python
```python
from brightics.function.timeseries import timeseries_decomposition
res = timeseries_decomposition(input_col = ,frequency = ,model_type = ,filteration = ,two_sided = ,extrapolate_trend = ,group_by = )
res['out_table']
res['model']
```

## Description
Decomposes a time series data into trend, seasonal and residual. The function gives graphs of observed, trend, seasonal, and residual. This function does seasonal decomposition using moving averages.

Reference

https://en.wikipedia.org/wiki/Decomposition_of_time_series

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Choose the column of the time series data to analyze. The input data in the chosen column should be of number type(Double, Long, Integer).
   - Allowed column type : Integer, Double, Long, Decimal, Float
2. **Frequency**<b style="color:red">*</b>: Frequency of the series. Must be used if x is not a pandas object. Overrides default periodicity of x if x is a pandas object with a time series index.
   - Value type : Integer
3. **Model Type**: Choose the type of the variance of the data. If the standard deviation is propertional to the mean size of the data, choose 'Multiplicative'. (default = 'Additive')
   - Available items
      - Additive (default)
      - Multiplicative
4. **Filteration**: The filter coefficients for filtering out the seasonal component. The concrete moving average method used in filtering is determined by two_sided.
5. **Two-Sided**: The moving average method used in filtering. If True (default), a centered moving average is computed using the filteration. If False, the filter coefficients are for past values only.
6. **Extrapolate Trend**: If set to > 0, the trend resulting from the convolution is linear least-squares extrapolated on both ends (or the single one if two_sided is False) considering this many (+1) closest points. If set to �쁣req��, use freq closest points. Setting this parameter results in no NaN values in trend or residual components.
   - Value type : Integer
   - Default : 0
7. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Choose the column of the time series data to analyze. The input data in the chosen column should be of number type(Double, Long, Integer).
   - Allowed column type : Integer, Double, Long, Decimal, Float
2. **frequency**<b style="color:red">*</b>: Frequency of the series. Must be used if x is not a pandas object. Overrides default periodicity of x if x is a pandas object with a time series index.
   - Value type : Integer
3. **model_type**: Choose the type of the variance of the data. If the standard deviation is propertional to the mean size of the data, choose 'Multiplicative'. (default = 'Additive')
   - Available items
      - additive (default)
      - multiplicative
4. **filteration**: The filter coefficients for filtering out the seasonal component. The concrete moving average method used in filtering is determined by two_sided.
5. **two_sided**: The moving average method used in filtering. If True (default), a centered moving average is computed using the filteration. If False, the filter coefficients are for past values only.
6. **extrapolate_trend**: If set to > 0, the trend resulting from the convolution is linear least-squares extrapolated on both ends (or the single one if two_sided is False) considering this many (+1) closest points. If set to �쁣req��, use freq closest points. Setting this parameter results in no NaN values in trend or residual components.
   - Value type : Integer
   - Default : 0
7. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table
2. **model**: model

