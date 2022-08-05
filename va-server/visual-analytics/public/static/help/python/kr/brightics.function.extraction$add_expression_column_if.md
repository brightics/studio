## Format
주어진 계산식으로 새로운 값을 가진 컬럼 생성


## Description
본 함수는 주어진 계산식으로 새로운 값을 생성 한 후, 아웃풋 테이블에 새로운 컬럼을 추가한다. 계산식은 Python 혹은 SQLight 문법으로 작성 할 수 있다. 

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 인풋 테이블

#### OUTPUT
1. **out_table**: (Table) 생성된 컬럼을 포함한 테이블 

#### PARAMETER
1. **Add Column**<b style="color:red">*</b>: 새로운 컬럼 추가를 위한 세팅
   - **New Column Name**<b style="color:red">*</b> : 생성 할 컬럼 이름
   - **New Column Type**<b style="color:red">*</b> : 컬럼 타입
   - **Expression Type**<b style="color:red">*</b> : 계산식 문법 타입
   - **Condition**<b style="color:red">*</b> : 조건식 및 값

### Python
#### USAGE
```
add_expression_column_if(table = , expr_type = , new_col = , conditions = , values = , else_value = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 인풋 테이블

#### OUTPUT
1. **table**: (Table)  생성된 컬럼을 포함한 테이블 

#### PARAMETER
1. **new_col**<b style="color:red">*</b> : 생성 할 컬럼 이름
    - Type: str
2. **expr_type**<b style="color:red">*</b> : 계산식 문법 타입
    - Type: str
    - Default / Range: sqlite (sqlite | python)
3. **conditions**<b style="color:red">*</b> : 조건식
    - Type: str
4. **values**<b style="color:red">*</b> : 조건식이 참일 때 입력될 값
    - Type: str
5. **else_value**<b style="color:red">*</b> : 조건식이 거짓일 때 입력될 값
    - Type: str    

## Example
### VA

**<a href="/static/help/python/sample_model/add_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_column.PNG"  width="800px" style="border: 1px solid gray" >

위 워크플로우는 sample_iris 데이터를 이용하여 새로운 컬럼을 생성하는 예제이다. 새로운 컬럼은 주어진 조건식에 따라 생성되며, 이때 사용한 파라메터 및 조건식은 아래와 같다. 

++Parameters++
1. **New Column Name**<b style="color:red">*</b>: isVirginica
2. **New Column Type**<b style="color:red">*</b>: String
3. **Expression Type**<b style="color:red">*</b>: SQLite
4. **Condition**<b style="color:red">*</b>: species == 'virginica'


### Python
```
from brightics.function.extraction import add_expression_column_if
input_table = inputs[0]
res = add_expression_column_if(table = input_table, 
			       expr_type = "sqlite",
			       new_col = "isVirginica",
			       conditions = ["species == 'virginica'"],
			       values = "True",
			       else_value = "False")
output = res['out_table']
```

In this python script, Add Column function is applied to the input data to generate a new column based on a given formula. 