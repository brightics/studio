## Format
오토인코더 모델을 통한 시계열 데이터의 이상감지
## Description


본 함수는 오토인코더 모델을 통한 시변환 데이터의 이상감지 기능을 제공한다. 본 함수는 각 피쳐가 서로 상관관계가 있는 데이터에서, 간단한 임계값으로 이상치를 설명하기 힘들 경우 유용하다.  

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Time Column**<b style="color:red">*</b>: 시각 컬럼
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
1. **time_col**<b style="color:red">*</b>: 시각 컬럼
   - Allowed column type : Integer, Long, String

#### Outputs: table, table, table, table

