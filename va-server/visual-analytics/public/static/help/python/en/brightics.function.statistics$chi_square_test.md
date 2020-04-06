## Format
### Python
```python
from brightics.function.statistics import chi_square_test_for_independence
res = chi_square_test_for_independence(response_cols = ,factor_col = ,correction = ,lambda_ = )
res['model']
res['result_table']
```

## Description
The Chi-Square Test of Independence determines whether there is an association between categorical variables (i.e., whether the variables are independent or related). This function conduct Pearson's independence test for every feature against the label.

Reference:

https://en.wikipedia.org/wiki/Pearson's_chi-squared_test#Testing_for_statistical_independence

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns. At least one column should be chosen.
2. **Label Column**<b style="color:red">*</b>: Label Column
3. **Correction**: If True, and the degrees of freedom is 1, apply Yates¡¯ correction for continuity. The effect of the correction is to adjust each observed value by 0.5 towards the corresponding expected value.
4. **Lambda**: By default, the statistic computed in this test is Pearson¡¯s chi-squared statistic. Lambda allows a statistic from the Cressie-Read power divergence family to be used instead. See power_divergence for details.
   - Available items
      - Pearson (default)
      - Log-likelihood
      - Freeman-tukey
      - Mod-log-likelihood
      - Neyman
      - Cressie-read

#### Outputs
1. **model**: model
2. **result_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Feature columns. At least one column should be chosen.
2. **factor_col**<b style="color:red">*</b>: Label Column
3. **correction**: If True, and the degrees of freedom is 1, apply Yates¡¯ correction for continuity. The effect of the correction is to adjust each observed value by 0.5 towards the corresponding expected value.
4. **lambda_**: By default, the statistic computed in this test is Pearson¡¯s chi-squared statistic. Lambda allows a statistic from the Cressie-Read power divergence family to be used instead. See power_divergence for details.
   - Available items
      - pearson (default)
      - log-likelihood
      - freeman-tukey
      - mod-log-likelihood
      - neyman
      - cressie-read

#### Outputs
1. **model**: model
2. **result_table**: table

