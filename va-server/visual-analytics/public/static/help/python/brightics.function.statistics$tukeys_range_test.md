## Format
### Python
```python
from brightics.function.statistics import tukeys_range_test
res = tukeys_range_test(response_cols = ,factor_col = ,alpha = )
res['result']
```

## Description
This function conduct Tukey's range test using statsmodels package. 

Reference:
+ <https://en.wikipedia.org/wiki/Tukey%27s_range_test>

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Response columns
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Factor column
3. **Significance Level**: Significant level
   - Value type : Double
   - Default : 0.05

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Response columns
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Factor column
3. **alpha**: Significant level
   - Value type : Double
   - Default : 0.05

#### Outputs
1. **result**: model

