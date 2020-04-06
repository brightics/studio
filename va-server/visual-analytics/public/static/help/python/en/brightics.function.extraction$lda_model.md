## Format
### Python
```python
from brightics.function.extraction import lda_model
res = lda_model(table = ,model = ,new_column_name = ,prediction_col = )
res['out_table']
```

## Description
This function transforms the features using the result of LDA.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **New Column Name**: New column name
   - Value type : String
   - Default : projected_
2. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **new_column_name**: New column name
   - Value type : String
   - Default : projected_
2. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

