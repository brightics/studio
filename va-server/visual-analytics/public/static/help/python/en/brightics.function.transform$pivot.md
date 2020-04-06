## Format
### Python
```python
from brightics.function.transform import pivot
res = pivot(table = ,index = ,columns = ,values = ,aggfunc = )
res['out_table']
```

## Description
Create a spreadsheet-style pivot table as a DataFrame.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Rows**: column, Grouper
2. **Columns**: Column fields.
3. **Values**<b style="color:red">*</b>: Column to aggregate
4. **Aggregate Function**<b style="color:red">*</b>: Aggregate function
   - Available items
      - MAX
      - MIN
      - MEAN (default)
      - SUM (default)
      - VAR
      - STDEV
      - CNT
      - MEDIAN
      - Q1
      - Q3

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **index**: column, Grouper
2. **columns**: Column fields.
3. **values**<b style="color:red">*</b>: Column to aggregate
4. **aggfunc**<b style="color:red">*</b>: Aggregate function
   - Available items
      - max
      - min
      - mean (default)
      - sum (default)
      - var
      - std
      - count
      - median
      - _25th
      - _75th

#### Outputs: table

