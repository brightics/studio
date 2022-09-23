## Format
전역 변수를 변경하는 함수입니다.

## Description
전역 변수를 변경하는 함수입니다.

## Properties
1. **String**: 문자열 데이터 유형
2. **Number**: 숫자 데이터 유형
3. **Array String Value**: 문자열 데이터 유형의 배열
4. **Array Number Value**: 숫자 데이터 유형의 배열
5. **Calculation Value**: 다른 변수 입력 가능
6. **Cell**: 입력 데이터 선택 후 행/열 이름 설정

## Example
"값 설정" 함수와 함께 "조건문" 함수를 실행하여 전역 변수로 조건을 변경합니다. 
이 예제에서는 "iris" 데이터를 조건별로 정렬하여 표시했습니다. (IF: 오름차순, Else: 내림차순)

1. "데이터 불러오기", "값 설정", "조건문" 함수를 순서대로 생성합니다.
2. 전역 변수를 "var1"로 추가합니다.
3. "var1"을 0으로 설정합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

4. "값 설정" 함수를 클릭하고 변수를 "var1"로 추가합니다.
5. "var1"을 1로 설정합니다

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_5.png'); margin-left: 25px; margin-bottom: 25px;"></div>

6. "조건문" 함수를 클릭하고 "if" 조건을 "var1 > 0"로 입력합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_6.png'); margin-left: 25px; margin-bottom: 25px;"></div>

7. "Step Into" 버튼 클릭 후 내부 모델로 이동합니다(If).
8. "입력 데이터"를 설정하고 “정렬” 함수를 생성합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_8.png'); margin-left: 25px; margin-bottom: 25px;"></div>

9. "정렬" 함수의 매개변수를 오름차순으로 채웁니다.
10. "반환 데이터"를 설정합니다.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_10.png'); margin-left: 25px; margin-bottom: 25px;"></div>

11. "Else" 탭을 클릭하여 내부 모델을 변경합니다.
12.	"Input Data"를 설정하고 "If"와 같은 "정렬" 함수를 생성합니다.
13.	"정렬" 함수의 매개변수를 내림차순으로 채웁니다.
14.	"반환 데이터"를 설정합니다

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/SetValue_14.png'); margin-left: 25px; margin-bottom: 25px;"></div>

15. "Step Out" 버튼을 클릭하여 메인 모델로 이동합니다.
16.	해당 모델을 실행하고, 오름차순으로 정렬될 "조건문"의 출력을 표시합니다.
17.	"값 설정" 함수를 클릭합니다.
18.	"var1"을 0으로 설정합니다.
19.	해당 모델을 실행하고, 내림차순으로 정렬될 "조건문"의 출력을 표시합니다
