## Format
### Python
```python
from brightics.function.extraction import add_expression_column
res = add_expression_column(new_cols = ,formulas = )
res['out_table']
```

## Description
This function adds new column with given expression.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **New Column Name**<b style="color:red">*</b>: New column name to be added.
3. **Expression Type**<b style="color:red">*</b>: Expression type 
   - Available items
      - SQLite (default)
      - Python
2. **Expression**<b style="color:red">*</b>: Expression

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **new_cols**<b style="color:red">*</b>: New column name to be added.
3. **expr_type**: Expression type 
   - Available items
      - sqlite (default)
      - numexpr
      - python
2. **formulas**<b style="color:red">*</b>: Expression
      
#### Outputs
1. **out_table**: table
2. **model**: model

