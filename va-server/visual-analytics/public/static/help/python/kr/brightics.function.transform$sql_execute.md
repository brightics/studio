# Query Executor

이 함수는 실행된 SQL 쿼리에 대한 값을 반환한다.

## Description
이 함수는 실행된 SQL 쿼리에 대한 값을 반환한다. 주요 함수에 대한 설명은 <https://www.sqlite.org/index.html> 를 참조. UDF(User defined function)는 다음과 같다: 

### Aggregate Functions

#### variance, var_pop
##### - description : 입력 컬럼의 분산.
##### - ex : select variance(sepal_length) as var_sepal_length from  #{DF(0)}
##### - ex : select var_pop(sepal_length) as var_pop_sepal_length from  #{DF(0)}

#### var_samp
##### - description : 입력 컬럼의 표본 분산.
##### - ex : select var_samp(sepal_length) as var_samp_sepal_length from  #{DF(0)}

#### stddev_pop
##### - description : 인풋 컬럼의 표준편차.
##### - ex : select stddev_pop(sepal_length) as stddev_pop_sepal_length from  #{DF(0)}

#### stddev_samp
##### - description : 인풋 컬럼의 표본 표준편차.
##### - ex : select stddev_samp(sepal_length) as stddev_samp_sepal_length from  #{DF(0)}

#### covar_pop
##### - description : 인풋 컬럼들의 공분산.
##### - ex : select covar_pop(sepal_length, sepal_width) as covar_pop_sepal_length_sepal_width from  #{DF(0)}

#### covar_samp
##### - description : 입력 컬럼들의 표본 공분산.
##### - ex : select covar_samp(sepal_length, sepal_width) as covar_samp_sepal_length_sepal_width from  #{DF(0)}

#### percentile
##### - description : 인풋 컬럼의 백분위 수.
##### - ex : select percentile(sepal_length, 35) as percentile_sepal_length from  #{DF(0)}

#### collect_list
##### - description : 인풋 컬럼의 요소 목록. (중복 허용)
##### - ex : select collect_list(sepal_length) as collect_list_sepal_length from  #{DF(0)}

#### collect_set
##### - description : 인풋 컬럼의 요소들의 집합. (중복 허용하지 않음)
##### - ex : select collect_set(sepal_length) as collect_set_sepal_length from  #{DF(0)}



### Constant Functions

#### e
##### - description : 오일러 수.
##### - ex : select sepal_length + e() from #{DF(0)}

#### pi
##### - description : 파이.
##### - ex : select sepal_length + pi() from  #{DF(0)}



### Lambda Functions

#### log, ln
##### - description : log_e ()자연 로그 함수 (e는 오일러 수).
##### - ex : select log(sepal_length), ln(sepal_length), log(10), ln(10) from  #{DF(0)}

#### log10
##### - description :  log_10() 로그 함수.
##### - ex : select log10(sepal_length), log10(10) from  #{DF(0)}

#### log2
##### - description : log_2() 로그 함수.
##### - ex : select log2(sepal_length), log2(10) from  #{DF(0)}

#### exp
##### - description : e^() 지수 함수 (e는 오일러 수).
##### - ex : select exp(sepal_length), exp(10) from  #{DF(0)}

#### exp2
##### - description : 2^() 지수 함수.
##### - ex : select exp2(sepal_length), exp2(10) from  #{DF(0)}

#### sqrt
##### - description : 제곱근 함수.
##### - ex : select sqrt(sepal_length), sqrt(2) from  #{DF(0)}

#### ceil
##### - description : 천장 함수.
##### - ex : select ceil(sepal_length), ceil(-1.5) from  #{DF(0)}

#### floor
##### - description : 바닥 함수.
##### - ex : select floor(sepal_length), floor(-1.5) from  #{DF(0)}

#### sign
##### - description : 사인 함수.
##### - ex : select sign(sepal_length), sign(-1.5) from  #{DF(0)}

#### factorial
##### - description : 팩토리얼 함수.
##### - ex : select factorial(ceil(sepal_length)), factorial(5) from  #{DF(0)}

#### pow
##### - description : 실수 a, b에 대해 pow(a, b) = a^b.
##### - ex : select pow(sepal_length, sepal_width), pow(2, 3) from  #{DF(0)}

#### ljust, rjust
##### - description : 주어진 길이에 맞춰 string을 좌(우)로 정렬한다.
##### - ex : select ljust(sepal_length, 7, '*'), ljust('abc', 7, '*'), rjust(sepal_length, 5, '*'), rjust('abc', 5, '*') from #{DF(0)}

#### is_null
##### - description : 결측치를 탐지하고 boolean 값을 반환한다..
##### - ex : select is_null(sepal_length), is_null(5), is_null(null) from #{DF(0)}

#### sin
##### - description: 라디안 기반 사인 함수. 
##### - ex: select sin(sepal_length), sin(sepal_width) from #{DF(0)}

#### cos
##### - description: 라디안 기반 코사인 함수. 
##### - ex: select cos(sepal_length), cos(sepal_width) from #{DF(0)}

