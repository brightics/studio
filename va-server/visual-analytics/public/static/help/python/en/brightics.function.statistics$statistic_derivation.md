## Format
### Python
```python
from brightics.function.statistics import statistic_derivation
res = statistic_derivation(table = ,input_cols = ,statistics = ,percentile_amounts = ,trimmed_mean_amounts = ,group_by = )
res['out_table']
```

## Description
Compute descriptive statistics by group and save the results in new columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Target Statistic**<b style="color:red">*</b>: Target statistic function names.
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
3. **Percentile Amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100
4. **Trimmed Mean Amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **statistics**<b style="color:red">*</b>: Target statistic function names.
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
3. **percentile_amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100
4. **trimmed_mean_amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **group_by**: Columns to group by

#### Outputs: table

