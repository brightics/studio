# Create Table
입력 데이터로부터 테이블 생성하는 함수

## Description
본 함수는 화면에서 데이터를 입력받아 테이블을 생성한다. 


## Properties
### VA
#### INPUT

#### OUTPUT
1. **out_table**: (Table) 입력데이터로부터 생성된 테이블
#### PARAMETER
1. **Edit** : 에디터의 첫 행은 입력데이터의 컬럼명을 기입하며, 두번째 행 부터는 데이터 값을 입력한다. 컬럼명은 알파벳, 숫자, 혹은 "_" 로 구성될 수 있으며, 알파벳으로 시작하여야 한다. 
2. **Columns**<b style="color:red">*</b> : 에디터에 데이터를 이력 후, 각 컬럼의 타입을 지정한다. 



## Example
### VA

**<a href="/static/help/python/sample_model/create_table.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/create_table.PNG"  width="800px" style="border: 1px solid gray" >

<br> 이 튜토리얼 워크플로우에서, 'c1', 'c2' 컬럼을 포함한 테이블이 생성된다.

