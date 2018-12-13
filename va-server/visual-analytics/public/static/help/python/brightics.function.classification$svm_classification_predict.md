## Format
### Python
```python
from brightics.function.classification import svm_classification_predict
res = svm_classification_predict(prediction_col = ,probability_col = ,log_probability_col = ,suffix = ,thresholds = )
res['out_table']
```

## Description
Predict data using a support vector classification model.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Prediction Column Name**: Prediction column name
   - Value type : String
2. **Probability Column Prefix**: Probability Column Name
   - Value type : String
3. **Log Probability Column Prefix**: Log Probability Column Name
   - Value type : String
4. **Suffix Type**: Choose suffix type.
   - Available items
      - Index (default)
      - Label
5. **Thresholds**: Thresholds used to predict.

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **prediction_col**: Prediction column name
   - Value type : String
2. **probability_col**: Probability Column Name
   - Value type : String
3. **log_probability_col**: Log Probability Column Name
   - Value type : String
4. **suffix**: Choose suffix type.
   - Available items
      - index (default)
      - label
5. **thresholds**: Thresholds used to predict.

#### Outputs
1. **out_table**: table

