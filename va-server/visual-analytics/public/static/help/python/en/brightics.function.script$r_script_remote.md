## Description
This function execute R script at remote R server.

## Properties
1. **Script**<b style='color:red'>*</b>: R Script
2. **Outputs**<b style='color:red'>*</b>: Alias name for out tables.
3. **R server IP and port**<b style='color:red'>*</b>: R server IP address and port. ex) 182.182.82.182, 6311

## Tip
1. R binary and Rserve library should be installed at server node to use this function.
2. You can start Rserve at server node by executing the following command
    - sudo R CMD Rserve (run as daemon process)
    - sudo R CMD Rserve.dbg (run as debug mode)
    - sudo R CMD Rserve --RS-enable-remote (allow connection from remote node)
    - sudo R CMD Rserve --RS-port portnumber --RS-enable-remote (allow connection from remote node with specified port)

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
