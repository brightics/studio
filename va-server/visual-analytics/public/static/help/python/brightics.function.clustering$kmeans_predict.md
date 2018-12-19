## Format
### Python
```python
from brightics.function.clustering import kmeans_predict
res = kmeans_predict(prediction_col = ,group_by = )
res['out_table']
```

## Description
This function predicts cluster labels from trained model.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction Column Name**: Prediction column name
   - Value type : String
   - Default : prediction
2. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **prediction_col**: Prediction column name
   - Value type : String
   - Default : prediction
2. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

