## Format
### Python
```python
from brightics.function.extraction import pca
res = pca(table = ,input_cols = ,n_components = ,svd_solver = ,tol = ,iterated_power = ,seed = ,new_column_name = ,group_by = )
res['out_table']
res['model']
```

## Description
Principal component analysis. Linear dimensionality reduction using Singular Value Decomposition of the data to project it to a lower dimensional space.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Double, Float, Integer, Long
2. **Number of Components**: Number of components to keep.
   - Value type : Integer
   - Default : Number of feature columns (value >= 1)
3. **SVD Solver**: Solver for Singular Value Decomposition.
4. **Tolerance**: Tolerance for singular values computed by 'SVD Solver' == 'ARPACK'.
   - Value type : Double
   - Default : 0.0 (value >= 0)
5. **Number of Iterations**: Number of iterations for the power method computed by 'SVD Solver' == 'Randomized'.
   - Value type : Integer
   - Default : 'auto' (value >= 0)
6. **Seed**: The seed used by the random number generator.
   - Value type : Integer
7. **New Column Name**: Name of new column(s)
   - Value type : String
   - Default : projected_
8. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Double, Float, Integer, Long
2. **n_components**: Number of components to keep.
   - Value type : Integer
   - Default : Number of feature columns (value >= 1)
3. **svd_solver**: Solver for Singular Value Decomposition.
4. **tol**: Tolerance for singular values computed by 'SVD Solver' == 'ARPACK'.
   - Value type : Double
   - Default : 0.0 (value >= 0)
5. **iterated_power**: Number of iterations for the power method computed by 'SVD Solver' == 'Randomized'.
   - Value type : Integer
   - Default : 'auto' (value >= 0)
6. **seed**: The seed used by the random number generator.
   - Value type : Integer
7. **new_column_name**: Name of new column(s)
   - Value type : String
   - Default : projected_
8. **group_by**: Columns to group by

#### Outputs: table, model

