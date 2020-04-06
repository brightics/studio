## Format
### Python
```python
from brightics.function.classification import naive_bayes_predict
res = naive_bayes_predict(table = ,model = ,prediction_col = ,prob_prefix = ,display_log_prob = ,log_prob_prefix = ,suffix = )
res['out_table']
```

## Description
Predict data using a Naive Bayes model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **Probability column prefix.**: 
   - Value type : String
   - Default : probability
3. **Display Log Probability**: 
4. **Log Probability Column Prefix**: 
   - Value type : String
   - Default : log_probability
5. **Suffix Type**: 
   - Available items
      - Index (default)
      - Label

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **prob_prefix**: 
   - Value type : String
   - Default : probability
3. **display_log_prob**: 
4. **log_prob_prefix**: 
   - Value type : String
   - Default : log_probability
5. **suffix**: 
   - Available items
      - index (default)
      - label

#### Outputs: table

