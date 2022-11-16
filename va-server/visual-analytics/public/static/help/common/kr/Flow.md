## Format
이 함수는 데이터모델을 호출합니다.

## Description
이 함수는 데이터모델을 호출합니다.

## Properties
1. **Model**<b style='color:red'>*</b>: 모델명
2. **Version**<b style='color:red'>*</b>: 모델 버전
3. **Input Table**: 호출된 모델의 입력테이블(읽기 전용) 
4. **Return Table**: 호출된 모델의 반환 테이블(읽기 전용)
5. **Variables**: 호출된 모델의 변수 

## Input Data
Sub Load 기능의 데이터를 기반으로 Sub Model을 분석합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Self-upper 모델의 데이터를 사용하려면 'In Data List'에서 'Selected Data'로 Sub Load 기능을 드래그 앤 드롭해야 합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

흐름 함수를 통해 self-upper 모델에서 sub Model을 호출할 때, Sub Load 함수에서 설정한 입력 데이터는 흐름 함수의 입력 데이터로 대체됩니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData4.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
이 모델은 Sub Model에서 생성된 Sub Load 기능의 데이터를 분석합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

자체 상위 모델에 전달하려는 데이터가 포함된 클릭 기능입니다. 이 경우 필터 함수가 됩니다. 클릭하세요. 

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData2.png'); margin-left: 25px;margin-bottom: 25px;"></div>

모델 자체에서 자체 상위 모델로 데이터를 전달하려면 'Out Data List'에서 Filter 기능을 Selected Data로 드래그 앤 드롭해야 합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData3.png'); margin-left: 25px;margin-bottom: 25px;"></div>

자체 상위 모델에서 하위 모델을 호출할 때 Stat Summary 함수는Flolw(흐름) 기능의 출력 데이터로 사용됩니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData5.png'); margin-left: 25px;margin-bottom: 25px;"></div>