## Format
### Python
```python
from brightics.function.statistics import kruskal_wallis_test
res = kruskal_wallis_test(table = ,response_cols = ,factor_col = ,nan_policy = ,group_by = )
res['result']
```

## Description
The Kruskal–Wallis test by ranks, Kruskal–Wallis H test (named after William Kruskal and W. Allen Wallis), or one-way ANOVA on ranks is a non-parametric method for testing whether samples originate from the same distribution.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
3. **Nan Policy**: Defines how to handle when input contains nan
   - Available items
      - propagate (default)
      - raise
      - omit
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
3. **nan_policy**: Defines how to handle when input contains nan
   - Available items
      - propagate’ (default)
      - raise
      - omit
4. **group_by**: Columns to group by

#### Outputs: model

