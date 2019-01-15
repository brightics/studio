## Format
### Python
```python
from brightics.function.extraction import add_expression_column_if
res = add_expression_column_if(new_col = , conditions = , values = , else_value = )
res['out_table']
```

## Description
This function generates a new column based on a given formula.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Add Column**<b style="color:red">*</b>:
   - **New Column Name**<b style="color:red">*</b> : Name of the new column to be added.
   - **New Column Type**<b style="color:red">*</b> : Type of the new column.
   - **Condition**<b style="color:red">*</b> : Condition Expressions and values.

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **new_col**<b style="color:red">*</b>: Name of the new column to be added.
   - Value type : String
2. **conditions**<b style="color:red">*</b>: Condition Expressions.
   - Value type : List of string
2. **values**<b style="color:red">*</b>: Values.
   - Value type : List of string
2. **else_value**<b style="color:red">*</b>: Else value.
   - Value type : String

#### Outputs
1. **out_table**: table
