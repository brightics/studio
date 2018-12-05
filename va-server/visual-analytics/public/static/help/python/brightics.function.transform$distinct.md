## Format
### Python
```python
from brightics.function.transform import distinct
res = distinct(input_cols = ,shown_opt = )
res['out_table']
```

## Description
Distinct returns the table with duplicate rows removed, optionally only considering certain columns.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**: 
2. **Option**: Whether to return the selected columns or all columns.
   - Available items
      - Show all columns
      - Show selected columns (default)

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**: 
2. **shown_opt**: Whether to return the selected columns or all columns.
   - Available items
      - all
      - selected (default)

#### Outputs
1. **out_table**: table

