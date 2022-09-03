## Format

## Description
The module takes as input time varying data in scenarios where variables correlate to each other and it is difficult to get a reliability of detected anomalies using a simple threshold.

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
from brightics.function.ad import autoencoderPredict
res = autoencoderPredict(input_table = ,input_model = ,time_col = )
res['re_score']
res['re_alarm']
res['re_cl']
res['ae_score']
```
#### Inputs: table, model

#### Parameters
1. **time_col**<b style="color:red">*</b>: Time Column
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table, table

