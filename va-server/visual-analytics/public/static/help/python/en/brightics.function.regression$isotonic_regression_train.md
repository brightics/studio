## Format
### Python
```python
from brightics.function.regression import isotonic_regression_train
res = isotonic_regression_train(table = ,feature_col = ,label_col = ,increasing = ,group_by = )
res['model']
```

## Description
This function fits a isotonic regression model using the given 1D data.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **Increasing**<b style="color:red">*</b>: Increasing or decreasing label
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **feature_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double
3. **increasing**<b style="color:red">*</b>: Increasing or decreasing label
4. **group_by**: Columns to group by

#### Outputs: model

