## Format
### Python
```python
from brightics.function.statistics import tukeys_range_test
res = tukeys_range_test(table = ,response_cols = ,factor_col = ,alpha = ,group_by = )
res['result']
```

## Description
This function conduct Tukey's range test using statsmodels package. 

Reference:
+ <https://en.wikipedia.org/wiki/Tukey%27s_range_test>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Response Columns**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **Factor Column**<b style="color:red">*</b>: Column to select as factor
3. **Significance Level**: Significant level
   - Value type : Double
   - Default : 0.05 (0.001 <= value < 0.9)
4. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **response_cols**<b style="color:red">*</b>: Columns to select as response
   - Allowed column type : Integer, Long, Float, Double
2. **factor_col**<b style="color:red">*</b>: Column to select as factor
3. **alpha**: Significant level
   - Value type : Double
   - Default : 0.05 (0.001 <= value < 0.9)
4. **group_by**: Columns to group by

#### Outputs: model

