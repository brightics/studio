## Format
기 학습된 이상 감지 모델 파일 저장

## Description

Anomaly Detection Train 계열 함수가 학습한 모델을 파일로 저장한다. 
저장된 모델 파일은 AD Load Model 함수를 통해 읽을 수 있다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Name**: 파일 명
   - Value type : String
   - Default : output_model.model

#### Outputs: This function has no output data.

### Python

#### USAGE
```python
from brightics.function.ad import unloadModel
res = unloadModel(input_table = ,input_model = ,model_name = )

```
#### Inputs: table, model

#### Parameters
1. **model_name**: 파일 명
   - Value type : String
   - Default : output_model.model

#### Outputs: This function has no output data.

