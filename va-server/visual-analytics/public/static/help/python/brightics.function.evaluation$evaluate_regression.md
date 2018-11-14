## Format
### Python
```python
from brightics.function.evaluation import evaluate_regression
res = evaluate_regression(label_col = ,prediction_col = ,group_by = )
res['result']
```

## Description
This function computes, the R^2 score, the mean squared error, the mean absolute error, the median absolute error, the explained variance.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Double, Long, Integer, Float
2. **Prediction Column**<b style="color:red">*</b>: Prediction column.
   - Allowed column type : Double, Long, Integer, Float
3. **Group By**: Columns to group by

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : Double, Long, Integer, Float
2. **prediction_col**<b style="color:red">*</b>: Prediction column.
   - Allowed column type : Double, Long, Integer, Float
3. **group_by**: Columns to group by

#### Outputs
1. **result**: model

