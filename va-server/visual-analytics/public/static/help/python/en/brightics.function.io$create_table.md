# Create Table
This function crate a table from the input values.

## Description
This function crate a table from the input values.


## Properties
### VA
#### INPUT
1. This function has no input data.
#### OUTPUT
1. **out_table**: (Table) Table with selected columns.
#### PARAMETER
1. **edit** : The first row are the column names. Column names should consist of alphabets, numbers, and "_". The column names should start with an alphabet letter. The other rows are the input data.
2. **Columns** : After entering the input data, choose the type for each column.
3. **data-array** : Array[Array[Any]] The input data. Each array in the whole array is a row.
4. **column-types** : Array[String] The column types.
5. **column-names** : Array[String] The column names.



## Example
### VA

**<a href="/static/help/python/sample_model/create_table.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/create_table.PNG"  width="800px" style="border: 1px solid gray" >

<br>In this tutorial workflow, A dummy table with the columns 'col1', 'col2', 'col3' is created.

