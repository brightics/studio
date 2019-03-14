## Format
### Python
```python
from brightics.function.manipulation import sort
res = sort(input_cols = , is_asc = , group_by = )
res['out_table']
```

## Description
This function sorts specific columns as a given order.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Sort Rule**<b style="color:red">*</b>: Columns and sorting type (desc, asc)
   - Allowed column type : Double, Float, Integer, Long, String
2. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Input columns.
   - Allowed column type : Double, Float, Integer, Long, String
2. **is_asc**: Ascending or descending.
   - Value type : Boolean
8. **group_by**: Columns to group by

#### Outputs: table
