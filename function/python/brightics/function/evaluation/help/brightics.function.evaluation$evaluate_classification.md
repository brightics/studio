## Format
### Python
```python
from brightics.function.evaluation import evaluate_classification
res = evaluate_classification(label_col = ,prediction_col = ,group_by = )
res['result']
```

## Description
This function computes the F1 score, the accuracy, the precision, the recall.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Double, Long, Integer, String
2. **Prediction Column**<b style="color:red">*</b>: Prediction column.
   - Allowed column type : Double, Long, Integer, String
3. **Group By**: Columns to group by

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : Double, Long, Integer, String
2. **prediction_col**<b style="color:red">*</b>: Prediction column.
   - Allowed column type : Double, Long, Integer, String
3. **group_by**: Columns to group by

#### Outputs
1. **result**: model

