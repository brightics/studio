## Format
### Python
```python
from brightics.function.regression import decision_tree_regression_predict
res = decision_tree_regression_predict(prediction_col = )
res['out_table']
```

## Description
The predicted value based on X is returned.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table

