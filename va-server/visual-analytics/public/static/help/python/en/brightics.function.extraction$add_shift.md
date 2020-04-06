## Format
### Python
```python
from brightics.function.extraction import add_shift
res = add_shift(table = ,input_col = ,shift_list = ,shifted_col = ,order_by = ,ordering = ,group_by = )
res['out_table']
```

## Description
This function add new columns of shifted data.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
2. **Offset Set**<b style="color:red">*</b>: For each shift in shift set, this function creates corresponding shifted column.
3. **Output Column Prefix**: This function creates new columns with name {prefix}_{shift}. If None, this function uses input column name as prefix.
   - Value type : String
4. **Order By**: Columns to sort before shifting values in the input column.
5. **Ordering**: The way to order by
   - Available items
      - Ascending (default)
      - Descending
6. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
2. **shift_list**<b style="color:red">*</b>: For each shift in shift set, this function creates corresponding shifted column.
3. **shifted_col**: This function creates new columns with name {prefix}_{shift}. If None, this function uses input column name as prefix.
   - Value type : String
4. **order_by**: Columns to sort before shifting values in the input column.
5. **ordering**: The way to order by
   - Available items
      - asc (default)
      - desc
6. **group_by**: Columns to group by

#### Outputs: table

