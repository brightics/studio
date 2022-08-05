# Select Column
Select specified columns from an input table.
인풋 테이블로부터 지정된 컬럼만을 추출하는 함수

## Description

본 함수는 인풋 테이블로 부터 특정 컬럼, 혹은 컬럼 리스트를 지정하여 새로운 테이블을 생성한다. 



## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 대상 테이블
#### OUTPUT
1. **out_table**: (Table) 지정된 컬럼으로 생성된 테이블
#### PARAMETER
1. **Selected Column**<b style="color:red">*</b>: 신규 테이블 생성을 위한 컬럼.



### Python
#### USAGE

```
res = select_column(table = , input_cols = )
```


#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 대상 테이블
#### OUTPUT
1. **out_table**: (Table) 지정된 컬럼으로 생성된 테이블
#### PARAMETER
1. **input_cols**<b style="color:red">*</b>: 신규 테이블 생성을 위한 컬럼.


## Example
### VA

**<a href="/static/help/python/sample_model/select_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/select_column.PNG"  width="800px" style="border: 1px solid gray" >

<br> 위의 워크플로우는 Select Column 함수를 사용하여, sample_iris 테이블의 일부 컬럼 [sepal_length, species]을 가진 신규 테이블을 생성하는 예제이다. 


++Parameters++
1. **Selected Column**<b style="color:red">*</b>: sepal_length


### Python

```
from brightics.function.transform import select_column
res = select_column(table=inputs[0], input_cols=['sepal_length', 'species'])
table = res['out_table']
```

<br>위의 코드는 Select Column 함수를 사용하여, sample_iris 테이블의 일부 컬럼 [sepal_length, species]을 가진 신규 테이블을 생성하는 예제이다. 
