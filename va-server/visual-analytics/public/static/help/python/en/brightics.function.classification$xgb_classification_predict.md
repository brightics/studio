## Format
### Python
```python
from brightics.function.classification import xgb_classification_predict
res = xgb_classification_predict(table = ,model = ,prediction_col = ,probability_col = ,suffix = ,thresholds = )
res['out_table']
```

## Description
Using the result of 'XGB Classification Train', this function predicts with the input table

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
3. **Suffix Type**: Choose suffix type.
   - Available items
      - Index (default)
      - Label
4. **Thresholds**: Thresholds used to predict.

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **probability_col**: Prefix for column name of probability
   - Value type : String
   - Default : probability
3. **suffix**: Choose suffix type.
   - Available items
      - index (default)
      - label
4. **thresholds**: Thresholds used to predict.

#### Outputs: table

