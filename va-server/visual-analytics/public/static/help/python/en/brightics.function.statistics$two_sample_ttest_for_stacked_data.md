## Format
### Python
```python
from brightics.function.statistics import two_sample_ttest_for_stacked_data
res = two_sample_ttest_for_stacked_data(table = ,response_cols = ,factor_col = ,alternatives = ,confi_level = ,first = ,second = ,hypo_diff = ,equal_vari = ,group_by = )
res['model']
res['out_table']
```

## Description
"The independent samples t-test is used when two separate sets of independent and identically distributed samples are obtained, one from each of the two populations being compared. For example, suppose we are evaluating the effect of a medical treatment, and we enroll 100 subjects into our study, then randomly assign 50 subjects to the treatment group and 50 subjects to the control group. In this case, we have two independent samples and would use the unpaired form of the t-test. The randomization is not essential here ? if we contacted 100 people by phone and obtained each person's age and gender, and then used a two-sample t-test to see whether the mean ages differ by gender, this would also be an independent samples t-test, even though the data are observational."

This function conduct the two sampled T-test for stacked dataset.

Reference:

https://en.wikipedia.org/wiki/Student's_t-test#Independent_two-sample_t-test

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **Alternatives**<b style="color:red">*</b>: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
   - Available items
      - Greater
      - Less
      - Two Sided (default)
4. **Confidence Level**: Double Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **First**: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **Second**: The second label in the label column
   - Value type : String
   - Default : Enter value
7. **Hypothesized Difference**: Double Hypothesized difference. Default: 0
   - Value type : Integer
   - Default : 0
8. **Assume Equal Variances**: When this parameter is true, this function uses an estimator of the pooled standard deviation. When this parameter is false, this function conducts Welch's t-test. If the parameter is auto, this function conduct F-test with 0.95 confidence level and using the result this function chooses the parameter.
   - Available items
      - Auto (default)
      - True
      - False
9. **Group By**: Columns to group by

#### Outputs: model, table

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : String, Integer, Double, Long, Float, Boolean
3. **alternatives**<b style="color:red">*</b>: Array[String] Alternative hypothesis. "two_sided","less","greater" are possible. 
   - Available items
      - larger
      - smaller
      - two-sided (default)
4. **confi_level**: Double Confidence level. Default: 0.95
   - Value type : Double
   - Default : 0.95 (0 <= value <= 1)
5. **first**: The first label in the label column
   - Value type : String
   - Default : Enter value
6. **second**: The second label in the label column
   - Value type : String
   - Default : Enter value
7. **hypo_diff**: Double Hypothesized difference. Default: 0
   - Value type : Integer
   - Default : 0
8. **equal_vari**: When this parameter is true, this function uses an estimator of the pooled standard deviation. When this parameter is false, this function conducts Welch's t-test. If the parameter is auto, this function conduct F-test with 0.95 confidence level and using the result this function chooses the parameter.
   - Available items
      - auto (default)
      - pooled
      - unequal
9. **group_by**: Columns to group by

#### Outputs: model, table

