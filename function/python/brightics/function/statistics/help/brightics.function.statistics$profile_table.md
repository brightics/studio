## Format
### Python
```python
from brightics.function.statistics import profile_table
res = profile_table(bins = ,check_correlation = ,correlation_threshold = ,correlation_overrides = ,group_by = )
res['result']
```

## Description
This function profiles given table. This function uses pandas_profiling package.

Reference:
+ <https://github.com/pandas-profiling/pandas-profiling>

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Bins**: Number of bins in histogram.
   - Value type : Integer
2. **Check Correlation**: Whether or not to check correlation.
3. **Correlation Threshold**: Threshold to determine if the variable pair is correlated.
   - Value type : Double
4. **Correlation Overrides**: Variable names not to be rejected because they are correlated.
5. **Group By**: Columns to group by

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **bins**: Number of bins in histogram.
   - Value type : Integer
2. **check_correlation**: Whether or not to check correlation.
3. **correlation_threshold**: Threshold to determine if the variable pair is correlated.
   - Value type : Double
4. **correlation_overrides**: Variable names not to be rejected because they are correlated.
5. **group_by**: Columns to group by

#### Outputs
1. **result**: model

