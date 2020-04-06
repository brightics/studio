## Format
### Python
```python
from brightics.function.extraction import shift_datetime
res = shift_datetime(table = ,input_cols = ,shift_unit = ,interval = )
res['out_table']
```

## Description
Shift DateTime using the entered interval and unit.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Shift Unit**<b style="color:red">*</b>: Shift-unit option (“Year”, “Month”, “Day”, “Hour”, “Minute”) unit to shift DateTime Default : year
3. **Interval**<b style="color:red">*</b>: Interval to shift DateTime. It should be integer.
   - Value type : Integer
   - Default : Enter value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **shift_unit**<b style="color:red">*</b>: Shift-unit option (“Year”, “Month”, “Day”, “Hour”, “Minute”) unit to shift DateTime Default : year
3. **interval**<b style="color:red">*</b>: Interval to shift DateTime. It should be integer.
   - Value type : Integer
   - Default : Enter value

#### Outputs: table

