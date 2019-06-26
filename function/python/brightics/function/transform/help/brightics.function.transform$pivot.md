## Format
### Python
```python
from brightics.function.transform import pivot
res = pivot(values = ,index = ,columns = ,aggfunc = ,group_by = )
res['out_table']
```

## Description
Create a spreadsheet-style pivot table as a DataFrame.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Values**<b style="color:red">*</b>: Column to aggregate
2. **Index**: column, Grouper
3. **Columns**: Column fields.
4. **Aggregate Function**<b style="color:red">*</b>: Aggregate function
   - Available items
      - count
      - mean (default)
      - std
      - var
      - min
      - 25th
      - median
      - 75th
      - max
5. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **values**<b style="color:red">*</b>: Column to aggregate
2. **index**: column, Grouper
3. **columns**: Column fields.
4. **aggfunc**<b style="color:red">*</b>: Aggregate function
   - Available items
      - count
      - mean (default)
      - std
      - var
      - min
      - _25th
      - median
      - _75th
      - max
5. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

