## Format
이 함수는 조건을 만족시키면서 반복 작업을 실행하는 기능입니다.

## Description
이 함수는 조건을 만족시키면서 반복 작업을 실행하는 기능입니다.

## Properties
1. **Loop Type**<b style='color:red'>*</b>: 'Count' 또는 'Collection', 반복 타입.
2. **Start**<b style='color:red'>*</b>: 시작점 인덱스, 'Loop Type' 속성이 Count인 경우 시작되는 인덱스. 
3. **End**<b style='color:red'>*</b>: 종료점 인덱스, 'Loop Type' 속성이 Count인 경우 종료되는 인덱스. 
4. **Collection**<b style='color:red'>*</b>: Collection, 'Loop Type' 속성이 Collection인 경우.
5. **Element Variable**: 요소 변수, 'Loop Type' 속성이 Collection인 경우 사용되는 요소 변수입니다.
6. **Index Variable**: 인덱스 변수 

## Input Data
Loop Load 함수의 데이터를 기반으로 루프 모델을 분석합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Self-upper 모델의 데이터를 사용하려면 'Selected Data'에서 Loop Load 기능을 Diagram 편집기로 끌어다 놓아야 합니다. 

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
이 모델은 Sub Model에서 생성된 Loop Load 기능의 데이터를 분석합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

자체 상위 모델에 전달하려는 데이터가 포함된 클릭 기능입니다. 이 경우 통계 요약 기능이 됩니다. 클릭하세요.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

모델 자체에서 자체 상위 모델로 데이터를 전달하려면 'Out Data List'에서 Statistic Summary 기능을 Selected Data로 드래그 앤 드롭해야 합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

Self-upper model에서 Loop Model을 호출할 때 Statistic Summary 함수는 흐름 함수의 출력 데이터로 사용됩니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop6.png'); margin-left: 25px;margin-bottom: 25px;"></div>