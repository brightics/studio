## Format
부트스트랩 기반 이상감지
## Description

부트스트랩 기법은 관찰 데이터의 모수 분포에 대한 가정없이 사용가능한 비모수 통계 기법이다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **Target Limits**<b style="color:red">*</b>: 콘트롤 리밋 선택
   - Available items
      - Ucl (default)
      - Lcl (default)
3. **Confidence Level(0 < value < 1)**: 신뢰수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **Number of Samples(50 <= value <= 1000)**: 샘플 크기(50 <= value <= 1000)
   - Value type : Integer
   - Default : 100

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import bootlimit
res = bootlimit(input_table = ,feature_cols = ,limits = ,alpha = ,bootstrap = )
res['out_table']
```


#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **limits**<b style="color:red">*</b>: 콘트롤 리밋 선택
   - Available items
      - ucl (default)
      - lcl (default)
3. **alpha**: 신뢰수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **bootstrap**: 샘플 크기(50 <= value <= 1000)
   - Value type : Integer
   - Default : 100

#### Outputs: table

