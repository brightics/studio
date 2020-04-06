## Format
### Python
```python
from brightics.function.classification import random_forest_classification_predict
res = random_forest_classification_predict(table = ,model = ,pred_col_name = ,prob_col_prefix = ,suffix = )
res['out_table']
```

## Description
Predict data using a random forest classification model.

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
3. **Suffix Type**: Suffix type of probability column name.
   - Available items
      - Index (default)
      - Label

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **pred_col_name**: Column name for prediction
   - Value type : String
   - Default : prediction
2. **prob_col_prefix**: Prefix for column name of probability
   - Value type : String
   - Default : probability
3. **suffix**: Suffix type of probability column name.
   - Available items
      - index (default)
      - label

#### Outputs: table

