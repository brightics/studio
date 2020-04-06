## Format
### Python
```python
from brightics.function.extraction import add_expression_column
res = add_expression_column(new_cols = ,expr_type = ,formulas = )
res['out_table']
```

## Description
This function adds new column with given expression.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **New Column Name**<b style="color:red">*</b>: New column name to be added.
   - Value type : String
2. **Expression Type**<b style="color:red">*</b>
   - Available items
      - SQLite (default)
      - Python
3. **Expression**<b style="color:red">*</b>: Query.

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **new_cols**<b style="color:red">*</b>: New column name to be added.
   - Value type : String
2. **expr_type**<b style="color:red">*</b>
   - Available items
      - sqlite (default)
      - python
3. **formulas**<b style="color:red">*</b>: Query.

#### Outputs: table

