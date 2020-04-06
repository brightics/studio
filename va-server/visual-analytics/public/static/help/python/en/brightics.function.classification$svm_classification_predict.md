## Format
### Python
```python
from brightics.function.classification import svm_classification_predict
res = svm_classification_predict(table = ,model = ,prediction_col = ,prob_prefix = ,display_log_prob = ,log_prob_prefix = ,suffix = ,thresholds = )
res['out_table']
```

## Description
Predict data using a support vector classification model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **Probability Column Prefix**: Prefix for column name of probability
   - Value type : String
   - Default : probability
3. **Display Log Probability**: Display log probability.
4. **Log Probability Column Prefix**: Log Probability column prefix.
   - Value type : String
   - Default : log_probability
5. **Suffix Type**: Choose suffix type.
   - Available items
      - Index (default)
      - Label
6. **Thresholds**: Thresholds used to predict.

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **prob_prefix**: Prefix for column name of probability
   - Value type : String
   - Default : probability
3. **display_log_prob**: Display log probability.
4. **log_prob_prefix**: Log Probability column prefix.
   - Value type : String
   - Default : log_probability
5. **suffix**: Choose suffix type.
   - Available items
      - index (default)
      - label
6. **thresholds**: Thresholds used to predict.

#### Outputs: table

