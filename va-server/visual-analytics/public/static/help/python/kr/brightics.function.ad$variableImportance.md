## Format
본 함수는 이상감지를 위한 변수의 중요도를 계산한다. 

## Description

본 함수는 이상감지를 위한 변수의 중요도를 계산한다. 

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double

#### Outputs: table, model

### Python
#### USAGE
```python
from brightics.function.ad import variableImportance
res = variableImportance(input_table = ,score_table = ,feature_cols = )
res['ad_variableImportance']
res['histogram_variableImportance']
```

#### Inputs: table, table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐 컬럼
   - Allowed column type : Integer, Long, Double

#### Outputs: table, model

