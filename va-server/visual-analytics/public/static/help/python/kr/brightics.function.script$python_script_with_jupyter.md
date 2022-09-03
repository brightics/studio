## Format
파이썬 스크립트 작성/실행 환경제공

## Description
이 함수는 실행 된 파이선 스크립트의 값을 반환합니다. 파이선 스크립트는 주피터 노트북을 통해 수정 사항을 저장합니다.

## Properties
1. **Script**<b style='color:red'>*</b>: 파이선 스크립트
2. **Outputs**: 파이선 스크립트 실행 후 생성된 결과
3. **Kernel**<b style='color:red'>*</b>: 파이선 스크립트를 실행할 Kernel

## Example
1. **Script**<b style='color:red'>*</b>:
    ```
    iris = inputs[0]
    result = iris.groupby("species", as_index=False)['petal_length', 'petal_width'].mean().round(3)
    ```
2. **Outputs**: result(TABLE)

##### ++In++

| sepal_length | sepal_width | petal_length | petal_width | species    |
| -----------: | ----------: | -----------: | ----------: | :--------- |
| 5.1          | 3.5         | 1.4          | 0.2         | setosa     |
| 4.9          | 3           | 1.4          | 0.2         | setosa     |
| 4.7          | 3.2         | 1.3          | 0.2         | setosa     |
| 4.6          | 3.1         | 1.5          | 0.2         | setosa     |
| 5            | 3.6         | 1.4          | 0.2         | setosa     |
| 5.4          | 3.9         | 1.7          | 0.4         | setosa     |
| 4.6          | 3.4         | 1.4          | 0.3         | setosa     |
| 5            | 3.4         | 1.5          | 0.2         | setosa     |
| 4.4          | 2.9         | 1.4          | 0.2         | setosa     |
| 4.9          | 3.1         | 1.5          | 0.1         | setosa     |
| 5.4          | 3.7         | 1.5          | 0.2         | setosa     |
| 4.8          | 3.4         | 1.6          | 0.2         | setosa     |
| 4.8          | 3           | 1.4          | 0.1         | setosa     |
| 4.3          | 3           | 1.1          | 0.1         | setosa     |
| 5.8          | 4           | 1.2          | 0.2         | setosa     |
| 5.7          | 4.4         | 1.5          | 0.4         | setosa     |
| 5.4          | 3.9         | 1.3          | 0.4         | setosa     |
| 5.1          | 3.5         | 1.4          | 0.3         | setosa     |
| 5.7          | 3.8         | 1.7          | 0.3         | setosa     |
| 5.1          | 3.8         | 1.5          | 0.3         | setosa     |

##### ++Out++

| species    | petal_length | petal_width |
| ---------: | -----------: | ----------: |
| setosa     | 1.462        | 0.246       |
| versicolor | 4.26         | 1.326       |
| virginica  | 5.552        | 2.026       |
