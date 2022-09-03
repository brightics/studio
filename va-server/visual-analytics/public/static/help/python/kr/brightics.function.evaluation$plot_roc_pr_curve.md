## Format

Receiver Operating Characteristic(ROC) 커브와 Precision-Recall(PR) 커브 그래프를 그려주는 함수. 


## Description

본 함수는 이진 분류에 대한 정답 레이블 컬럼과 예측값 컬럼이 있는 테이블로 부터 Receiver Operating Characteristic(ROC) 커브와 Precision-Recall(PR) 커브의 그래프를 그려주는 함수이다. 

Reference
+ <https://en.wikipedia.org/wiki/Receiver_operating_characteristic>
+ <https://en.wikipedia.org/wiki/Precision_and_recall>
+ <https://machinelearningmastery.com/roc-curves-and-precision-recall-curves-for-classification-in-python/>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 레이블 컬럼과 이에 대한 예측 확률 값 컬럼을 가진 테이블.
#### OUTPUT
1. **model**: (Model) ROC 커브와 PR 커브 그래프 이미지를 포함하는 모델.
#### PARAMETER
1. **Label Column**<b style="color:red">*</b>: 레이블 컬럼명. 레이블 값은 {-1, 1}, 혹은 {0, 1} 이어야 한다. {-1, 1}, 혹은 {0, 1} 외의 값을 가질 경우, `Positive Label` 항목에  Positive class의 레이블을 명시적으로 지정해야 한다. 

2. **Probability Column**<b style="color:red">*</b>: 예측 확률 컬럼명. Positive class에 대한 확률 값을 가진다. 

3. **Positive Label**: Positive class의 레이블 값. 명시적으로 지정하지 않을 경우, Positive class의 레이블 값을 1로 간주한다. 

4. **Figure Width**: 그래프의 가로 크기. 

5. **Figure Height**: 그래프의 세로 크기.

6. **Group By**: Group by를 위한 참조 컬럼명.


### Python
#### USAGE

```
plot_roc_pr_curve(table = , label_col = , probability_col = , pos_label = , fig_w = , fig_h = , group_by = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 레이블 컬럼과 이에 대한 예측 확률 값 컬럼을 가진 테이블.
#### OUTPUT
1. **model**: (Model)  ROC 커브와 PR 커브 그래프 이미지를 포함하는 모델.
#### PARAMETER
1. **label_col**<b style="color:red">*</b>:  레이블 컬럼명. 레이블 값은 {-1, 1}, 혹은 {0, 1} 이어야 한다. {-1, 1}, 혹은 {0, 1} 외의 값을 가질 경우, `Positive Label` 항목에  Positive class의 레이블을 명시적으로 지정해야 한다. 
	* Type: *str*
2. **probability_col**<b style="color:red">*</b>: 예측 확률 컬럼명. Positive class에 대한 확률 값을 가진다. 
	* Type: *str*
3. **pos_label**: Positive class의 레이블 값. 명시적으로 지정하지 않을 경우, Positive class의 레이블 값을 1로 간주한다. 
	* Type: *str*
4. **fig_w**: 그래프의 가로 크기..
	* Type: *float*
	* Default / Range: 6.4 (value >= 0)
5. **fig_h**: 그래프의 세로 크기.
	* Type: *float*
	* Default / Range: 4.8 (value >= 0)
6. **group_by**: Group by를 위한 참조 컬럼명.
	* Type: *list[str]*

## Example
### VA
**<a href="https://www.brightics.ai/kr/docs/ai/s1.0/tutorials/86_1_py_Logistic_Regression?type=insight" target="_blank">[Related Tutorial]</a>**


**<a href="/static/help/python/sample_model/Plot_ROC_and_PR_Curves.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/plot_roc_and_pr_curves.PNG"  width="800px" style="border: 1px solid gray" > <br>

본 예제는 데이터에 대한 분류 예측을 수행한 후, 결과에 대한 ROC 커브 및 PR 커브의 그래프를 생성하는 예를 보여준다. 먼저 Split Data 함수를 통해 sample_iris를 학습 데이터 셋과 테스트 데이터 셋으로 나눈 후, 학습 데이터로부터 SVM Classification Train 함수를 통해 _species_ 에 대한 Classification Model을 학습한다. 그 다음 학습된 모델을 사용하여 테스트 데이터의 _species_ 를 예측한다. 예측 결과에 대한 ROC 커브와 PR 커브는 Plot ROC and PR Curves 함수를 통해 생성 할 수 있다. 이때 Plot ROC and PR Curves 함수는 이진 분류에 대해 작동함을 주의 해야 한다. 예제에서는  Plot ROC and PR Curves 함수의 _Probability Column_ 파라메터와 Positive Label 파라메터를 _probability_virginica_ 및  _virginica_ 로 설정하여 virginica 종인지에 대한 이진 분류 결과의 ROC/PR 커브를 보여준다. . 



++Parameters++
1. **Label Column**<b style="color:red">*</b>: species
2. **Probability Column**<b style="color:red">*</b>: probability_virginica
3. **Positive Label**: virginica
4. **Figure Width**: None
5. **Figure Height**: None
6. **Group By**: None


### Python

```
from brightics.function.evaluation import plot_roc_pr_curve
input_table = inputs[0]
result = plot_roc_pr_curve(table=input_table, label_col='species', probability_col='probability_virginica', pos_label='virginica', fig_w=6.4, fig_h=4.8, group_by=None)
output = result['result']
```

In this python script, Plot Roc and PR Curves function is used to understand the quality of the trained classification model.
