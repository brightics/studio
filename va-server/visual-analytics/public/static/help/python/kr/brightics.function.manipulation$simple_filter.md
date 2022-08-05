## Format

데이터 필터링 함수

## Description

본 함수는 인풋 테이블로 부터 주어진 조건식에 만족하는 데이터만을 추출하는 함수이다. AND 혹은 OR 조건을 통해 한개 이상의 조건식을 설정 할 수 있다. 
 

Reference
- <https://en.wikipedia.org/wiki/Filter_(higher-order_function)>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 대상 데이터를 포함하는 테이블

#### OUTPUT
1. **table**: (Table) 조건식에 맞게 추출된 데이터 테이블 

#### PARAMETER
1. **Condition**<b style="color:red">*</b> : 필터링을 위한 조건식


### Python

#### USAGE
```
simple_filter(table =, main_operator =, input_cols =, operators =, operands = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 대상 데이터를 포함하는 테이블

#### OUTPUT
1. **table**: (Table) 조건식에 맞게 추출된 데이터 테이블 

#### PARAMETER
1. **main_operator**<b style="color:red">*</b>: 다중 조건식을 위한 논리연산자.
    - Type: str
    - Default / Range: And (And | Or)
2. **input_cols**<b style="color:red">*</b>: 조건식이 적용될 컬럼 리스트.  
    - Type: list[str]
3. **operators**<b style="color:red">*</b>: 조건식 연산자 리스트. 
    - Type: list[str]
    - Default / Range: == (== | != | In | Not In | Starts With | Ends With | Contain | Not Contain)
4. **operands**<b style="color:red">*</b>: 조건식의 피연산자 리스트. 
    - Type: list[str]


## Example
### VA

**<a href="/static/help/python/sample_model/filter.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/filter.PNG"  width="800px" style="border: 1px solid gray" >

<br>본 예제는 Filter 함수를 이용하여 sample_iris 데이터의 일부를 추출하는 예제를 보여준다. 예제에서는 _species_ = 'setosa'의 조건식을 설정하여, 이에 맞는 데이터만을 추출하고 있다. 

++Parameters++
1. **Condition**<b style="color:red">*</b>: And, species, ==, 'setosa'


### Python
```
from brightics.function.manipulation import simple_filter
input_table = inputs[0]
res = simple_filter(table = input_table,
  		    main_operator = "and", 
	            input_cols = ["species"], 
	            operators = ["=="], 
		    operands = ["'setosa'"])
output = res['out_table']
```

<br>본 예제는 Filter 함수를 이용하여 sample_iris 데이터의 일부를 추출하는 예제를 보여준다. 예제에서는 _species_ = 'setosa'의 조건식을 설정하여, 이에 맞는 데이터만을 추출하고 있다. 