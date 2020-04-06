## Format
### Python
```python
from brightics.function.transform import unpivot
res = unpivot(table = ,value_vars = ,id_vars = ,var_name = ,value_name = )
res['out_table']
```

## Description
This function 'unpivots' measured variables, leaving just two non-identifier columns, variable column and value column.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Values**<b style="color:red">*</b>: Measured variables
2. **Identifiers**: Identifier variables
3. **Variable Column Name**: Variable column name
   - Value type : String
   - Default : variable
4. **Value Column Name**: Value column name
   - Value type : String
   - Default : value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **value_vars**<b style="color:red">*</b>: Measured variables
2. **id_vars**: Identifier variables
3. **var_name**: Variable column name
   - Value type : String
   - Default : variable
4. **value_name**: Value column name
   - Value type : String
   - Default : value

#### Outputs: table

