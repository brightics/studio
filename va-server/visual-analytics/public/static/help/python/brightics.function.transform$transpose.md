## Format
### Python
```python
from brightics.function.transform import transpose
res = transpose(columns = ,label_col = ,label_col_name = )
res['out_table']
```

## Description
This function exchanages rows and columns of the given table.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Columns**<b style="color:red">*</b>: Columns of the table to transpose
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **Label Column**: Label Column
3. **Label Column Name**: Label Column Name
   - Value type : String
   - Default : label

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **columns**<b style="color:red">*</b>: Columns of the table to transpose
   - Allowed column type : Integer, Long, Float, Double, Decimal, Boolean
2. **label_col**: Label Column
3. **label_col_name**: Label Column Name
   - Value type : String
   - Default : label

#### Outputs
1. **out_table**: table

