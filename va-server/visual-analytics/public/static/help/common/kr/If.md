## Format
This function executes a branch based on a condition.조건에 따라 분기를 실행하는 함수입니다. 

## Description
조건에 따라 분기를 실행하는 함수입니다. 

## Properties
1. **If**<b style='color:red'>*</b>: If 조건
2. **Else If**<b style='color:red'>*</b>: Else if 조건

## Input Data
Condition Load 기능의 데이터를 기반으로 Condition Model을 분석합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Self-upper 모델의 데이터를 사용하려면 'Selected Data'에서 Condition Load 기능을 Diagram 편집기로 끌어다 놓아야 합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
이 모델은 Sub Model에서 생성된 Condition Load 함수의 데이터를 분석합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

자체 상위 모델에 전달하려는 데이터가 포함된 클릭 기능입니다. 이 경우 통계 요약 기능이 됩니다. 클릭하세요.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

모델 자체에서 자체 상위 모델로 데이터를 전달하려면 'Out Data List'에서 Statistic Summary 기능을 Selected Data로 드래그 앤 드롭해야 합니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

Self-upper model에서 Condition Model을 호출할 때 Statistic Summary 함수는 Condition Flow 함수의 출력 데이터로 사용됩니다.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition6.png'); margin-left: 25px;margin-bottom: 25px;"></div>