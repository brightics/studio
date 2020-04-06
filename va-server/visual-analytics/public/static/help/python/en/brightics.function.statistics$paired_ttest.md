## Format
### Python
```python
from brightics.function.statistics import paired_ttest
res = paired_ttest(table = ,first_column = ,second_column = ,hypothesized_difference = ,confidence_level = ,alternative = ,group_by = )
res['model']
```

## Description
In statistics, a paired difference test is a type of location test that is used when comparing two sets of measurements to assess whether their population means differ. A paired difference test uses additional information about the sample that is not present in an ordinary unpaired testing situation, either to increase the statistical power, or to reduce the effects of confounders. This function conducts the paired T-test.

Reference:
+ <https://en.wikipedia.org/wiki/Student%27s_t-test#Dependent_t-test_for_paired_samples>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **First Column**<b style="color:red">*</b>: The first column to conduct paired T-test.
   - Allowed column type : Integer, Long, Float, Double
2. **Second Column**<b style="color:red">*</b>: The second column to conduct paired T-test.
   - Allowed column type : Integer, Long, Float, Double
3. **Hypothesized Difference**: Hypothesized difference. Default: 0
   - Value type : Double
   - Default : 0
4. **Confidence Level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0.0 <= value <= 1.0)
5. **Alternatives**<b style="color:red">*</b>: Alternative hypothesis.
   - Available items
      - Greater
      - Less
      - Two Sided (default)
6. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **first_column**<b style="color:red">*</b>: The first column to conduct paired T-test.
   - Allowed column type : Integer, Long, Float, Double
2. **second_column**<b style="color:red">*</b>: The second column to conduct paired T-test.
   - Allowed column type : Integer, Long, Float, Double
3. **hypothesized_difference**: Hypothesized difference. Default: 0
   - Value type : Double
   - Default : 0
4. **confidence_level**: Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0.0 <= value <= 1.0)
5. **alternative**<b style="color:red">*</b>: Alternative hypothesis.
   - Available items
      - greater
      - less
      - twosided (default)
6. **group_by**: Columns to group by

#### Outputs: model

