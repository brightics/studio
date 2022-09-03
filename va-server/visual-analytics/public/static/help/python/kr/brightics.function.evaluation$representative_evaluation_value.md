
## Format
Evaluation 결과를 Model Manager에 저장하기위한 함수 

## Description

Evaluation 결과를 Model Manager에 저장하기위한 함수 

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Evaluation 결과가 저장된 테이블.

#### PARAMETER
1. **Input Column**<b style="color:red">*</b>: 저장할 Evaluation 컬럼
   - Allowed column type : Integer, Long, Float, Double
   

### Python
#### USAGE

```
representative_evaluation_value(table = ,input_col = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table)  Evaluation 결과가 저장된 테이블.
#### PARAMETER
1. **input_col**<b style="color:red">*</b>: 저장할 Evaluation 컬럼
   - Allowed column type : Integer, Long, Float, Double


## Example


### Python

```
from brightics.function.evaluation import representative_evaluation_value
res = representative_evaluation_value(table = ,input_col = )
```

