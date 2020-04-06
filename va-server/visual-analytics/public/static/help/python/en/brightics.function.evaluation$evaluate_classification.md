## Format
### Python
```python
from brightics.function.evaluation import evaluate_classification
res = evaluate_classification(table = ,label_col = ,prediction_col = ,average = ,group_by = )
res['result']
```

## Description
This function computes the F1 score, the accuracy, the precision, the recall.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Long, Integer, String, Float, Double
2. **Prediction Column**<b style="color:red">*</b>: Column name for prediction
   - Allowed column type : Long, Integer, String, Float, Double
3. **Average**: This parameter is only for multiclass classification. 
If By, calculate metrics for each label. More precisely, calculate metrics under the assumption that each label is positive.
If Weighted, calculate metrics for each label, and find their weighted mean.
If Unweighted, calculate metrics for each label, and find their unweighted mean.
   - Available items
      - By (default)
      - Weighted
      - Unweighted
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Long, Integer, String, Float, Double
2. **prediction_col**<b style="color:red">*</b>: Column name for prediction
   - Allowed column type : Long, Integer, String, Float, Double
3. **average**: This parameter is only for multiclass classification. 
If By, calculate metrics for each label. More precisely, calculate metrics under the assumption that each label is positive.
If Weighted, calculate metrics for each label, and find their weighted mean.
If Unweighted, calculate metrics for each label, and find their unweighted mean.
   - Available items
      - None (default)
      - weighted
      - macro
4. **group_by**: Columns to group by

#### Outputs: model

