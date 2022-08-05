## Format
Load a trained model as a file.

## Description
This function loads a trained model data from the set path.


## Properties
### VA
#### INPUT
This function has no input data.
#### OUTPUT
1. **model**: (Model) A json file for the trained model.   

#### PARAMETER
1. **Path**<b style="color:red">*</b>: Path to load a trained model file.

## Example
### VA

**<a href="/static/help/python/sample_model/load_model.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/load_model.PNG"  width="800px" style="border: 1px solid gray" >

In the tutorial workflow, this model is a simple example for Unload Model function. In the example, the Unload Model function stores a trained model, that has been trained by Linear Regression Train Function. Then the Load Model function loads a trained model that was stored by the Unload Model function. The parameter settings used in the function are shown below.

++Parameters++
1. **Path**<b style="color:red">*</b>: C:/brightics/models/LinearRegressionModel