## Format
### Python
```python
from brightics.function.regression import linear_regression_train
res = linear_regression_train(feature_cols = ,label_col = ,fit_intercept = ,group_by = )
res['model']
```

## Description
This function fits a linear regression model using the given data. For a given data with $n$ features, a linear regression is a linear function that minimizes the total error(L2, L1, ..).

https://en.wikipedia.org/wiki/Linear_regression

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature columns
   - Allowed column type : Integer, Long, Float, Double
2. **Label column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
3. **Fit Intercept**: Whether to fit an intercept
4. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature columns
   - Allowed column type : Integer, Long, Float, Double
2. **label_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
3. **fit_intercept**: Whether to fit an intercept
4. **group_by**: Columns to group by

#### Outputs
1. **model**: model

