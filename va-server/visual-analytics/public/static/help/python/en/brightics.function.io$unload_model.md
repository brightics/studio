## Format
Store pre-trained model as a file.

## Description
This function stores (=unload) a trained model as a file. The stored models can be utilized later by importing them using Load Model function.  


## Properties
### VA
#### INPUT
1. **Target**:(Model) Pre-trained model to be stored as a file. 
#### OUTPUT
1. **out-model**:(Model) A json file.    
#### PARAMETER
1. **Path**: Absolute path and name of the model file to be stored. 


## Example
### VA

**<a href="/static/help/python/sample_model/unload_model.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/unload_model.PNG"  width="800px" style="border: 1px solid gray" >

This model is a simple example for Unload Model function. In the example, the Unload Model function stores a trained model, that has been trained by Linear Regression Train Function. 

++Parameters++
1. **Target**:Linear Regression Train
2. **Path**: C:/brightics/models/LinearRegressionModel
