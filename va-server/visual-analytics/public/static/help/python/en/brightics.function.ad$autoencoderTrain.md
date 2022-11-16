## Format



## Description
The module takes as input time varying data in scenarios where variables correlate to each other and it is difficult to get a reliability of detected anomalies using a simple threshold.

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01

#### Outputs: table, table, model, table

### Python
#### USAGE
```python
from brightics.function.ad import autoencoderTrain
res = autoencoderTrain(input_table = ,feature_cols = ,alpha = )
res['output_table_score']
res['output_table_cl']
res['output_model']
res['output_table']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **alpha**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01

#### Outputs: table, table, model, table

