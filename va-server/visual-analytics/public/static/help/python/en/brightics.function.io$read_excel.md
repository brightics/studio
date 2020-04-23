# Read Excel

## Description
This function reads a excel file and create a table.

## Properties
### VA
#### INPUT
1. This function has no input data.
#### OUTPUT
1. **out_table**: (Table) Table with the fields filled with the values from the excel file. 



## Format
### Python
```python
from brightics.function.io import read_excel
res = read_excel(path = ,sheet_index = )
res['table']
```



#### Parameters
1. **Path of excel file**<b style="color:red">*</b>: Excel file path.
   - Value type : String
2. **Sheet index**<b style="color:red">*</b>: Sheet index is an integer and starts from 0.
   - Value type : Integer
   - Default : 0

#### Outputs: table

### Python
#### Inputs: This function has no input data.

#### Parameters
1. **path**<b style="color:red">*</b>: Excel file path.
   - Value type : String
2. **sheet_index**<b style="color:red">*</b>: Sheet index is an integer and starts from 0.
   - Value type : Integer
   - Default : 0

#### Outputs: table

