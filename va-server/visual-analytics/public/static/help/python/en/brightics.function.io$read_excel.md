
## Format
This function reads a excel file and create a table.
## Description
This function reads a excel file and create a table.

## Properties
### VA
#### INPUT
1. This function has no input data.
#### OUTPUT
1. **out_table**: (Table) Table with the fields filled with the values from the excel file. 

#### Parameters
1. **Path of excel file**<b style="color:red">*</b>: Excel file path.

2. **Sheet index**: Sheet index is an integer and starts from 0.

### Python
#### USAGE
```python
res = read_excel(path = ,sheet_index = )
```

#### Inputs:
1. This function has no input data.
#### Outputs: table
1. **out_table**: (Table) Table with the fields filled with the values from the excel file. 

#### Parameters
1. **path**<b style="color:red">*</b>: Excel file path.
   - Value type : String
2. **sheet_index**: Sheet index is an integer and starts from 0.
   - Value type : Integer
   - Default : 0
