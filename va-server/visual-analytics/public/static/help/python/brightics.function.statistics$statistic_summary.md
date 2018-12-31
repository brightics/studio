## Format
### Python
```python
from brightics.function.statistics import statistic_summary
res = statistic_summary(input_cols = ,statistics = ,percentile_amounts = ,trimmed_mean_amounts = ,group_by = )
res['out_table']
```

## Description
This function reports group-wise summary statistics for selected columns such as sum, max, min, average, variance, total count and so on.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**: Column names to be summarized. It should be of double, integer or long types.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Target statistic**: Target statistic function names. Available statistics are Sum, Max, Min, Average, Variance, Standard Deviation, Number of value, Number of row, NaN Count, Median, Q1, Q3.
3. **Percentile Amounts**: 
4. **Trimmed Mean Amounts**: 
5. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**: Column names to be summarized. It should be of double, integer or long types.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **statistics**: Target statistic function names. Available statistics are Sum, Max, Min, Average, Variance, Standard Deviation, Number of value, Number of row, NaN Count, Median, Q1, Q3.
3. **percentile_amounts**: 
4. **trimmed_mean_amounts**: 
5. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

