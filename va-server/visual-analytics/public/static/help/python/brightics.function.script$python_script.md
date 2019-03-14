## Description
This function returns value for executed Python Script.

## Properties
1. **Script**<b style='color:red'>*</b>: Python Script
2. **Outputs**: Alias name for out tables.

## Tip
1. **In Table Variable (see the script in Example below)**: when [In Table Variable] button clicked, then "inputs[index]" will be entered into Script Editor<div style="width:247px; height:47px; background-image: url('function-resources/pythonscript/PythonScript.PNG');"></div>

## Example
1. **Script**<b style='color:red'>*</b>:
    ```
    iris = inputs[0]
    result = iris.groupby("species", as_index=False)['petal_length', 'petal_width'].mean().round(3)
    ```
2. **Outputs**: result

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

