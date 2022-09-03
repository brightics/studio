## Format



## Description
본 함수는 AD T2 Train 함수로부터 학습된 Hotelling’s T2 모델을 기반으로 이상치를 탐지한다.


---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Time Column**<b style="color:red">*</b>: 시각 컬럼
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
1. **time_col**<b style="color:red">*</b>: 시각 컬럼
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table

