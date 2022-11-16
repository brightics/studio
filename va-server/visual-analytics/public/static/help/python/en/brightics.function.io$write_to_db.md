## Format
Store data as a file to selected database.

## Description
Inserting all data from an input table to selected database.

---

## Properties
### VA
#### INPUT
1. **Table**<b style="color:red">*</b>: Data in a Table.

#### OUTPUT
This function has no output data.

#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: Predefined datasource. List of datasources can be updated from Datasource Management dialog on GUI.
2. **Table Name**<b style="color:red">*</b>: The Name of table will be created from the database.
3. **If Exists**<b style="color:red">*</b>:  The action when the table name is duplicated.
   - Available items
      - Fail (default): Function will failed.
      - Replace: Table will be replaced with newly created one.
      - Append: New data will be added from target table.
4. **Schema**: Schema name   

## Example
### VA

**<a href="/static/help/python/sample_model/Write_to_DB.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/read_from_db_1.PNG"  width="800px" style="border: 1px solid gray" >

First, make sure that the data source from which the wanted datasets are handled is in the list of data sources. The list can be managed through Datasource Management, marked in the figure above. Input the name, IP address, port number, type etc. of the database.

<img src="/static/help/python/sample_model_img/Write_to_DB.PNG"  width="800px" style="border: 1px solid gray" >

This model is a simple example for Write to DB function. In the example, the Write to DB function receives a sample_iris data, and sends the data to a given data source by setting 'Table Name' to sample_iris and 'If Exists' to Fail. The parameter settings used in the function are shown below.

++Parameters++
1. **Data Source**<b style="color:red">*</b>: 
2. **Table Name**<b style="color:red">*</b>: sample_iris
3. **If Exists**<b style="color:red">*</b>: Fail
4. **Schema**: None
