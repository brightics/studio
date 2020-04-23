# Add Function Columns
Adds new columns to input table by using sql expressions.

## Description
This function adds new columns to input table by using sql expressions.


## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Input table.
#### OUTPUT
1. **out_table**<b style="color:red">*</b>: (Table) Table with appended columns.
#### Parameters
1. **Add Column**<b style="color:red">*</b>: A list of pairs of column name and sql expression.


## Example
### VA

**<a href="/static/help/python/sample_model/add_function_columns.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_function_columns.PNG"  width="800px" style="border: 1px solid gray" >



<br>In this tutorial workflow, we append to a sample iris data a new column named 'case_species' with the condition "case when species = 'setosa' then 1 else 0 end".