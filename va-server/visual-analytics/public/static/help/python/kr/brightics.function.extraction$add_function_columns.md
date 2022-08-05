# Add Function Columns
주어진 SQL로 새로운 값을 가진 컬럼 생성

## Description
본 함수는 주어진 SQL문으로 새로운 컬럼을 생성하여 아웃풋 테이블에 추가한다. 본 함수를 통해 다수의 컬럼을 생성할 수 있다. 


## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 인풋 테이블 
#### OUTPUT
1. **out_table**: (Table) 신규 컬럼을 포함하는 테이블
#### Parameters
1. **Add Column**<b style="color:red">*</b>: 컬럼명과 해당 컬럼 값 생성을 위한 SQL문을 갖는 리스트 


## Example
### VA

**<a href="/static/help/python/sample_model/add_function_columns.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_function_columns.PNG"  width="800px" style="border: 1px solid gray" ><br>

++Parameters++
1. **Add Column**<b style="color:red">*</b>: case when species = 'setosa' then 1 else 0 end


본 예제는 iris 데이터 값을 읽은 후, _species_ = 'setosa' 인지 여부를 0 혹은 1로 판단하는 새로운 컬럼 _case_species_ 를 생성한다. 이를 위한 SQL 문은 "case when species = 'setosa' then 1 else 0 end" 이다.