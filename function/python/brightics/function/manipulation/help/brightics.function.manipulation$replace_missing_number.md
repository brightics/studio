## Format
### Python
```python
from brightics.function.manipulation import replace_missing_number
res = replace_missing_number(input_cols = ,fill_method = ,fill_value = ,fill_value_to = ,limit = ,group_by = )
res['out_table']
```

## Description
This function changes the abnormal values(null, nan) in the value of given numeric type columns.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to be filled.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Fill Method**: Method to use for filling holes. Value : fill holes to Fill Value. Forward Fill : propagate last valid observation forward to next valid. Backward Fill : use NEXT valid observation to fill gap.
   - Available items
      - Value (default)
      - Forward Fill
      - Backward Fill
3. **Fill Value**: Value to fill holes. specific value(Fill Value To), mean, median, max, and min is available.
   - Available items
      - To (default)
      - Mean
      - Median
      - Min
      - Max
4. **Fill Value To**: The value to be filled with.
   - Value type : Double
   - Default : 0
5. **Limit**: The limit number of filled value in each given columns.
   - Value type : Integer
6. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to be filled.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **fill_method**: Method to use for filling holes. Value : fill holes to Fill Value. Forward Fill : propagate last valid observation forward to next valid. Backward Fill : use NEXT valid observation to fill gap.
   - Available items
      - value (default)
      - ffill
      - bfill
3. **fill_value**: Value to fill holes. specific value(Fill Value To), mean, median, max, and min is available.
   - Available items
      - to (default)
      - mean
      - median
      - min
      - max
4. **fill_value_to**: The value to be filled with.
   - Value type : Double
   - Default : 0
5. **limit**: The limit number of filled value in each given columns.
   - Value type : Integer
6. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

