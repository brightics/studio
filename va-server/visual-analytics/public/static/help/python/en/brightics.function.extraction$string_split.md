## Format
### Python
```python
from brightics.function.extraction import string_split
res = string_split(table = ,input_col = ,hold_cols = ,delimiter = ,output_col_name = ,output_col_cnt = ,output_col_type = ,start_pos = ,end_pos = )
res['out_table']
```

## Description
This function split the string given by columns to generate multiple columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **Hold Columns**: The name of the columns to be kept in output table.
   - Allowed column type : Integer, Long, Float, Double, String
3. **Delimiter**<b style="color:red">*</b>: Delimiter for splitting string
   - Value type : String
   - Default : ,
4. **Output Column Name**: Name of generated columns
   - Value type : String
   - Default : split
5. **Output Column Count**: Number of columns to be extracted from input column
   - Value type : Integer
   - Default : 3 (1 <= value <= 1000)
6. **Output Column Type**: Type of generated columns
7. **Ignore Start Position**: Number of characters to be skipped at the beginning of input column
   - Value type : Integer
   - Default : 0 (0 <= value)
8. **Ignore End Position**: Number of columns to be extracted from input column
   - Value type : Integer
   - Default : 0 (0 <= value)

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **hold_cols**: The name of the columns to be kept in output table.
   - Allowed column type : Integer, Long, Float, Double, String
3. **delimiter**<b style="color:red">*</b>: Delimiter for splitting string
   - Value type : String
   - Default : ,
4. **output_col_name**: Name of generated columns
   - Value type : String
   - Default : split
5. **output_col_cnt**: Number of columns to be extracted from input column
   - Value type : Integer
   - Default : 3 (1 <= value <= 1000)
6. **output_col_type**: Type of generated columns
7. **start_pos**: Number of characters to be skipped at the beginning of input column
   - Value type : Integer
   - Default : 0 (0 <= value)
8. **end_pos**: Number of columns to be extracted from input column
   - Value type : Integer
   - Default : 0 (0 <= value)

#### Outputs: table

