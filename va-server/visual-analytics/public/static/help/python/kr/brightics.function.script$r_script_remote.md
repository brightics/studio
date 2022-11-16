## Description
이 함수는 원격 R 서버에서 R script를 실행한다.

## Properties
1. **Script**<b style='color:red'>*</b>: R Script
2. **Outputs**<b style='color:red'>*</b>: 결과 테이블 이름.
3. **R server IP and port**<b style='color:red'>*</b>: R 서버 IP 주소와 포트 ex) 182.182.82.182, 6311

## Tip
1. 이 함수를 사용하려면 원격 R 서버에 R 바이너리와 Rserve 라이브러리가 설치되어야 한다.
2. 원격 R 서버에서 다음 명령어로 Rserve를 실행할 수 있다.
    - sudo R CMD Rserve (데몬 프로세스로 실행)
    - sudo R CMD Rserve.dbg (디버그 모드로 실행)
    - sudo R CMD Rserve --RS-enable-remote (리모트 노드에서 접속 허용)
    - sudo R CMD Rserve --RS-port portnumber --RS-enable-remote (리모트 노드에서 접속 허용 및 특정 포트 지정)

## Example
1. **Script**<b style='color:red'>*</b>:
    ```
    iris <- inputs[0]
    summary <- summary(lm(formula = sepal_length ~ sepal_width + petal_length + petal_width, data = iris))
    coefficient <- signif(data.frame(summary$coefficient), 3)
    index <- row.names(coefficient)
    result <- cbind(index, coefficient)
    ```
2. **Outputs**<b style='color:red'>*</b>: result

3. **R server IP and port**<b style='color:red'>*</b>: xxx.xxx.xx.xxx, 6311

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

| index | Estimate | Std..Error |t.value | Pr...t.. |
| ---------: | -----------: | ----------: | ----------: | ----------: |
| (Intercept)   | 1.86	| 0.251	| 7.4	| 9.85E-12  |
| sepal_width   | 0.651	| 0.0666	| 9.77	| 1.20E-17  |
| petal_length  | 0.709	| 0.0567	| 12.5	| 7.66E-25  |
| petal_width   | -0.556	| 0.128	| -4.36	| 2.41E-05  |