#### tan
##### - description: 라디안 기반 탄젠트 함수. 
##### - ex: select tan(sepal_length), tan(sepal_width) from #{DF(0)}

#### cot
##### - description: 라디안 기반 코탄젠트 함수. 
##### - ex: select cot(sepal_length), cot(sepal_width) from #{DF(0)}

#### asin
##### - description: 라디안 기반 역 사인 함수. 
##### - ex: select asin(sepal_length), asin(sepal_width) from #{DF(0)}

#### acos
##### - description: 라디안 기반 역 코사인 함수. 
##### - ex: select acos(sepal_length), acos(sepal_width) from #{DF(0)}

#### atan
##### - description: 라디안 기반 역 탄젠트 함수. 
##### - ex: select atan(sepal_length), atan(sepal_width) from #{DF(0)}

#### acot
##### - description: 라디안 기반 역 콘탄젠트 함수. 
##### - ex: select acot(sepal_length), acot(sepal_width) from #{DF(0)}

### Regular Expression Related Functions

#### regexp
##### - description : string 혹은 string 타입 컬럼에서 패턴을 찾는다.
##### - ex : select regexp('set', species), regexp('setosa2', species), regexp('a', 'a b'), regexp('a b', 'a') from #{DF(0)}

#### regexp_replace
##### - description : string 혹은 string 타입 컬럼에서 패턴을 찾고 대체한다.
##### - ex : select regexp_replace(species, 'setosa', 'setosa_2'), regexp_replace('a b c', 'a', 'value') from #{DF(0)}

#### regexp_like
##### - description: string이 해당 패턴과 일치하면 True를 반환하고, 그렇지 않음녀 False를 반환한다.
##### - ex: select regexp_like(column_name, '[A-Z]+') from #{DF(0)}

#### regexp_count
##### - description: string에서 패턴이 일치하는 갯수를 반환한다.
##### - ex: select regexp_count(column_name, '[A-Z]+'), regexp_count(column_name, '[A-Z]+', 2) from #{DF(0)}

#### regexp_substr
##### - description: regexp_instr 함수와 비슷하지만, substring의 위치를 반환하는 대신 substring을 반환한다.
##### - ex: select regexp_substr(column_name, '[A-Z]+'), regexp_substr(column_name, '[A-Z]+', 2), regexp_substr(column_name, '[A-Z]+', 3, 3) from #{DF(0)}

#### regexp_instr
##### - description: 일치하는 substring의 시작과 끝 위치를 나타내는 integer를 반환한다.
##### - ex: select regexp_instr(column_name, '[A-Z]+'), regexp_instr(column_name, '[A-Z]+', 2), regexp_instr(column_name, '[A-Z]+', 6, 2), regexp_instr(column_name, '[A-Z]+', 3, 2, 1) from #{DF(0)}

### Datetime Related Functions

#### datediff
##### - description : 두 날짜 컬럼의 차이값을 반환한다.
##### - ex : select datediff(column1, column2) from #{DF(0)}



### Array Related Functions

#### concat_ws
##### - description : 주어진 분리 문자로 string들을 연결한다.
##### - ex : select concat_ws('^', column) from  #{DF(0)}

#### split
##### - description : 주어진 분리 문자로 string을 분리한다.
##### - ex : select split(species, 't') from  #{DF(0)}

#### size
##### - description : 인풋 컬럼의 array-like 값의 크기를 반환한다. 
##### - ex : select size(column) from #{DF(0)}

---


## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 쿼리를 실행하기 위한 테이블 데이터.
#### OUTPUT
1. **out_table**: (Table) Sql 쿼리 결과.
#### PARAMETER
2. **SQL**<b style="color:red">*</b>: SQL 명령문 


### Python
#### USAGE
```
sql_execute(tables = ,query = )
```

#### OUTPUT
1. **out_table**: (Table) Sql 쿼리 결과.
#### PARAMETER
1. **tables**<b style="color:red">*</b>: 쿼리를 실행하기 위한 테이블 데이터.
    * Value type : *list[Table]*<br><br>
    
2. **SQL**<b style="color:red">*</b>: SQL 명령문 
    * Value type : *str*    


## Example
### VA

**<a href="/static/help/python/sample_model/query_executor.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/query_executor.PNG"  width="800px" style="border: 1px solid gray" >

<br> 이 튜토리얼 워크플로우에서, sample iris 데이터에 다음의 sql문을 실행하였다.
<br> """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
        where sepal_length > 3 group by #{DF(0)}.species"""


### Python
```
from brightics.function.transform import sql_execute2
stmt = """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
          where sepal_length > 3 group by #{DF(0)}.species"""
res = sql_execute(tables=[inputs[0]], query=stmt)
table = res['out_table']
```

<br> 이 Python 스크립트에서, 다음의 SQL 실행문을 sample iris 데이터에 실행하였다.
<br> """select species, count(*), max(sepal_length), max(sepal_width) from #{DF(0)}
        where sepal_length > 3 group by #{DF(0)}.species"""


