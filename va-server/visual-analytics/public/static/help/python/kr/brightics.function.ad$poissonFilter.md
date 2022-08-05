## Format


## Description


본 함수는 주어진 통계 가설 검증을 기반으로 희박한 오탐 결과(sparse false alarms)를 필터링 한다. 


---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐
 컬럼
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: 신뢰수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **Window size(1 < value <= total row size)**: 윈도우 크기(1 < value <= total row size)
   - Value type : Integer
   - Default : 30

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import poissonFilter
res = poissonFilter(input_table_alarm = ,input_model = ,feature_cols = ,alpha = ,winsize = )
res['ad_filtered_alarm']
```

#### Inputs: table, model

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐
 컬럼
   - Allowed column type : Integer, Long, Double
2. **alpha**: 신뢰 수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **winsize**: 윈도우 크기(1 < value <= total row size)
   - Value type : Integer
   - Default : 30

#### Outputs: table

