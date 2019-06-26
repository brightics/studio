## Format
### Python
```python
from brightics.function.extraction import pca_model
res = pca_model(new_column_name = ,group_by = )
res['out_table']
```

## Description
This function transforms the features using the result of PCA.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **New Column Name**: New column name
   - Value type : String
   - Default : projected_
2. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **new_column_name**: New column name
   - Value type : String
   - Default : projected_
2. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

