## Format
### Python
```python
from brightics.function.classification import mlp_classification_predict
res = mlp_classification_predict(table = ,model = ,prediction_col = ,prob_prefix = ,output_log_prob = ,log_prob_prefix = ,suffix = ,thresholds = )
res['out_table']
```

## Description
Predict data using a MLP model.

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
3. **Display Log Probability**: Display Log Probability.
4. **Log Probability Column Prefix**: Log Probability column prefix.
   - Value type : String
   - Default : log_probability
5. **Suffix Type**: Choose suffix type.
   - Available items
      - Index (default)
      - Label
6. **Thresholds**: Thresholds used to predict. Return the biggest value of probability/threshold. In binary case, this is equivalent with choosing the first value if and only if probability is bigger than threshold. Please note that prediction values are sorted in alphabetical order when you input lists of thresholds.

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
3. **output_log_prob**: Display Log Probability.
4. **log_prob_prefix**: Log Probability column prefix.
   - Value type : String
   - Default : log_probability
5. **suffix**: Choose suffix type.
   - Available items
      - index (default)
      - label
6. **thresholds**: Thresholds used to predict. Return the biggest value of probability/threshold. In binary case, this is equivalent with choosing the first value if and only if probability is bigger than threshold. Please note that prediction values are sorted in alphabetical order when you input lists of thresholds.

#### Outputs: table

