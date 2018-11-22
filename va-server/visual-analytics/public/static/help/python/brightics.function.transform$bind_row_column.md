## Format
### Python
```python
from brightics.function.transform import bind_row_column
res = bind_row_column(row_or_col = )
res['table']
```

## Description
Concatenate two tables horizontally or vertically.

---

## Properties
### VA
#### Inputs
1. **first_table**: table
2. **second_table**: table

#### Parameters
1. **Row or Column**: How to concatenate
   - Available items
      - Row (default)
      - Column

#### Outputs
1. **table**: table

### Python
#### Inputs
1. **first_table**: table
2. **second_table**: table

#### Parameters
1. **row_or_col**: How to concatenate
   - Available items
      - row (default)
      - col

#### Outputs
1. **table**: table

