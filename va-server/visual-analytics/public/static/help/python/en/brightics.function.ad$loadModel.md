## Format



## Description
Load created model file from AD Unload Model module in Brightics.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: This function has no input data.

#### Parameters
1. **Name**<b style="color:red">*</b>: Load model name(in default path)
   - Value type : String

#### Outputs: table, model

### Python

#### USAGE
```python
from brightics.function.ad import loadModel
res = loadModel(model_name = )
res['out_table']
res['out_model']
```
#### Inputs: This function has no input data.

#### Parameters
1. **model_name**<b style="color:red">*</b>: Load model name(in default path)
   - Value type : String

#### Outputs: table, model

