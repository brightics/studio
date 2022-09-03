## Format
선택된 컬럼을 기준으로 데이터를 정렬하는 함수

## Description

본 함수는 인풋 테이블의 데이터를 입력된 규칙을 기준으로 정렬하는 함수이다.  

Reference
- <https://en.wikipedia.org/wiki/Sorting>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 정렬 대상 데이터 테이블.

#### OUTPUT
1. **table**: (Table) 정렬된 테이블.    

#### PARAMETER
1. **Sort Rule**<b style="color:red">*</b>: 정렬 기준 컬럼 및 정렬 순서 (desc, asc).

2. **Group By**: Group by 기준 컬럼.


### Python
#### USAGE
```
sort(table =, input_cols = , is_asc = , group_by = )
```
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 정렬 대상 데이터 테이블.

#### OUTPUT
1. **table**: (Table) 정렬된 테이블.   

#### PARAMETER
1. **input_cols**<b style="color:red">*</b>: 정렬 기준 컬럼.
   - Allowed column type : Double, Float, Integer, Long, String
2. **is_asc**: 오름차순 정렬 여부.
   - Type : bool or list[bool]
   - Default / Range: True (True | False)
3. **group_by**: Group by 기준 컬럼.
   - Type : list[str]

## Example
### VA

**<a href="/static/help/python/sample_model/sort.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/sort.PNG"  width="800px" style="border: 1px solid gray" >


<br> 위 워크플로우는 Sort 함수를 사용하여 sample_iris 데이터를 정렬하는 예시이다. 정렬의 기준이 되는 파라매터는 아래와 같다.<br>

++Parameters++
1. **Sort Rule**: (1) sepal_length, ASC, (2) sepal_width, DESC


### Python
```
from brightics.function.manipulation import sort
input_table = inputs[0]
res = sort(table = input_table,
		   input_cols = ["sepal_length", "sepal_width"], 
		   is_asc = [True, False], 
		   group_by = None)
output = res['out_table']
```
<br> 위 코드는 Sort 함수를 사용하여 sample_iris 데이터를 정렬하는 스크립트 예시이다.<br>