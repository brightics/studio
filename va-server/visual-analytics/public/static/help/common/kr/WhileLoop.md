## Format
조건을 만족시키면서 반복하는 기능입니다.

## Description
이 함수는 조건을 만족시키면서 반복하는 기능입니다.

## Properties
1. **Expression**<b style='color:red'>*</b>: 표현식
2. **Index Variable**: 인덱스 변수

## Input Data
WhileLoop 모델은 WhileLoop Load 함수의 데이터를 기반으로 분석합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Self-upper 모델의 데이터를 사용하려면 'Selected Data'에서 WhileLoop Load 기능을 Diagram 편집기로 끌어다 놓아야 합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
이 모델은 Sub Model에서 생성된 WhileLoop Load 함수의 데이터를 분석합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

자체 상위 모델에 전달하려는 데이터가 포함된 클릭 기능입니다. 이 경우 통계 요약 기능이 됩니다. 클릭하세요.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

모델 자체에서 자체 상위 모델로 데이터를 전달하려면 'Out Data List'에서 Statistic Summary 기능을 Selected Data로 드래그 앤 드롭해야 합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

자체 상위 모델에서 WhileLoop 모델을 호출할 때 Statistic Summary 함수는 흐름 함수의 출력 데이터로 사용됩니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop6.png'); margin-left: 25px;margin-bottom: 25px;"></div>