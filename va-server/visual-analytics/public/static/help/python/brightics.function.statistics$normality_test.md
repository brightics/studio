## Format
### Python
```python
from brightics.function.statistics import normality_test
res = normality_test(table = ,input_cols = ,method = ,group_by = )
res['result']
```

## Description
A normality test is used to determine whether sample data has been drawn from a normally distributed population (within some tolerance).

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Method**: Normality test methods. We are currently providing Kolmogorov-Smirnov test, Jarque-Bera test, and Anderson-Darling Test.
   - Available items
      - Kolmogorov-Smirnov test (default)
      - Jarque-Bera test (default)
      - Anderson-Darling test (default)
3. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **method**: Normality test methods. We are currently providing Kolmogorov-Smirnov test, Jarque-Bera test, and Anderson-Darling Test.
   - Available items
      - kstest (default)
      - jarque_bera (default)
      - anderson (default)
3. **group_by**: Columns to group by

#### Outputs: model

