## Format
### Python
```python
from brightics.function.transform import svd
res = svd(table = ,input_cols = ,full_matrices = ,group_by = )
res['out_table1']
res['out_table2']
res['out_table3']
res['out_table4']
```

## Description
This function returns the singular value decomposition of a matrix. The singular value decomposition of a matrix A is a decomposition A = USV. Here, U and V are orthogonal matrices and S is a diagonal matrix with non-negative reals on the diagonal. The diagonal entries of S are known as the singular values of A. This function returns the array s of singular values instead of the diagonal matrix S.

Reference

https://en.wikipedia.org/wiki/Singular_value_decomposition

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Float, Double, Long
2. **Calculate Full Matrix**: If True, it returns full orthogonal matrix.
3. **Group By**: Columns to group by

#### Outputs: table, table, table, table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Float, Double, Long
2. **full_matrices**: If True, it returns full orthogonal matrix.
3. **group_by**: Columns to group by

#### Outputs: table, table, table, table

