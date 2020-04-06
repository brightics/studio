## Format
### Python
```python
from brightics.function.statistics import kernel_density_estimation
res = kernel_density_estimation(table = ,input_col = ,points = ,bandwidth = ,kernel = ,group_by = )
res['out_table']
```

## Description
This function estimates the probability density function at each of the given evaluation points based on sample data. As evaluation points, you can enter either point list or range format point.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **Points**<b style="color:red">*</b>: A sequence of points for estimating Gaussian kernel. It can be altered via the second input table. Input as the following style : "1.0, 2.0, 3.0, 4.0, 5.0", or "1.0 to 5.0 by 1.0".
   - Value type : String
3. **Bandwidth**: Bandwidth used for kernel. Default: 1.0
   - Value type : Double
   - Default : 1.0 (value > 0)
4. **Kernel**: Kernel for density estimation
   - Available items
      - gaussian (default)
      - tophat
      - epanechnikov
      - exponential
      - linear
      - cosine
5. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : Integer, Long, Float, Double
2. **points**<b style="color:red">*</b>: A sequence of points for estimating Gaussian kernel. It can be altered via the second input table. Input as the following style : "1.0, 2.0, 3.0, 4.0, 5.0", or "1.0 to 5.0 by 1.0".
   - Value type : String
3. **bandwidth**: Bandwidth used for kernel. Default: 1.0
   - Value type : Double
   - Default : 1.0 (value > 0)
4. **kernel**: Kernel for density estimation
   - Available items
      - gaussian (default)
      - tophat
      - epanechnikov
      - exponential
      - linear
      - cosine
5. **group_by**: Columns to group by

#### Outputs: table

