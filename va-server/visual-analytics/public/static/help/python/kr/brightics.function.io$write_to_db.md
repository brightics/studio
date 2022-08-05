## Format

테이블 데이터를 DB에 자정하는 함수.

## Description

주어진 인풋테이블을 선택된 DB에 저장하는 함수이다. 

---

## Properties
### VA
#### INPUT
1. **Table**<b style="color:red">*</b>: (Table) 저장할 테이블

#### OUTPUT
아웃풋 없음

#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: 테이블을 저장할 DB. DB 연결 정보는 GUI의 Datasource Management 다이얼로그에서 정의 할 수 있다. 
2. **Table Name**<b style="color:red">*</b>: DB에 저장 될 테이블 이름. 
3. **If Exists**<b style="color:red">*</b>:  지정된 테이블명이 DB내에 이미 존재할 경우에 대한 옵션. 
   - Available items
      - Fail (default): 저장 실패
      - Replace: 기존 테이블 삭제 후 신규 테이블로 대체
      - Append: 동일 테이블에 데이터 추가
4. **Schema**: 스키마 이름   
## Example
### VA

**<a href="/static/help/python/sample_model/Write_to_DB.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/read_from_db_1.PNG"  width="800px" style="border: 1px solid gray" >

<br> Write to DB 함수를 사용하기 위해서는 Datasource Management를 통해 DB에 대한 연결정보가 미리 설정되어 있어야 한다. 
위의 그림은 Datasource Management를 사용하여 새로운 DB 연결을 설정하는 예시이다. 



<img src="/static/help/python/sample_model_img/Write_to_DB.PNG"  width="800px" style="border: 1px solid gray" >

<br> 위의 그림은  Write to DB 함수를 사용하여, sample_iris 데이터를 DB에 저장하는 간단한 예를 보여준다. 이때 사용된 파라메터는 아래와 같다. 

++Parameters++
1. **Data Source**<b style="color:red">*</b>: 
2. **Table Name**<b style="color:red">*</b>: sample_iris
3. **If Exists**<b style="color:red">*</b>: Fail
4. **Schema**: None
