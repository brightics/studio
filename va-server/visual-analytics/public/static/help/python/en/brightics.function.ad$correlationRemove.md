## Format



## Description
Remove highly correlated feature

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Double, Float, Integer, Long
2. **Time Column**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String
3. **Lower threshold**<b style="color:red">*</b>: Lower threshold
   - Value type : Double
   - Default : Lower threshold (0 <= value <= 1)
4. **Upper threshold**<b style="color:red">*</b>: Upper threshold
   - Value type : Double
   - Default : Upper threshold (0 <= value <= 1)

#### Outputs: table, model

### Python

#### USAGE
```python
from brightics.function.ad import correlationRemove
res = correlationRemove(table = ,input_cols = ,time_col = ,low = ,high = )
res['out_table']
res['model']
```
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Double, Float, Integer, Long
2. **time_col**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String
3. **low**<b style="color:red">*</b>: Lower threshold
   - Value type : Double
   - Default : Lower threshold (0 <= value <= 1)
4. **high**<b style="color:red">*</b>: Upper threshold
   - Value type : Double
   - Default : Upper threshold (0 <= value <= 1)

#### Outputs: table, model

