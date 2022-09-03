## Format


## Description
Sequential Probability Ratio Test Filter Anomaly Detection Alarm based on Sequential Probability Ratio Test.

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
3. **beta(0 < value < 1)**: beta(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **sigma(0 <= value < 6)**: sigma(0 <= value < 6)
   - Value type : Double
   - Default : 3.0

#### Outputs: table

### Python

#### USAGE
```python
from brightics.function.ad import sprtFilter
res = sprtFilter(input_table_score = ,input_model = ,feature_cols = ,alpha = ,beta = ,sigma = )
res['ad_filtered_alarm']
```

#### Inputs: table, model

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **alpha**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **beta**: beta(0 < value < 1)
   - Value type : Double
   - Default : 0.01
4. **sigma**: sigma(0 <= value < 6)
   - Value type : Double
   - Default : 3.0

#### Outputs: table

