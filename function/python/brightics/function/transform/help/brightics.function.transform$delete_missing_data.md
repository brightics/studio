## Format
### Python
```python
from brightics.function.transform import delete_missing_data
res = delete_missing_data(input_cols = ,thresh = )
res['out_table']
```

## Description
Removes rows when the chosen columns have abnormal values.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: The name of columns to check whether they have abnormal values. If no column is selected, check all columns.
   - Allowed column type : Long, Integer, Double, String, Boolean, Float
2. **Number of Missing Values in a Row**: Require that many non-NA values.
   - Value type : Integer

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: The name of columns to check whether they have abnormal values. If no column is selected, check all columns.
   - Allowed column type : Long, Integer, Double, String, Boolean, Float
2. **thresh**: Require that many non-NA values.
   - Value type : Integer

#### Outputs
1. **out_table**: table

