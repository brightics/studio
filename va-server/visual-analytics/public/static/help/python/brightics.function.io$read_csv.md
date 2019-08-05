## Format
### Python
```python
from brightics.function.io import read_csv
res = read_csv(table = ,path = ,delimiter = ,na_filter = ,strip_col = )
res['table']
```

## Description
This function reads a csv file into a table.

---

## Properties
### VA
#### Inputs: This function has no input data.

#### Parameters
1. **Path**<b style="color:red">*</b>: csv file path.
   - Value type : String
2. **Delimiter**: Choose Delimiter to split
   - Value type : String
   - Default : ,
3. **Null Filtering**: Choose whether to filter null values 
4. **Strip White Space in Column Name**: Strip white space in column name

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **path**<b style="color:red">*</b>: csv file path.
   - Value type : String
2. **delimiter**: Choose Delimiter to split
   - Value type : String
   - Default : ,
3. **na_filter**: 
4. **strip_col**: Strip white space in column name

#### Outputs: table

