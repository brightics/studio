## Format


## Description
This function shows in the order of highly important variables

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double

#### Outputs: table, model

### Python
#### USAGE
```python
from brightics.function.ad import variableImportance
res = variableImportance(input_table = ,score_table = ,feature_cols = )
res['ad_variableImportance']
res['histogram_variableImportance']
```

#### Inputs: table, table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double

#### Outputs: table, model

