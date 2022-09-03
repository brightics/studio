## Format



## Description
It is extremely important that we preprocess our data before feeding it into our model.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Moving Type**<b style="color:red">*</b>: Moving Type
   - Available items
      - Sliding Window (default)
      - Batch
3. **Step**: Step
   - Value type : Integer
   - Default : 1
4. **Calculation Method**<b style="color:red">*</b>: Calculation Method
   - Available items
      - rms
      - mean
      - std
      - var
      - min
      - max
      - median
      - sum
      - mode
5. **Window Size(1 < value <= 10000)**: Window Size
   - Value type : Integer
   - Default : 30
6. **Index Column**: Index Column
   - Allowed column type : String, Integer, Long, Double

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import preprocessing
res = preprocessing(input_table = ,feature_cols = ,moving_type = ,step = ,calculation_method = ,winsize = ,index_col = )
res['output_table']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **moving_type**<b style="color:red">*</b>: Moving Type
   - Available items
      - slide (default)
      - batch
3. **step**: Step
   - Value type : Integer
   - Default : 1
4. **calculation_method**<b style="color:red">*</b>: Calculation Method
   - Available items
      - rms
      - mean
      - std
      - var
      - min
      - max
      - median
      - sum
      - mode
5. **winsize**: Window Size
   - Value type : Integer
   - Default : 30
6. **index_col**: Index Column
   - Allowed column type : String, Integer, Long, Double

#### Outputs: table

