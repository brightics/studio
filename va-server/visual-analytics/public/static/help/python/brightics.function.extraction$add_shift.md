## Format
### Python
```python
from brightics.function.extraction import add_shift
res = add_shift(input_col = ,shift_list = ,shifted_col = ,group_by = )
res['out_table']
```

## Description
This function add new columns of shifted data.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Input column to shift
2. **Offset Set**<b style="color:red">*</b>: For each shift in shift set, this function creates corresponding shifted column.
3. **Output Column Prefix**: This function creates new columns with name {prefix}_{shift}. If None, this function uses input column name as prefix.
   - Value type : String
   - Default : 
4. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Input column to shift
2. **shift_list**<b style="color:red">*</b>: For each shift in shift set, this function creates corresponding shifted column.
3. **shifted_col**: This function creates new columns with name {prefix}_{shift}. If None, this function uses input column name as prefix.
   - Value type : String
   - Default : 
4. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

