## Format



## Description
This function detect anomalies based on Anomaly Detection T2 Train Model

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Time Column**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table

### Python

#### USAGE
```python
from brightics.function.ad import t2Predict
res = t2Predict(input_table = ,input_model = ,time_col = )
res['ad_score']
res['ad_alarm']
res['ad_cl']
```
#### Inputs: table, model

#### Parameters
1. **time_col**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table

