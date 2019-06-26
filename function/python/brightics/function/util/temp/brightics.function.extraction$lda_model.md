## Format
### Python
```python
from brightics.function.extraction import lda_model
res = lda_model(new_column_name = ,prediction_col = ,group_by = )
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
3. **Group By**: Columns to group by

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
3. **group_by**: Columns to group by

#### Outputs: table

