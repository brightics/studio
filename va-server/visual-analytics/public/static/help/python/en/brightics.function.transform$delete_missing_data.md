## Format
### Python
```python
from brightics.function.transform import delete_missing_data
res = delete_missing_data(table = ,input_cols = )
res['out_table']
```

## Description
Removes rows when the chosen columns have abnormal values.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Long, Integer, Double, String, Boolean, Float

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Long, Integer, Double, String, Boolean, Float

#### Outputs: table

