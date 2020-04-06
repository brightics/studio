## Format
### Python
```python
from brightics.function.statistics import chi_square_test_of_independence
res = chi_square_test_of_independence(table = ,feature_cols = ,label_col = ,correction = ,group_by = )
res['model']
```

## Description
The Chi-square Test of Independence determines whether there is an association between categorical variables (i.e., whether the variables are independent or related). This function conduct Pearson's independence test for every feature against the label. 

Reference:
+ <https://en.wikipedia.org/wiki/Pearson's_chi-squared_test#Testing_for_statistical_independence>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, String
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **Correction**: If True, and the degrees of freedom is 1, apply Yates' correction for continuity. The effect of the correction is to adjust each observed value by 0.5 towards the corresponding expected value.
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, String
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **correction**: If True, and the degrees of freedom is 1, apply Yates' correction for continuity. The effect of the correction is to adjust each observed value by 0.5 towards the corresponding expected value.
4. **group_by**: Columns to group by

#### Outputs: model

