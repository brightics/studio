## Format
### Python
```python
from brightics.function.statistics import statistic_summary
res = statistic_summary(table = ,input_cols = ,statistics = ,percentile_amounts = ,trimmed_mean_amounts = ,group_by = ,workers = )
res['out_table']
```

## Description
This function reports group-wise summary statistics for selected columns such as sum, max, min, average, variance, total count and so on.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Target statistic**<b style="color:red">*</b>: Target statistic function names. Available statistics are Sum, Max, Min, Average, Variance, Standard Deviation, Number of value, Number of row, NaN Count, Median, Q1, Q3.
   - Available items
      - Max
      - Min
      - Range
      - Sum
      - Average (default)
      - Variance
      - Standard Deviation
      - Skewness
      - Kurtosis
      - Number of row
      - Number of value
      - Null Count
      - Q1
      - Median
      - Q3
      - IQR
      - Percentile
      - Trimmed Mean
      - Mode
3. **Percentile Amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100.
4. **Trimmed Mean Amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **Group By**: Columns to group by
6. **Workers**: Number of workers on group_by
   - Value type : Integer
   - Default : Enter value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **statistics**<b style="color:red">*</b>: Target statistic function names. Available statistics are Sum, Max, Min, Average, Variance, Standard Deviation, Number of value, Number of row, NaN Count, Median, Q1, Q3.
   - Available items
      - max
      - min
      - range
      - sum
      - avg (default)
      - variance
      - stddev
      - skewness
      - kurtosis
      - nrow
      - num_of_value
      - null_count
      - q1
      - median
      - q3
      - iqr
      - percentile
      - trimmed_mean
      - mode
3. **percentile_amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100.
4. **trimmed_mean_amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **group_by**: Columns to group by
6. **workers**: Number of workers on group_by
   - Value type : Integer
   - Default : Enter value

#### Outputs: table

