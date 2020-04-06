## Format
### Python
```python
from brightics.function.manipulation import replace_missing_string
res = replace_missing_string(table = ,input_cols = ,fill_string = ,empty_string_null = ,group_by = )
res['out_table']
```

## Description
This function changes null values in the value of given string type columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Fill Holes With**: String value to fill holes.
   - Value type : String
3. **Consider Empty String as Null**: Consider empty string '' as a null.
4. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **fill_string**: String value to fill holes.
   - Value type : String
3. **empty_string_null**: Consider empty string '' as a null.
4. **group_by**: Columns to group by

#### Outputs: table

