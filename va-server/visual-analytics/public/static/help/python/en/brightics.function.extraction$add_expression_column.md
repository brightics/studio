## Format

This function adds new column with given expression.

## Description
This function adds new column for the values calculated by the given expression. 

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Input table. 
#### OUTPUT
1. **out_table**: (Table) Result table containing the new column.  

#### PARAMETER
1. **New Column Name**<b style="color:red">*</b>: New column name to be added.

2. **Expression Type**<b style="color:red">*</b>: The type of grammar for interpreting the expression. 

3. **Expression**<b style="color:red">*</b>: An expression for the calculation of values in the new column. 



## Example
### VA

**<a href="/static/help/python/sample_model/add_function_column.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/add_function_column.PNG"  width="800px" style="border: 1px solid gray" >


<br> This example shows a simple application of Add Function Column function, adding a new column with values of (sepal_lenth + 1). 

++Parameters++
1. **New Column Name**<b style="color:red">*</b>: new_col
2. **Expression Type**<b style="color:red">*</b>: SQLite
3. **Expression**<b style="color:red">*</b>: sepal_length + 1

