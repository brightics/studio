## Format

학습된 모델을 파일로 저장

## Description

본 함수는 ML 함수의 학습 결과 모델을 파일로 저장한다. 저장된 파일은 추후 Load Model 함수를 통해 적재 할 수 있다. 


## Properties
### VA
#### INPUT
1. **Target**<b style="color:red">*</b>:(Model) 저장할 학습 모델. 
#### OUTPUT
1. **out-model**:(Model) 학습 모델의 Json 파일.     
#### PARAMETER
1. **Path**<b style="color:red">*</b>: 모델이 저장 될 절대 경로 및 파일 명. 


## Example
### VA

**<a href="/static/help/python/sample_model/unload_model.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/unload_model.PNG"  width="800px" style="border: 1px solid gray" >

본 예제는 Linear Regression Train 함수로 학습된 모델을 파일로 저장하는 절차를 보여준다. 

++Parameters++
1. **Target**<b style="color:red">*</b>:Linear Regression Train
2. **Path**<b style="color:red">*</b>: C:/brightics/models/LinearRegressionModel
