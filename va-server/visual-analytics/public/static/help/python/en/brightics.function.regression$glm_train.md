## Format
### Python
```python
from brightics.function.regression import glm_train
res = glm_train(table = ,feature_cols = ,label_col = ,family = ,link = ,fit_intercept = ,group_by = )
res['model']
```

## Description
This function provides a generalized linear model which includes linear, logistic and Poisson regressions depending on the distribution types.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **Family**: Family of distributions
4. **Link**: Link functions
5. **Fit Intercept**: Whether to fit an intercept
6. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **family**: Family of distributions
4. **link**: Link functions
5. **fit_intercept**: Whether to fit an intercept
6. **group_by**: Columns to group by

#### Outputs: model

