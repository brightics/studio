## Format



## Description
This function fits a polynomial regression model based on RUL degradation and prior statistics data.

RUL(잔여 유효 수명) 모델의 degradation과 사전 통계 데이터를 기반으로 다항 회귀 모델을 학습한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **RUL column**<b style="color:red">*</b>:  잔여 유효 수명 컬럼
   - Allowed column type : Integer, Long, Float, Double
2. **Degradation column**<b style="color:red">*</b>: degradation 컬럼
   - Allowed column type : Integer, Long, Float, Double
3. **RUL prior mean**<b style="color:red">*</b>: 수명의 평균 값 (h)
   - Value type : Double
   - Default : (value > 0)
4. **RUL prior standard deviation**<b style="color:red">*</b>: 수명의 표준편차
   - Value type : Double
   - Default : (value > 0)
5. **Polynomial Degree**<b style="color:red">*</b>: 변수항 차수
   - Value type : Integer
   - Default : (1 <= value <= 10)

#### Outputs: model

### Python

#### USAGE
```python
from brightics.function.ad import rulTrain
res = rulTrain(degradation_table = ,degradation_model = ,life_col = ,degradation_col = ,rul_mean = ,rul_std = ,poly_parameters = )
res['model']
```
#### Inputs: table, model

#### Parameters
1. **life_col**<b style="color:red">*</b>:   잔여 유효 수명 컬럼
   - Allowed column type : Integer, Long, Float, Double
2. **degradation_col**<b style="color:red">*</b>: degradation 컬럼
   - Allowed column type : Integer, Long, Float, Double
3. **rul_mean**<b style="color:red">*</b>: 수명의 평균 값
   - Value type : Double
   - Default : (value > 0)
4. **rul_std**<b style="color:red">*</b>: 수명의 표준편차
   - Value type : Double
   - Default : (value > 0)
5. **poly_parameters**<b style="color:red">*</b>: 변수항 차수
   - Value type : Integer
   - Default : (1 <= value <= 10)

#### Outputs: model

