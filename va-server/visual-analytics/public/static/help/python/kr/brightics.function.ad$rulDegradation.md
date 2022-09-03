## Format



## Description
RUL(잔여 유효 수명) 모델 잔차의 Degradation 을 계산 한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Time Column**<b style="color:red">*</b>: 타임스탬프 컬럼 
   - Allowed column type : String
2. **Residual Columns**<b style="color:red">*</b>: 잔차 컬럼
   - Allowed column type : Integer, Long, Double, Float
3. **Broken Date**<b style="color:red">*</b>: Broken Date
   - Value type : String
4. **Apply Log**<b style="color:red">*</b>: Degradation 계산에 로그 적용 여부 

#### Outputs: table, model

### Python

#### USAGE
```python
from brightics.function.ad import rulDegradation
res = rulDegradation(table = ,time_col = ,resi_cols = ,broken_date = ,is_log = )
res['out_table']
res['model']
```
#### Inputs: table

#### Parameters
1. **time_col**<b style="color:red">*</b>: 타임스탬프 컬럼 
   - Allowed column type : String
2. **resi_cols**<b style="color:red">*</b>: 잔차 컬럼
   - Allowed column type : Integer, Long, Double, Float
3. **broken_date**<b style="color:red">*</b>: Broken Date
   - Value type : String
4. **is_log**<b style="color:red">*</b>: Apply logarithmic for degradation calculationDegradation 계산에 로그 적용 여부 
#### Outputs: table, model

