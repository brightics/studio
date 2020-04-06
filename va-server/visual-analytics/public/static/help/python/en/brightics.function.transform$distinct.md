## Format
### Python
```python
from brightics.function.transform import distinct
res = distinct(table = ,input_cols = ,hold_cols = ,group_by = )
res['out_table']
```

## Description
"Distinct returns the table with duplicate rows removed, optionally only considering certain columns. "

Reference:
+ <https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.drop_duplicates.html>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
2. **Hold Columns**: Column to select as hold.
3. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
2. **hold_cols**: Column to select as hold.
3. **group_by**: Columns to group by

#### Outputs: table

