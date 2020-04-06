## Format
### Python
```python
from brightics.function.transform import transpose
res = transpose(table = ,input_cols = ,label_col = ,label_col_name = ,group_by = )
res['out_table']
```

## Description
This function exchanages rows and columns of the given table.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Label Column**: Columns to select as label
3. **Label Column Name**: Label Column Name
   - Value type : String
   - Default : label
4. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **label_col**: Columns to select as label
3. **label_col_name**: Label Column Name
   - Value type : String
   - Default : label
4. **group_by**: Columns to group by

#### Outputs: table

