## Format
### Python
```python
from brightics.function.statistics import ancova
res = ancova(response_cols = ,factor_col = ,between_col = ,group_by = )
res['result']
```

## Description
"ANCOVA is a general linear model which blends ANOVA and regression. ANCOVA evaluates whether the means of a dependent variable (DV) are equal across levels of a categorical independent variable (IV) often called a treatment, while statistically controlling for the effects of other continuous variables that are not of primary interest, known as covariates (CV) or nuisance variables." 

Reference:
+ <https://en.wikipedia.org/wiki/Analysis_of_covariance>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : Integer, Long, Float, Double
3. **Between Column**<b style="color:red">*</b>: Between column.
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
   - Allowed column type : Integer, Long, Float, Double
3. **between_col**<b style="color:red">*</b>: Between column.
4. **group_by**: Columns to group by

#### Outputs: model

