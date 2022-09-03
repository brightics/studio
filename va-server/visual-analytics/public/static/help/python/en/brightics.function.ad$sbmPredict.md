## Format



## Description
This function detect anomalies based on Anomaly Detection SBM Train Model

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Time Column**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table, table

### Python

#### USAGE
```python
from brightics.function.ad import sbmPredict
res = sbmPredict(input_table = ,input_model = ,time_col = )
res['ad_score']
res['ad_alarm']
res['ad_cl']
res['ad_squre_score']
```
#### Inputs: table, model

#### Parameters
1. **time_col**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table, table

