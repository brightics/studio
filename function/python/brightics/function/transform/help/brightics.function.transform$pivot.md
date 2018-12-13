## Format
### Python
```python
from brightics.function.transform import pivot
res = pivot(values = ,index = ,columns = ,aggfunc = )
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

#### Outputs
1. **out_table**: table

