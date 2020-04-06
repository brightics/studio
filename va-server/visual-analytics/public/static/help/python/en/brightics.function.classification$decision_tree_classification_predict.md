## Format
### Python
```python
from brightics.function.classification import decision_tree_classification_predict
res = decision_tree_classification_predict(table = ,model = ,prediction_col = ,prob_col_prefix = ,suffix = )
res['out_table']
```

## Description
Predict data using a decision tree classification model.

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
1. **prediction_col**: Column name for prediction
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

