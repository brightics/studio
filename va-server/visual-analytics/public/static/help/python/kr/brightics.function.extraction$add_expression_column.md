## Format


주어진 계산식으로 새로운 값을 가진 컬럼 생성

## Description

본 함수는 주어진 계산식으로 새로운 값을 생성 한 후, 아웃풋 테이블에 새로운 컬럼을 추가한다. 계산식은 Python 혹은 SQLight 문법으로 작성 할 수 있다. 

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 인풋 테이블
#### OUTPUT
1. **out_table**: (Table) 생성된 컬럼을 포함한 테이블 

#### PARAMETER
1. **New Column Name**<b style="color:red">*</b>: 생성 할 컬럼 이름

2. **Expression Type**<b style="color:red">*</b>: 계산식 문법 타입

3. **Expression**<b style="color:red">*</b>: 새로운 컬럼의 값 계산을 위한 계산식



## Example
### VA

**<a href="/static/help/python/sample_model/add_function_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_function_column.PNG"  width="800px" style="border: 1px solid gray" ><br> 


본 예제는 Add Function Column 함수의 간단한 사용법을 보여준다. 예제에서는 인풋 테이블의 _sepal_lenth_  컬럼값에 1을 더한 값으로 새로운 컬럼을 생성하고 있다. 

++Parameters++
1. **New Column Name**<b style="color:red">*</b>: new_col
2. **Expression Type**<b style="color:red">*</b>: SQLite
3. **Expression**<b style="color:red">*</b>: sepal_length + 1

