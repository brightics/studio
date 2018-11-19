## Format
### Python
```python
from brightics.function.manipulation import simple_filter
res = simple_filter(main_operator = , input_cols = , operators = , operands = )
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
1. **Filter**<b style="color:red">*</b>:
   - **Condition**<b style="color:red">*</b> : Choose columns, operators and operands

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **main_operator**<b style="color:red">*</b>: Main operators
2. **input_cols**<b style="color:red">*</b>: Columns.
2. **operators**<b style="color:red">*</b>: Operators
2. **operands**<b style="color:red">*</b>: Operands.

#### Outputs
1. **out_table**: table
