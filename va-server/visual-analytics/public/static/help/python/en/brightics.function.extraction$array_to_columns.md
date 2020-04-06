## Format
### Python
```python
from brightics.function.extraction import array_to_columns
res = array_to_columns(table = ,input_cols = ,remain_cols = )
res['out_table']
```

## Description
Expands columns of Array[Double]Type to DoubleType columns.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer[], Long[], Float[], Double[]
2. **Remain Columns**: Keep all input columns in output table

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer[], Long[], Float[], Double[]
2. **remain_cols**: Keep all input columns in output table

#### Outputs: table

