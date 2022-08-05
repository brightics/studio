## Format
저장된 학습모델을 읽기위한 함수 

## Description

본 함수는 다른 함수가 학습한 모델을 읽는 기능을 제공한다. 
Json 형대로 저장되어 있는 모델 파일을 읽을 수 있으며, 읽힌 모델은 해당 알고리즘의 Prediction 함수에 인풋으로 사용 할 수 있다.   

## Properties
### VA
#### INPUT
인풋 없음 
#### OUTPUT
1. **model**:(Model) Json파일에 저장되어 있던 학습 모델   

#### PARAMETER
1. **Path**<b style="color:red">*</b>: 기 학습된 모델 Json 파일 위치

## Example
### VA

**<a href="/static/help/python/sample_model/load_model.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/load_model.PNG"  width="800px" style="border: 1px solid gray" >


본 예제는 학습된 ML 모델을 파일로 저장하고 (Unload Model), 다시 워크클플로우로 읽어들이는(Load Model) 절차를 보여준다. 
Linear Regression Train 함수로 학습된 모델을 사용하였으며, Load Model 함수로 읽은 모델은 Linear Regression Prediction 함수의 인풋으로 쓰일 수 있다.    

++Parameters++
1. **Path**<b style="color:red">*</b>: C:/brightics/models/LinearRegressionModel