## Format
### Python
```python
from brightics.function.statistics import levenes_test
res = levenes_test(table = ,response_cols = ,factor_col = ,center = ,proportiontocut = ,group_by = )
res['result']
```

## Description
In statistics, Levene's test is an inferential statistic used to assess the equality of variances for a variable calculated for two or more groups.[1] Some common statistical procedures assume that variances of the populations from which different samples are drawn are equal. Levene's test assesses this assumption. It tests the null hypothesis that the population variances are equal (called homogeneity of variance or homoscedasticity). If the resulting p-value of Levene's test is less than some significance level (typically 0.05), the obtained differences in sample variances are unlikely to have occurred based on random sampling from a population with equal variances. Thus, the null hypothesis of equal variances is rejected and it is concluded that there is a difference between the variances in the population. 

Reference:
+ <https://en.wikipedia.org/wiki/Levene%27s_test>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
3. **Center**: Which function of the dataa to use in the test. The default is 'median'.
   - Available items
      - MEAN
      - MEDIAN (default)
      - TRIMMED
4. **Proportion to Cut**: When center is 'trimmed', this gives the proportion of data points to cut from each end.
   - Value type : Double
   - Default : 0.05 (value >= 0)
5. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
3. **center**: Which function of the dataa to use in the test. The default is 'median'.
   - Available items
      - mean
      - median (default)
      - trimmed
4. **proportiontocut**: When center is 'trimmed', this gives the proportion of data points to cut from each end.
   - Value type : Double
   - Default : 0.05 (value >= 0)
5. **group_by**: Columns to group by

#### Outputs: model

