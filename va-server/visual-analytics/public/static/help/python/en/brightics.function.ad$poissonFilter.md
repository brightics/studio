## Format


## Description
This function filters sparse false alarms based on the certain statistical hypothesis tests such as the Poisson cumulative density function.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table, model

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **Window size(1 < value <= total row size)**: Window size(1 < value <= total row size)
   - Value type : Integer
   - Default : 30

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import poissonFilter
res = poissonFilter(input_table_alarm = ,input_model = ,feature_cols = ,alpha = ,winsize = )
res['ad_filtered_alarm']
```

#### Inputs: table, model

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **alpha**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **winsize**: Window size(1 < value <= total row size)
   - Value type : Integer
   - Default : 30

#### Outputs: table

