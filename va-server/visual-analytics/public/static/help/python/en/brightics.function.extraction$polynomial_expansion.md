## Format
### Python
```python
from brightics.function.extraction import polynomial_expansion
res = polynomial_expansion(table = ,input_cols = ,hold_cols = )
res['out_table']
```

## Description
This function performs polynomial expansion of degree 2 in a polynomial space. If we want to expand it with degree 2, then we get (x, y, x * x, x * y, y * y). The number of variables are not limited.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Hold Columns**: The name of the columns to be kept in output table.
   - Allowed column type : Integer, Long, Float, Double, String

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **hold_cols**: The name of the columns to be kept in output table.
   - Allowed column type : Integer, Long, Float, Double, String

#### Outputs: table

