## Format
### Python
```python
from brightics.function.extraction import add_row_number
res = add_row_number(table = ,new_col = ,group_by = )
res['out_table']
```

## Description
Add Row Number returns the sequential number of a row, starting at 1 for the first row.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **New Column Name**: The name of the added column.
   - Value type : String
   - Default : add_row_number
2. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **new_col**: The name of the added column.
   - Value type : String
   - Default : add_row_number
2. **group_by**: Columns to group by

#### Outputs: table

