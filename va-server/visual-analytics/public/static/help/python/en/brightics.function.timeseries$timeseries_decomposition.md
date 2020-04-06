## Format
### Python
```python
from brightics.function.timeseries import timeseries_decomposition
res = timeseries_decomposition(table = ,input_col = ,frequency = ,model_type = ,filteration = ,two_sided = ,extrapolate_trend = ,group_by = )
res['out_table']
res['model']
```

## Description
Decomposes a time series data into trend, seasonal and residual. The function gives graphs of observed, trend, seasonal, and residual. This function does seasonal decomposition using moving averages. 

Reference:
+ <https://en.wikipedia.org/wiki/Decomposition_of_time_series>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Double, Long, Float
2. **Frequency**<b style="color:red">*</b>: Frequency of the series.
   - Value type : Integer
   - Default : (value >= 1)
3. **Model Type**: Choose the type of the variance of the data. If the standard deviation is proportional to the mean size of the data, choose 'Multiplicative'.
   - Available items
      - Additive (default)
      - Multiplicative
4. **Filteration**: The filter coefficients for filtering out the trend component. The concrete moving average method used in filtering is determined by 'Two-sided'.
5. **Two-sided**: The moving average method used in filtering. If True (default), a centered moving average is computed using the filteration. If False, the filter coefficients are for past values only.
6. **Extrapolate Trend**: If set to > 0, the trend resulting from the convolution is linear least-squares extrapolated on both ends (or the single one if 'Two-sided' is False) considering this many (+1) closest points. If set to be same as frequency, use frequency closest points. Setting this parameter results in no NaN values in trend or residual components.
   - Value type : Integer
   - Default : 0 (value >= 0)
7. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Double, Long, Float
2. **frequency**<b style="color:red">*</b>: Frequency of the series.
   - Value type : Integer
   - Default : (value >= 1)
3. **model_type**: Choose the type of the variance of the data. If the standard deviation is proportional to the mean size of the data, choose 'Multiplicative'.
   - Available items
      - additive (default)
      - multiplicative
4. **filteration**: The filter coefficients for filtering out the trend component. The concrete moving average method used in filtering is determined by 'Two-sided'.
5. **two_sided**: The moving average method used in filtering. If True (default), a centered moving average is computed using the filteration. If False, the filter coefficients are for past values only.
6. **extrapolate_trend**: If set to > 0, the trend resulting from the convolution is linear least-squares extrapolated on both ends (or the single one if 'Two-sided' is False) considering this many (+1) closest points. If set to be same as frequency, use frequency closest points. Setting this parameter results in no NaN values in trend or residual components.
   - Value type : Integer
   - Default : 0 (value >= 0)
7. **group_by**: Columns to group by

#### Outputs: table, model

