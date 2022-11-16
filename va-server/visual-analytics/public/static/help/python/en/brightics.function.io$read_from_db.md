## Format
Read data from a database.

## Description
This function reads all records from selected database by executing SQL.

---

## Properties
### VA
#### INPUT
This function has no input data.
#### OUTPUT
1. **table**: (Table) output table
#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: Predefined data source. List of data sources can be updated from Datasource Management dialogue on GUI.
1. **Query Statement**<b style="color:red">*</b>: SQL query to execute in a selected database. All records from this query will be fetched.


## Example
### VA

**<a href="/static/help/python/sample_model/Read_From_DB.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/read_from_db_1.PNG"  width="800px" style="border: 1px solid gray" >

First, make sure that the data source from which the wanted datasets are handled is in the list of data sources. The list can be managed through Datasource Management, marked in the figure above. Input the name, IP address, port number, type etc. of the database.

<img src="/static/help/python/sample_model_img/read_from_db_2.PNG"  width="800px" style="border: 1px solid gray" >

This model is a simple example for Read From DB function. In the example, the Read From DB function selects a data source, and sends a query to load a data sample_iris with an alias 'iris', which is assumed to be saved already in the database. The output of this function is a result table of the query, namely sample_iris. The parameter settings used in the function are shown below.

++Parameters++
1. **Data Source**: 
2. **Query Statement**: SELECT * from iris
