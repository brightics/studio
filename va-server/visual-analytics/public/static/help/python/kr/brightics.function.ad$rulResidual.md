## Format


## Description

RUL(잔여 유효 수명) 모델의 잔차를 계산한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Time Column**<b style="color:red">*</b>: 시각 컬럼
   - Allowed column type : Integer, Long, String
2. **Residual Columns**<b style="color:red">*</b>: 잔차 컬럼
   - Allowed column type : Integer, Long, Double, Float
3. **Number of Tree**<b style="color:red">*</b>: 트리 개수
   - Value type : Integer
   - Default : ( 1 < value <= 100 )
4. **Number of Core**<b style="color:red">*</b>: 분산 코어 개수
   - Value type : Integer
   - Default : ( 0 < value <= 10 )

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import rulResidual
res = rulResidual(table = ,time_col = ,resi_cols = ,ntree = ,core_cnt = )
res['out_table']
```

#### Inputs: table

#### Parameters
1. **time_col**<b style="color:red">*</b>: 시각 컬럼
   - Allowed column type : Integer, Long, String
2. **resi_cols**<b style="color:red">*</b>: 잔차 컬럼
   - Allowed column type : Integer, Long, Double, Float
3. **ntree**<b style="color:red">*</b>: 트리 개수
   - Value type : Integer
   - Default : ( 1 < value <= 100 )
4. **core_cnt**<b style="color:red">*</b>: 분산 코어 개수
   - Value type : Integer
   - Default : ( 0 < value <= 10 )

#### Outputs: table

