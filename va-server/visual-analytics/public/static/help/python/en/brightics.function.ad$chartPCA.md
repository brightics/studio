## Format



## Description
3D scatterplots can be useful to display the result of a PCA

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double

#### Outputs: model

### Python

#### USAGE
```python
from brightics.function.ad import chartPCA
res = chartPCA(input_table = ,feature_cols = )
res['output_model']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double

#### Outputs: model

