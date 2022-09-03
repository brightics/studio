# Model Interpretation (SHAP)

이 함수는 SHAP을 사용하여 회귀(또는 분류) 모델의 해석을 제공한다.

## Description
모델 해석(model interpretation)이란 모델이 어떻게 결과를 얻었는지 인간이 이해할 수 있도록 설명한 것이다.
단지 성능이 좋은 것 만으로는 모델을 완전히 신뢰하기는 어렵다.
왜냐하면 모델이 결과를 잘못된 근거로부터 도출했다면, 새로운 데이터를 적용했을 때 올바른 결과를 기대할 수 없기 때문이다.
따라서 의료 분야나 자율 주행같은 사람의 목숨이 걸린 일에는 좀 더 신중한 의사결정이 필요하다.
또한 모델 해석은 모델의 편향을 찾는 좋은 방법이다.

SHAP은 Shapley value를 기반으로 모델의 결과에 대한 각 feature의 기여도를 측정한다.
또한 SHAP은 모델 불특정 기법으로서, 모델에 관계없이 사용할 수 있다.
SHAP은 전역적, 국소적 해석을 모두 제공한다.


참고자료

+ <https://christophm.github.io/interpretable-ml-book/shap.html>
+ <https://github.com/slundberg/shap>
+ <https://en.wikipedia.org/wiki/Shapley_value>


## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 모델 학습에 사용한 데이터.
2. **model**<b style="color:red">*</b>: (Model) 회귀(또는 분류) 모델.
#### OUTPUT
1. **out_model**: (Model) 모델 해석 결과.
2. **out_table**: (Table) Feature Importance 테이블.
#### PARAMETER
1. **Sampling**: 데이터를 샘플링할지 여부 결정. 이 값이 False이면 모든 데이터를 사용.
    * Default: True
2. **Sample Size**: 샘플의 갯수.
    * Default:  500
3. **Seed**: 샘플링에 사용할 랜덤 시드.
    * Default: 1
4. **Plot Types**: 사용할 plot을 선택.
   
   Available Options: (여러 개 선택 가능)
    * `Bar`: 막대 그래프를 이용하여 모델의 feature importance를 보여줌.
    * `Decision`: 꺾은선 그래프를 이용하여 모델의 결정과정을 보여줌.
    * `Beeswarm`: SHAP value의 분포를 보여줌. 각 점의 색깔은 데이터의 원래 값에 따라 변함.
    * `Scatter`: 각 feature의 값에 따른 SHAP value의 변화를 보여줌. 상호작용 효과가 세로축 방향의 변화로 나타남. 
    * `Heatmap`: 히트맵을 이용하여 SHAP value를 보여줌. 데이터는 클러스터링을 이용하여 정렬.  
   
5. **Bar Option**: Bar plot을 어떻게 사용할지 선택('Plot Types'에서 'Bar'를 선택했을 때만 사용).
   
   Available Options: (여러 개 선택 가능)
    * `Global`: 각 feature들이 전체 데이터에 평균적으로 미치는 영향력을 보여줌.
    * `Local`: 입력한 행의 해석 결과를 보여줌.

6. **Bar Data Row**: 해석할 데이터 행의 인덱스를 입력.('Bar Option'에서 'Local'을 선택했을 때만 사용.)
(기본값: [1]. 여러 개 입력 가능)

7. **Decision Option**: Decision plot을 어떻게 사용할지 선택('Plot Types'에서 'Decision'을 선택했을 때만 사용.)  
   
Available Options: (여러 개 선택 가능)
    * `Global`: 모든 데이터의 해석 결과를 보여줌.
    * `Local`: 입력한 행의 해석 결과만 보여줌.

9. **Decision Data Row**: 해석할 데이터 행의 인덱스를 입력.('Decision Option'에서 'Local'을 선택했을 때만 사용.)
(기본값: [1]. 여러 개 입력 가능)

10. **Decision Feature Order**: Feature를 정렬할 기준.
    
   Available Options:
     * `Feature Importance`: SHAP value의 절댓값의 합이 큰 순서대로 정렬.
     * `Hierarchical Clustering`: 계층적 군집화를 통해 정렬.
     * `None`: 원래 순서 유지.

12. **Max Display**: 결과를 표시할 feature의 갯수.
Farture의 갯수가 Max Display 값보다 작거나 같으면 모든 feature를 다 표시함.
    * 기본값: 11


### Python
#### USAGE

```
model_interpretation(table = , model = , sampling = , sample_size = , seed = , plot_types = , bar_global_local = , bar_data_row = , decision_global_local = , decision_data_row = , decision_feature_order = , max_display = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) 모델 학습에 사용한 데이터.
2. **model**<b style="color:red">*</b>: (Model) 회귀 또는 분류 모델.
#### OUTPUT
1. **out_model**: (Model) 모델 해석 결과
2. **out_table**: (Table) Feature Importance 테이블
#### PARAMETER
1. **plot_types**: 사용할 plot을 선택
    * Type: *list[str]*
    * Default / Range: Bar, Decision, Beeswarm, Scatter, Heatmap ( Bar | Decision  | Beeswarm  | Scatter | Heatmap)
2. **bar_global_local**: Bar plot을 어떻게 사용할지 선택.
    * Type: *list[str]*
    * Default / Range: global ( global | local )
3. **bar_data_row**: 해석할 row를 입력.
    * Type: *list[int]*
4. **decision_global_local**: Decision plot을 어떻게 사용할지 선택
    * Type: *list[str]*
    * Default / Range: global ( global | local )
5. **decision_data_row**: 해석할 row를 입력.
    * Type: *list[int]*
6. **decision_feature_order**:  Feature를 정렬할 기준을 선택.
    * Type: *str*
    * Default / Range: importance ( importance | hclust | none )
7. **max_display**: 결과를 표시할 feature의 갯수.
    * Type: *int*
    * Default / Range: 11
    
## Example
### VA

**<a href="/static/help/python/sample_model/model_interpretation_shap.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/model_interpretation_shap.PNG"  width="800px" style="border: 1px solid gray" >


<br>이 튜토리얼은 붓꽃(iris) 데이터로 학습한 선형 회귀 모델을 Moel Intepretation(SHAP)으로 해석한 것이다.

++Parameters++
1. **Sampling**: True
2. **Sample Size**:100
3. **Seed**:1
4. **Plot Types**: Bar, Decision
5. **Bar Option**: Global, Local
6. **Bar Data Row**: [45, 90]
7. **Decision Option**: Local
8. **Decision Data Row**: [20, 60, 135]
9. **Decision Feature Order**: Feature Importance
10. **Max Display**: 11




### Python

```
from brightics.function.regression import linear_regression_train
from brightics.function.evaluation import model_interpretation_shap

input_table = inputs[0]


lr_result = linear_regression_train(table=input_table,
                                    feature_cols=['sepal_length', 'sepal_width'],
                                    label_col='petal_width',
                                    fit_intercept=True,
                                    is_vif=True,
                                    vif_threshold=10,
                                    group_by=None)

trained_model = lr_result['model']


res = model_interpretation_shap(table = input_table,
                                 model = trained_model,
                                 plot_types = ['Bar', 'Decision'],
                                 bar_global_local = ['Global', 'Local'],
                                 bar_data_row = [45, 90],
                                 decision_global_local = ['Local'],
                                 decision_data_row = [20, 60, 135],
                                 decision_feature_order = 'importance',
                                 max_display = 11)

res['out_model']
```
