## Format


## Description
The bootstrap method is a nonparametric technique that does not rely on the assumption of a parametric distribution of the observed data.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Target Limits**<b style="color:red">*</b>: Select Limits
   - Available items
      - Ucl (default)
      - Lcl (default)
3. **Confidence Level(0 < value < 1)**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **Number of Samples(50 <= value <= 1000)**: Number of Samples(50 <= value <= 1000)
   - Value type : Integer
   - Default : 100

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import bootlimit
res = bootlimit(input_table = ,feature_cols = ,limits = ,alpha = ,bootstrap = )
res['out_table']
```


#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **limits**<b style="color:red">*</b>: Select Limits
   - Available items
      - ucl (default)
      - lcl (default)
3. **alpha**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **bootstrap**: Number of Samples(50 <= value <= 1000)
   - Value type : Integer
   - Default : 100

#### Outputs: table

