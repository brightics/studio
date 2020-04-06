## Format
### Python
```python
from brightics.function.extraction import columns_to_array
res = columns_to_array(table = ,input_cols = ,remain_cols = ,output_col_name = )
res['out_table']
```

## Description
Zip chosen DoubleType columns into a single ArrayType[DoubleType] column and append it on the right side.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Remain Columns**: Keep all input columns in output table
3. **Output Column Name**: Output column name
   - Value type : String
   - Default : array

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **remain_cols**: Keep all input columns in output table
3. **output_col_name**: Output column name
   - Value type : String
   - Default : array

#### Outputs: table

