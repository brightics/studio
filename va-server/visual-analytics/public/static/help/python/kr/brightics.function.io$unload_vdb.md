## Format
이 함수는 테이블을 브라이틱스 VDB에 파일 또는 테이블 형태로 저장한다.

## Description
이 함수는 테이블을 브라이틱스 VDB에 파일 또는 테이블 형태로 저장한다. New, Append, Overwrite 3가지 모드로 동작하며, VDB에 신규 데이터를 생성하거나 기존 데이터에 추가하거나 변경 할 수 있다.  

## Properties
### VA
#### INPUT
1. **table**: (Table) 브라이틱스 VDB에 저장할 테이블.
#### OUTPUT
#### PARAMETER
1. **Unload Mode**<b style="color:red">*</b>: 쓰기 모드. 데이터 생성, 덮어쓰기 또는 기존 데이터에 덧붙이기 모드 선택이 가능하다.

2. **Data Unit**<b style="color:red">*</b>: 데이터 유닛은 데이터 소스와 연결되어 VDB를 통해 등록되는 데이터 단위이다. 
4가지의 데이터 유닛 유형이 존재한다: *DIR, FILE, DATABASE, TABLE* 

3. **Data**: 데이터는 데이터 유닛의 하위 단위이다.

## Constraint
1. VDB를 통해 접근 권한을 가지는 데이터만 볼 수 있다. 
2. 데이터 유닛의 유형이 *FILE* 또는 *TABLE*인 경우에는, 데이터 레벨은 존재 하지 않는다.
3. 쓰기 모드 일 때는, 데이터 유닛 유형이 *FILE* 이거나 *TABLE*인 데이터 유닛을 선택할 수 없다. 
4. 쓰기 모드 일 때는, 데이터 명을 직접 입력 해야 한다.

## Example
### VA

<img src="/static/help/python/sample_model_img/unload_to_vdb.PNG"  width="600px" style="border: 1px solid gray" >

예제 수행을 위해, *Load* 와  *Unload to VDB* 함수를 생성한 후 서로 연결한다.
그리고 *Unload to VDB* 함수의 프로퍼티를 아래의 파라미터와 같이 채워 넣는다.

++Parameters++
1. **Unload Mode**<b style="color:red">*</b>: New
2. **Data Unit**<b style="color:red">*</b>: brightics (유형: DIR)
3. **Data**: new_iris.csv


##### ++In++
|SepalLength|SepalWidth|PetalLength|PetalWidth|Species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5|3.6|1.4|0.2|setosa|


##### ++Out++
입력 테이블이 파일 또는 테이블의 형태로 데이터 유닛에 저장된다.
