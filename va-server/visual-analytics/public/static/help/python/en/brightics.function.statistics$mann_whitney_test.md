## Format
### Python
```python
from brightics.function.statistics import mann_whitney_test
res = mann_whitney_test(table = ,response_col = ,factor_col = ,use_continuity = ,group_by = )
res['result']
```

## Description
In statistics, the Mann–Whitney U test (also called the Mann–Whitney–Wilcoxon (MWW), Wilcoxon rank-sum test, or Wilcoxon–Mann–Whitney test) is a nonparametric test of the null hypothesis that it is equally likely that a randomly selected value from one sample will be less than or greater than a randomly selected value from a second sample.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Column**<b style="color:red">*</b>: Response column
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
3. **Use Continuity**: Whether a continuity correction (1/2.) should be taken into account.
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_col**<b style="color:red">*</b>: Response column
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
3. **use_continuity**: Whether a continuity correction (1/2.) should be taken into account.
4. **group_by**: Columns to group by

#### Outputs: model

