## Format
오토인코더 모델을 통한 시계열 데이터의 이상감지
## Description

본 함수는 오토인코더 모델을 통한 시변환 데이터의 이상감지 기능을 제공한다. 본 함수는 각 피쳐가 서로 상관관계가 있는 데이터에서, 간단한 임계값으로 이상치를 설명하기 힘들 경우 유용하다.  


## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: 신뢰 수준 (0 < value < 1)
   - Value type : Double
   - Default : 0.01

#### Outputs: table, table, model, table

### Python
#### USAGE
```python
from brightics.function.ad import autoencoderTrain
res = autoencoderTrain(input_table = ,feature_cols = ,alpha = )
res['output_table_score']
res['output_table_cl']
res['output_model']
res['output_table']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **alpha**: 신뢰 수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01

#### Outputs: table, table, model, table

