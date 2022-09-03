## Format



## Description
Predict data using a trained RUL model.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Time Column**<b style="color:red">*</b>: The name of the input column for timestamp.
   - Allowed column type : String
2. **Residual Columns**<b style="color:red">*</b>: The name of the input columns for residual values.
   - Allowed column type : Integer, Long, Double, Float
3. **Initial Date**<b style="color:red">*</b>: Initial Date
   - Value type : String

#### Outputs: model, table, table

### Python

#### USAGE
```python
from brightics.function.ad import rulPredict
res = rulPredict(resi_table = ,rul_model = ,time_col = ,resi_cols = ,init_day = )
res['out_model']
res['rul_table']
res['risk_table']
```
#### Inputs: table, model

#### Parameters
1. **time_col**<b style="color:red">*</b>: The name of the input column for timestamp.
   - Allowed column type : String
2. **resi_cols**<b style="color:red">*</b>: The name of the input columns for residual values.
   - Allowed column type : Integer, Long, Double, Float
3. **init_day**<b style="color:red">*</b>: Initial Date
   - Value type : String

#### Outputs: model, table, table

