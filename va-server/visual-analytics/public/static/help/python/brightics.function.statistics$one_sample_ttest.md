## Format
### Python
```python
from brightics.function.statistics import one_sample_ttest
res = one_sample_ttest(input_cols = ,alternatives = ,hypothesized_mean = ,conf_level = ,group_by = )
res['model']
res['out_table']
```

## Description
One Sample T Test is used to compare the mean of one sample to a known standard (or theoretical/hypothetical) mean.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Alternatives**: The alternative hypothesis. Allowed value is one of Two Sided (default), Greater or Less.
3. **Hypothesized Mean**: The theoretical mean. Default is 0 but you can change it.
   - Value type : Double
   - Default : 0
4. **Confidence Level**: The frequency (i.e. the proportion) of possible confidence intervals that contain the true value of the unknown population parameter. Default is 0.95 but you can change it.
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **Group By**: Columns to group by

#### Outputs
1. **model**: model
2. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **alternatives**: The alternative hypothesis. Allowed value is one of Two Sided (default), Greater or Less.
3. **hypothesized_mean**: The theoretical mean. Default is 0 but you can change it.
   - Value type : Double
   - Default : 0
4. **conf_level**: The frequency (i.e. the proportion) of possible confidence intervals that contain the true value of the unknown population parameter. Default is 0.95 but you can change it.
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **group_by**: Columns to group by

#### Outputs
1. **model**: model
2. **out_table**: table

