## Format


## Description

SBM (Similarity-base Model)을 이용한 이상감지 모델을 학습한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: 신뢰수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **Number of cluster(s)(1 <= value <= 10)**: 분산 코어 개수(1 <= value <= 10)
   - Value type : Integer
   - Default : 1
4. **Binsize(10 <= value <= 100)**: Bin 개수 (10 <= value <= 100)
   - Value type : Integer
   - Default : 30

#### Outputs: table, table, model

### Python

#### USAGE
```python
from brightics.function.ad import sbmTrain
res = sbmTrain(input_table = ,feature_cols = ,alpha = ,cluster = ,binsize = )
res['output_table_score']
res['output_table_cl']
res['output_model']
```

#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>:  피쳐 컬럼
   - Allowed column type : Integer, Long, Double
2. **alpha**: 신뢰 수준(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **cluster**: 분산 코어 개수(1 <= value <= 10)
   - Value type : Integer
   - Default : 1
4. **binsize**: Bin 개수 (10 <= value <= 100)
   - Value type : Integer
   - Default : 30

#### Outputs: table, table, model

