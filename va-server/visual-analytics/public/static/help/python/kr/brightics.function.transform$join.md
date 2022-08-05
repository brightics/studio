## Format
SQL 스타일 조인 작업을 수행하는 함수

## Description

본 함수는 SQL 스타일 조인 작업을 수행한다.

---

## Properties
### VA
#### INPUT
1. **left_table**<b style="color:red">*</b>: (Table) 조인 대상 좌측 데이터 테이블.
2. **right_table**<b style="color:red">*</b>: (Table) 조인 대상 우측 데이터 테이블.
#### OUTPUT
1. **table**: (Table) 정렬된 테이블.    
#### PARAMETER
1. **Join Type**<b style="color:red">*</b>: SQL 조인 타입
2. **Left Keys**<b style="color:red">*</b>: 좌측 조인 키 컬럼.
3. **Right Keys**<b style="color:red">*</b>: 우측 조인 키 컬럼.
4. **Left Suffix**: 좌측 테이블 컬럼 접미사.
5. **Right Suffix**: 우측 테이블 컬럼 접미사
6. **Sort**: 결과 테이블 정렬 여부. 

### Python
#### USAGE
```
join(left_table =, right_table =, left_on =, right_on =, how =, lsuffix =, rsuffix =, sort =)
```

#### INPUT
1. **left_table**<b style="color:red">*</b>: (Table) 조인 대상 좌측 데이터 테이블.
2. **right_table**<b style="color:red">*</b>: (Table) 조인 대상 우측 데이터 테이블.

#### OUTPUT
1. **table**: (Table) 정렬된 테이블.    

#### PARAMETER
1. **how**<b style="color:red">*</b>: SQL 조인 타입
2. **left_on**<b style="color:red">*</b>: 좌측 조인 키 컬럼.
   - Value type : _list_[_str_] 
3. **right_on**<b style="color:red">*</b>: 우측 조인 키 컬럼.
   - Value type : _list_[_str_] 
4. **lsuffix**: 좌측 테이블 컬럼 접미사.
   - Value type : _str_
   - Default value: _left
5. **rsuffix**: 우측 테이블 컬럼 접미사
   - Value type : _str_
   - Default value: _right
6. **sort**: 결과 테이블 정렬 여부.
   - Type : _bool_
   - Default / Range: False ( True | False)
## Example
### VA

**<a href="/static/help/python/sample_model/Join.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/join.PNG"  width="800px" style="border: 1px solid gray" >

<br>위의 워크플로우는 두개의 테이블을 _species_ 컬럼 기준으로 Inner join을 수행하는 예제이다. 이때 사용된 파라메터는 아래와 같다. 


++Parameters++
1. **Join Type**<b style="color:red">*</b>: 'Inner Join'
2. **Left Keys**<b style="color:red">*</b>: 'species'
3. **Right Keys**<b style="color:red">*</b>: 'species'
4. **Left Suffix**: '_left'
5. **Right suffix**: '_right'
6. **Sort**: False 


### Python

```
from brightics.function.transform import join
res = join(left_table=inputs[0], right_table=inputs[1],
           left_on='species', right_on='species', how='inner',
           lsuffix='_left', rsuffix='_right', sort=False)
table = res['table'] 
```

<br>위의 코드는 두개의 테이블을 _species_ 컬럼 기준으로 Inner join을 수행하는 스크립트 예제이다.

