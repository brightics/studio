## Format
### Python
```python
from brightics.function.extraction import replace_string
res = replace_string(table = ,input_cols = ,replace_mode = ,empty_as_null = ,target_string_null = ,target_string = ,replace_string_null = ,replace_string = )
res['out_table']
```

## Description
This function replaces specific string with given string for given columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Replace Mode**: Replace mode
   - Available items
      - Full
      - Part (default)
3. **Treat empty string as null**: Treat empty string as null or not
4. **Null Target String**: Target string is null or not
5. **Target String**: Target string
   - Value type : String
6. **Null Replace String**: Replace string is null or not
7. **Replace String**: Replace string
   - Value type : String

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **replace_mode**: Replace mode
   - Available items
      - full
      - part (default)
3. **empty_as_null**: Treat empty string as null or not
4. **target_string_null**: Target string is null or not
5. **target_string**: Target string
   - Value type : String
6. **replace_string_null**: Replace string is null or not
7. **replace_string**: Replace string
   - Value type : String

#### Outputs: table

