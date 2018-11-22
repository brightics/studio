## Format
### Python
```python
from brightics.function.transform import unpivot
res = unpivot(value_vars = ,var_name = ,value_name = )
res['out_table']
```

## Description
This function 'unpivots' measured variables, leaving just two non-identifier columns, variable column and value column.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Measured Variables**<b style="color:red">*</b>: Measured variables
2. **Variable Column Name**: Variable column name
   - Value type : String
3. **Value Column Name**: Value column name
   - Value type : String

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **value_vars**<b style="color:red">*</b>: Measured variables
2. **var_name**: Variable column name
   - Value type : String
3. **value_name**: Value column name
   - Value type : String

#### Outputs
1. **out_table**: table

