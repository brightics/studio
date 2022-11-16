## Format


## Description

시퀀스 확률 비 테스트 (Sequential Probability Ratio Test)을 기반으로 이상치를 검출한다. 


## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: 신뢰 수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **beta(0 < value < 1)**: beta(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **sigma(0 <= value < 6)**: sigma(0 <= value < 6)
   - Value type : Double
   - Default : 3.0

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import sprtFilter
res = sprtFilter(input_table_score = ,input_model = ,feature_cols = ,alpha = ,beta = ,sigma = )
res['ad_filtered_alarm']
```

#### Inputs: table, model

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **alpha**: 신뢰 수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **beta**: beta(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **sigma**: sigma(0 <= value < 6)
   - Value type : Double
   - Default : 3.0

#### Outputs: table

