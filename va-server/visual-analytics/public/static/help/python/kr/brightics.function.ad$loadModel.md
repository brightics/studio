## Format
저장된 이상감지 모델 파일 로딩


## Description
본 함수는 파일 형태로 저장된 이상 감지 모델을 로딩하여 브라이틱스에서 사용가능한 모델 객체를 생성한다. 
해당 파일은 AD Unload Model 함수가 생성 할 수 있다.  

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: This function has no input data.

#### Parameters
1. **Name**<b style="color:red">*</b>: 기본 위치에 저장된 모델 파일명
   - Value type : String

#### Outputs: table, model

### Python

#### USAGE
```python
from brightics.function.ad import loadModel
res = loadModel(model_name = )
res['out_table']
res['out_model']
```
#### Inputs: This function has no input data.

#### Parameters
1. **model_name**<b style="color:red">*</b>: 기본 위치에 저장된 모델 파일명
   - Value type : String

#### Outputs: table, model

