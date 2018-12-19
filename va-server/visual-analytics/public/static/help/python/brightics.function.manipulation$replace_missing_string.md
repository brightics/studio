## Format
### Python
```python
from brightics.function.manipulation import replace_missing_string
res = replace_missing_string(input_cols = ,fill_method = ,fill_string = ,limit = ,group_by = )
res['out_table']
```

## Description
This function changes null values in the value of given string type columns.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to be filled.
   - Allowed column type : String
2. **Fill Method**: Method to use for filling holes. Value : fill holes to Fill Value. Forward Fill : propagate last valid observation forward to next valid. Backward Fill : use NEXT valid observation to fill gap.
   - Available items
      - Value (default)
      - Forward Fill
      - Backward Fill
3. **Fill String**: String value to fill holes.
   - Value type : String
4. **Limit**: The limit number of filled value in each given columns.
   - Value type : Integer
5. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to be filled.
   - Allowed column type : String
2. **fill_method**: Method to use for filling holes. Value : fill holes to Fill Value. Forward Fill : propagate last valid observation forward to next valid. Backward Fill : use NEXT valid observation to fill gap.
   - Available items
      - value (default)
      - ffill
      - bfill
3. **fill_string**: String value to fill holes.
   - Value type : String
4. **limit**: The limit number of filled value in each given columns.
   - Value type : Integer
5. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

