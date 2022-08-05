# Select Column
Select specified columns from an input table.

## Description
Create new table by selecting specified columns from an input table.



## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Input table.
#### OUTPUT
1. **out_table**: (Table) Table with selected columns.
#### PARAMETER
1. **Selected Column**<b style="color:red">*</b>: Columns to be selected.



### Python
#### USAGE

```
select_column(table = , input_cols = )
```


1. **table**<b style="color:red">*</b>: (Table) Input table.
#### OUTPUT
1. **out_table**: (Table) Table with selected columns.
#### PARAMETER
1. **input_cols**<b style="color:red">*</b>: Columns to be selected.


## Example
### VA

**<a href="/static/help/python/sample_model/select_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/select_column.PNG"  width="800px" style="border: 1px solid gray" >

<br>In this tutorial workflow, sample_iris data is chosen as an input data and two columns 'sepal_length' and 'species' are selected.

++Parameters++
1. **Selected Column**<b style="color:red">*</b>: sepal_length


### Python

```
from brightics.function.transform import select_column
res = select_column(table=inputs[0], input_cols=['sepal_length', 'species'])
table = res['out_table']
```

<br>In this tutorial workflow, sample_iris data is chosen as an input data and two columns 'sepal_length' and 'species' are selected.
