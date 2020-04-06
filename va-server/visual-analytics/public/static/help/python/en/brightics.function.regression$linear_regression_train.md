## Format
### Python
```python
from brightics.function.regression import linear_regression_train
res = linear_regression_train(table = ,feature_cols = ,label_col = ,fit_intercept = ,is_vif = ,vif_threshold = ,group_by = )
res['model']
```

## Description
This function fits a linear regression model using the given data. For a given data with $n$ features, a linear regression is a linear function that minimizes the total error(L2, L1, ..).

https://en.wikipedia.org/wiki/Linear_regression

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **Fit Intercept**: Whether to fit an intercept
4. **VIF**: Variance Inflation Factor
5. **VIF Threshold**: Whether to check VIF excceds threshold
   - Value type : Double
   - Default : 10 (1 <= value)
6. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **fit_intercept**: Whether to fit an intercept
4. **is_vif**: Variance Inflation Factor
5. **vif_threshold**: Whether to check VIF excceds threshold
   - Value type : Double
   - Default : 10 (1 <= value)
6. **group_by**: Columns to group by

#### Outputs: model

