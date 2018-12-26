## Format
### Python
```python
from brightics.function.classification import naive_bayes_predict
res = naive_bayes_predict(prediction_col = ,prob_prefix = ,log_prob_prefix = ,suffix = ,display_log_prob = )
res['out_table']
```

## Description
Predict data using a Naive Bayes model.

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
2. **Probability Column Prefix**: 
   - Value type : String
   - Default : probability
3. **Log Probability Column Prefix**: 
   - Value type : String
   - Default : log_probability
4. **Suffix Type**: 
   - Available items
      - Index (default)
      - Label
5. **Display Log Probability**: 

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
2. **prob_prefix**: 
   - Value type : String
   - Default : probability
3. **log_prob_prefix**: 
   - Value type : String
   - Default : log_probability
4. **suffix**: 
   - Available items
      - index (default)
      - label
5. **display_log_prob**: 

#### Outputs
1. **out_table**: table

