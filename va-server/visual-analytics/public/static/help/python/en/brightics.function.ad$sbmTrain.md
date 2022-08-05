## Format


## Description
This let you train a model using existing imbalanced data

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
3. **Number of cluster(s)(1 <= value <= 10)**: Number of cluster(s)(1 <= value <= 10)
   - Value type : Integer
   - Default : 1
4. **Binsize(10 <= value <= 100)**: Binsize(10 <= value <= 100)
   - Value type : Integer
   - Default : 30

#### Outputs: table, table, model

### Python

#### USAGE
```python
from brightics.function.ad import sbmTrain
res = sbmTrain(input_table = ,feature_cols = ,alpha = ,cluster = ,binsize = )
res['output_table_score']
res['output_table_cl']
res['output_model']
```

#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **alpha**: Confidence Level(0 < value < 1)
   - Value type : Double
   - Default : 0.01
3. **cluster**: Number of cluster(s)(1 <= value <= 10)
   - Value type : Integer
   - Default : 1
4. **binsize**: Binsize(10 <= value <= 100)
   - Value type : Integer
   - Default : 30

#### Outputs: table, table, model

