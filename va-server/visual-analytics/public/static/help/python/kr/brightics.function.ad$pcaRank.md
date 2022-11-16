## Format

PCA 피쳐
 중요도 순위 계산
## Description

본 함수는 PCA 피쳐
 중요도 순위 계산한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: 피쳐
컬럼
   - Allowed column type : Double, Float, Integer, Long

#### Outputs: table, model

### Python

#### USAGE
```python
from brightics.function.ad import pcaRank
res = pcaRank(table = ,input_cols = )
res['out_table']
res['model']
```

#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: 피쳐
컬럼
   - Allowed column type : Double, Float, Integer, Long

#### Outputs: table, model

