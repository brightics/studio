## Format
### Python
```python
from brightics.function.transform import select_column
res = select_column(table = ,input_cols = ,output_cols = ,output_types = )
res['out_table']
```

## Description
Reorganize table with the selected columns according to the selected sequence.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Selected Column (Condition)**<b style="color:red">*</b>: Columns to be in the output table. The name and type of each selected columns can be reassigned. 

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: The columns to be in the output table.
2. **output_cols**: The new names of output columns. Default is equal to 'input_cols'.
3. **output_types**: The new types of output columns. Default is equal to 'input_cols'.

#### Outputs: table

