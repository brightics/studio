## Format
### Python
```python
from brightics.function.manipulation import replace_missing_number
res = replace_missing_number(table = ,input_cols = ,fill_value = ,fill_value_to = ,group_by = )
res['out_table']
```

## Description
This function changes the abnormal values(null, nan) in the value of given numeric type columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Fill Value**: Value to fill holes. Specific value('Fill Holes With'), mean, median, min, or max are available.
   - Available items
      - To (default)
      - Mean
      - Median
      - Min
      - Max
3. **Fill Holes With**: The value to be filled with.
   - Value type : Double
   - Default : 0.0
4. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **fill_value**: Value to fill holes. Specific value('Fill Holes With'), mean, median, min, or max are available.
   - Available items
      - to (default)
      - mean
      - median
      - min
      - max
3. **fill_value_to**: The value to be filled with.
   - Value type : Double
   - Default : 0.0
4. **group_by**: Columns to group by

#### Outputs: table

