## Format
Write a dataset to selected S3.

## Description
This function converts an input table as CSV then upload it to selected S3 bucket.

---

## Properties
### VA
#### INPUT
1. **table**: Data in a table.
#### OUTPUT
This function has no output data.
#### PARAMETER
1. **Data Source**<b style="color:red">*</b>: Predefined data source. List of data sources can be updated from Datasource Management dialog on GUI.
1. **Object Key**<b style="color:red">*</b>: Object key to be created in the bucket.


## Example
### VA

**<a href="/static/help/python/sample_model/Write_to_S3.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/write_to_s3_1.PNG"  width="800px" style="border: 1px solid gray" >

First, make sure that the data source to which the input dataset is saved is in the list of data sources. The list can be managed through Datasource Management, marked in the figure above. Input the name of the data source, cloud type, access key ID, secret access key, and bucket name.

<img src="/static/help/python/sample_model_img/write_to_s3_2.PNG"  width="800px" style="border: 1px solid gray" >

This model is a simple example for Write to S3 function. In the example, the Write to S3 function gets sample_iris data as the input, selects a data source, and writes the dataset as a CSV file in the data source with an object key 'iris'. The parameter settings used in the function are shown below.

++Parameters++
1. **Data Source**: 
2. **Object Key**: iris
