## Format
### Python
```python
from brightics.function.clustering import mean_shift_predict
res = mean_shift_predict(table = ,model = ,prediction_col = )
res['out_table']
```

## Description
This function predicts cluster labels from trained model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

