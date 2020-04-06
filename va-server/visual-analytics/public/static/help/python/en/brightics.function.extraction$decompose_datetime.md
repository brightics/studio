## Format
### Python
```python
from brightics.function.extraction import decompose_datetime
res = decompose_datetime(table = ,input_cols = )
res['out_table']
```

## Description
Decompose Datetime and extract year, month, day, hour and week. Those values are added as derived variables. Input value must be in yyyyMMddHHmmss format.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String

#### Outputs: table

