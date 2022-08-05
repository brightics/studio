# Load from VDB
브라이틱스 VDB 저장소에서 데이터를 불러온다.

## Description
이 함수는 브라이틱스 VDB로 부터 데이터를 불러온다. VDB는 데이터 소스를 등록하고 데이터에 대한 접근 권한 관리를 하는 일종의 데이터 허브이다. 함수를 통해 권한이 있는 데이터에 대한 목록을 조회하고 선택한 데이터를 로드한다. 

## Properties
### VA
#### INPUT

#### OUTPUT
1. **table**: (Table) 브라이틱스 VDB로 부터 불러온 데이터
#### PARAMETER
1. **Data Unit**<b style="color:red">*</b>: 데이터 유닛은 데이터 소스와 연결되어 VDB를 통해 등록되는 데이터 단위이다. 
4가지의 데이터 유닛 유형이 존재한다: *DIR, FILE, DATABASE, TABLE* 

2. **Data**: 데이터는 데이터 유닛의 하위 단위이다.

## Constraint
1. VDB를 통해 접근 권한을 가지는 데이터만 볼 수 있다. 
2. 데이터 유닛의 유형이 *FILE* 또는 *TABLE*인 경우에는, 데이터 레벨은 존재 하지 않는다.

## Example
### VA

<img src="/static/help/python/sample_model_img/load_from_vdb.PNG"  width="700px" style="border: 1px solid gray" >

예제 수행을 위해, *Load from VDB* 함수를 생성한 후, 함수의 프로퍼티를 아래의 파라미터와 같이 채워 넣는다.

++Parameters++
1. **Data Unit**<b style="color:red">*</b>: brightics (유형: DIR)
2. **Data**: sample_iris.csv

##### ++Out++
|SepalLength|SepalWidth|PetalLength|PetalWidth|Species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5|3.6|1.4|0.2|setosa|