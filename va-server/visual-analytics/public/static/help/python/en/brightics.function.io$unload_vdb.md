# Unload to VDB
This function writes a table or a file in the Brightics VDB.

## Description
This function writes a table or a file in the Brightics VDB. It operates in three modes: New, Append, and Overwrite. It can create new data or change existing data in the VDB.

## Properties
### VA
#### INPUT
1. **table**: (Table) A table to be stored in the Brightics VDB.
#### OUTPUT
#### PARAMETER
1. **Unload Mode**<b style="color:red">*</b>: Write mode. There are three write modes: New, Append, Overwrite

2. **Data Unit**<b style="color:red">*</b>: A data unit is the unit of data that is registered through VDB and connected to a data source.
Data unit has four types: *DIR, FILE, DATABASE, TABLE* 

3. **Data**: The data is the lower level of the data unit and can be a table or file.

## Constraint
1. Only authorized data in the VDB is viewed. 
2. If the data unit type is *TABLE* or *FILE*, the data level does not exist. 
3. In the *New* mode, it cannot select a data unit which type is FILE or TABLE.
4. In the *New* mode, the data must be entered directly.

## Example
### VA

<img src="/static/help/python/sample_model_img/unload_to_vdb.PNG"  width="600px" style="border: 1px solid gray" >

To perform the example, create *Load* and *Unload to VDB* functions and connect them to each other.
Then, set the properties of *Unload to VDB* like below parameters.

++Parameters++
1. **Unload Mode**<b style="color:red">*</b>: New
2. **Data Unit**<b style="color:red">*</b>: brightics (type: DIR)
3. **Data**: new_iris.csv


##### ++In++
|SepalLength|SepalWidth|PetalLength|PetalWidth|Species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5|3.6|1.4|0.2|setosa|


##### ++Out++
The input table is unloaded as a new file or table in the data unit.
