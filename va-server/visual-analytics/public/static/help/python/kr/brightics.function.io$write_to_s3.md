## Format
AWS S3에 데이터를 저장하는 함수

## Description
본 함수는 지정된 테이블을 읽을 후, 이를 AWS S3에 저장하기 위한 함수이다.  

---

## Properties
### VA
#### INPUT
1. **table**: 저장하기위한 테이블.
#### OUTPUT
아웃풋 없음
#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: 저장하기 위한 S3 선택. S3를 포함한 DB 연결 정보는 GUI의 Datasource Management 다이얼로그에서 정의 할 수 있다. 

1. **Object Key**<b style="color:red">*</b>: S3 버킷에 저장되는 오브젝트의 키. 


## Example
### VA

**<a href="/static/help/python/sample_model/Write_to_S3.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/write_to_s3_1.PNG"  width="800px" style="border: 1px solid gray" >

<br> Write to S3 함수를 사용하기 위해서는 Datasource Management를 통해 S3에 대한 연결정보가 미리 설정되어 있어야 한다. 
위의 그림은 Datasource Management를 사용하여 S3 연결을 설정하는 예시이다. 



<img src="/static/help/python/sample_model_img/write_to_s3_2.PNG"  width="800px" style="border: 1px solid gray" >

This model is a simple example for Write to S3 function. In the example, the Write to S3 function gets sample_iris data as the input, selects a data source, and writes the dataset as a CSV file in the data source with an object key 'iris'. The parameter settings used in the function are shown below.

<br> 위의 그림은  Write to S3 함수를 사용하여, sample_iris 데이터를 S3에 저장하는 간단한 예를 보여준다. 이때 저장되는 데이터는 CSV 오브젝트로 저장된다. 
이때 사용된 파라메터는 아래와 같다. 

++Parameters++
1. **Data Source**: 
2. **Object Key**: iris
