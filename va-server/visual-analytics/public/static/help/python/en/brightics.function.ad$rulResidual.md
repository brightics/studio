## Format


## Description
Calculate residual from input data.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Time Column**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String
2. **Residual Columns**<b style="color:red">*</b>: The name of the input columns for residual values.
   - Allowed column type : Integer, Long, Double, Float
3. **Number of Tree**<b style="color:red">*</b>: Number of Tree
   - Value type : Integer
   - Default : ( 1 < value <= 100 )
4. **Number of Core**<b style="color:red">*</b>: Number of Core
   - Value type : Integer
   - Default : ( 0 < value <= 10 )

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import rulResidual
res = rulResidual(table = ,time_col = ,resi_cols = ,ntree = ,core_cnt = )
res['out_table']
```

#### Inputs: table

#### Parameters
1. **time_col**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String
2. **resi_cols**<b style="color:red">*</b>: The name of the input columns for residual values.
   - Allowed column type : Integer, Long, Double, Float
3. **ntree**<b style="color:red">*</b>: Number of Tree
   - Value type : Integer
   - Default : ( 1 < value <= 100 )
4. **core_cnt**<b style="color:red">*</b>: Number of Core
   - Value type : Integer
   - Default : ( 0 < value <= 10 )

#### Outputs: table

