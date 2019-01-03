## Format
### Python
```python
from brightics.function.statistics import statistic_derivation
res = statistic_derivation(input_cols = ,statistics = ,percentile_amounts = ,trimmed_mean_amounts = ,group_by = )
res['out_table']
```

## Description
Compute descriptive statistics by group and save the results in new columns.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Column names to be summarized. It should be of double, integer or long types.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Target Statistic**: Target statistic function names.
3. **Percentile Amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100
4. **Trimmed Mean Amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column names to be summarized. It should be of double, integer or long types.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **statistics**: Target statistic function names.
3. **percentile_amounts**: The amounts for the percentile statistics. It is only applied when Percentile is selected in Target Statistics. Allowed range is 0 <= (Percentile Amounts) <= 100
4. **trimmed_mean_amounts**: The amounts for the trimmed mean statistics. It is only applied when Trimmed Mean is selected in Target Statistics. Allowed range is 0.0 <= (Trimmed Mean Amounts) < 0.5.
5. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

