## 필터

데이터 필터링 함수

## 설명

본 함수는 인풋 테이블로 부터 주어진 조건식에 만족하는 데이터만을 추출하는 함수이다. AND 혹은 OR 조건을 통해 한개 이상의 조건식을 설정 할 수 있다. 
 

참조
- <https://en.wikipedia.org/wiki/Filter_(higher-order_function)>

---

## 속성
#### 입력
1. **table**<b style="color:red">*</b>: (Table) 대상 데이터를 포함하는 테이블

#### 출력
1. **table**: (Table) 조건식에 맞게 추출된 데이터 테이블 

#### 매개변수
1. **Condition**<b style="color:red">*</b> : 필터링을 위한 조건식

## 예제

**<a href="/static/help/python/sample_model/filter.json" download>[예제 모델]</a>**

<img src="/static/help/python/sample_model_img/filter.PNG"  width="800px" style="border: 1px solid gray" >

<br>본 예제는 필터 함수를 이용하여 sample_iris 데이터의 일부를 추출하는 예제를 보여준다. 예제에서는 _species_ = 'setosa'의 조건식을 설정하여, 이에 맞는 데이터만을 추출하고 있다. 

++매개변수++
1. **Condition**<b style="color:red">*</b>: And, species, ==, 'setosa'
