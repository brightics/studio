## Format
### Python
```python
from brightics.function.evaluation import evaluate_regression
res = evaluate_regression(table = ,label_col = ,prediction_col = ,group_by = )
res['result']
```

## Description
This function computes, the R^2 score, the mean squared error, the mean absolute error, the median absolute error, the explained variance.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Double, Long, Integer, Float
2. **Prediction Column**<b style="color:red">*</b>: Column name for prediction
   - Allowed column type : Double, Long, Integer, Float
3. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Double, Long, Integer, Float
2. **prediction_col**<b style="color:red">*</b>: Column name for prediction
   - Allowed column type : Double, Long, Integer, Float
3. **group_by**: Columns to group by

#### Outputs: model

