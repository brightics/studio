## Format

DB로부터 데이터를 읽는 함수 

## Description

본 함수는 SQL문을 사용하여 DB로 부터 데이터 레코드를 읽어오는 기능을 제공한다. 

---

## Properties
### VA
#### INPUT
#### OUTPUT
1. **table**: (Table) 결과 테이블
#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: 데이터 소스. 데이터 소스 리스트는 GUI의 Datasource Management 다이얼로그에서 정의 할 수 있다.
1. **Query Statement**<b style="color:red">*</b>: DB로부터 데이터를 패치하기 위한 SQL문.


## Example
### VA

**<a href="/static/help/python/sample_model/Read_From_DB.json" download>[Sample Model]</a>**

위 워크플로우는 Read From DB 함수의 에시이다. 본 함수는 아래와 같이 먼저 데이터소스로 쓰일 DB를 선택 한 후 사용할 수 있다. 
본 예제 워크플로우에서는 저 데이터소스로 쓰일 DB를 선택 한 후, 해당 DB에서 iris 테이블의 모든 데이터를 로딩한다. 
아래의 그림은 Datasource Management를 사용하여 새로운 DB 연결을 설정하는 예시이다.
<img src="/static/help/python/sample_model_img/read_from_db_1.PNG"  width="800px" style="border: 1px solid gray" >


++Parameters++
1. **Data Source**: 
2. **Query Statement**: SELECT * from iris
