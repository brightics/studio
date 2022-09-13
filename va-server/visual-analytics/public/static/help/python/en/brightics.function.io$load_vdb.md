## Format
Load data from the Brightics VDB.

## Description
This function loads data from the Brightics VDB(Virtual Data Box). The VDB is a data hub that registers  data source of various types and manages authority according to each data level. This function can load authorized data by selecting a data unit through the data viewer. 

## Properties
### VA
#### INPUT

#### OUTPUT
1. **table**: (Table) Table with the data loaded from the Brightics VDB.
#### PARAMETER
1. **Data Unit**<b style="color:red">*</b>: A data unit is the unit of data that is registered through VDB and connected to a data source.
Data unit has four types: *DIR, FILE, DATABASE, TABLE* 

2. **Data**: The data is the lower level of the data unit and can be a table or file. 


## Constraint
1. Only authorized data in the VDB is viewed. 
2. If the data unit type is *TABLE* or *FILE*, the data level does not exist. 

## Example
### VA

<img src="/static/help/python/sample_model_img/load_from_vdb.PNG"  width="700px" style="border: 1px solid gray" >

To perform the example, create *Load from VDB* functions and then set the properties of function like below parameters.

++Parameters++
1. **Data Unit**<b style="color:red">*</b>: brightics (type: DIR)
2. **Data**: sample_iris.csv

##### ++Out++
|SepalLength|SepalWidth|PetalLength|PetalWidth|Species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5|3.6|1.4|0.2|setosa|
