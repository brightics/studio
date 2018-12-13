## Format
### Python
```python
from brightics.function.classification import decision_tree_classification_predict
res = decision_tree_classification_predict(prediction_col = )
res['out_table']
```

## Description
Predict data using a decision tree classification model.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction Column Name**: Column name for prediction.
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **prediction_col**: Column name for prediction.
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table

