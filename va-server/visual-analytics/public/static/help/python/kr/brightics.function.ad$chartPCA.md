## Format
PCA 결과값의 산포도(scatter plot) 생성


## Description
PCA 결과값의 산포도(scatter plot) 생성

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>:피쳐
 컬럼
   - Allowed column type : Integer, Long, Double

#### Outputs: model

### Python

#### USAGE
```python
from brightics.function.ad import chartPCA
res = chartPCA(input_table = ,feature_cols = )
res['output_model']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: 피쳐
 컬럼
   - Allowed column type : Integer, Long, Double

#### Outputs: model

