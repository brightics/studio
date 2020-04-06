## Format
### Python
```python
from brightics.function.transform import bind_row_column
res = bind_row_column(first_table = ,second_table = ,row_or_col = )
res['table']
```

## Description
Concatenate two tables horizontally or vertically.

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Row or Column**: How to concatenate.
   - Available items
      - Row (default)
      - Column

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **row_or_col**: How to concatenate.
   - Available items
      - row (default)
      - col

#### Outputs: table

