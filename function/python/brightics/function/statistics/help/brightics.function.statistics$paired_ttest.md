## Format
### Python
```python
from brightics.function.statistics import paired_ttest
res = paired_ttest(first_column = ,second_column = ,hypothesized_difference = ,confidence_level = ,alternative = ,group_by = )
res['model']
```

## Description
In statistics, a paired difference test is a type of location test that is used when comparing two sets of measurements to assess whether their population means differ. A paired difference test uses additional information about the sample that is not present in an ordinary unpaired testing situation, either to increase the statistical power, or to reduce the effects of confounders. This function conducts the paired T-test.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **First Column**<b style="color:red">*</b>: The first column
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **Second Column**<b style="color:red">*</b>: The second column
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
3. **Hypothesized Difference**: Hypothesized difference. Default: 0
   - Value type : Double
   - Default : 0
4. **Confidence Level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0<=value<=1)
5. **Alternatives**<b style="color:red">*</b>: Alternative hypothesis.
   - Available items
      - Greater
      - Less
      - Two Sided
6. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **first_column**<b style="color:red">*</b>: The first column
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **second_column**<b style="color:red">*</b>: The second column
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
3. **hypothesized_difference**: Hypothesized difference. Default: 0
   - Value type : Double
   - Default : 0
4. **confidence_level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0<=value<=1)
5. **alternative**<b style="color:red">*</b>: Alternative hypothesis.
   - Available items
      - greater
      - less
      - twosided
6. **group_by**: Columns to group by

#### Outputs
1. **model**: model

