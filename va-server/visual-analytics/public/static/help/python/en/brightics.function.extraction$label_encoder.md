## Format
### Python
```python
from brightics.function.extraction import label_encoder
res = label_encoder(table = ,input_col = ,new_column_name = ,group_by = )
res['out_table']
res['model']
```

## Description
Encode labels with value between 0 and n_classes-1.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Float, Double, Long, String
2. **New Column Name**: New column name
   - Value type : String
   - Default : encoded_column
3. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Float, Double, Long, String
2. **new_column_name**: New column name
   - Value type : String
   - Default : encoded_column
3. **group_by**: Columns to group by

#### Outputs: table, model

