## Format



## Description
This function to create an anomaly detection model based on Randomforest Regression Model

---

## Properties
### VA
#### Inputs<b style="color:red">*</b>: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **Confidence Level(0 < value < 1)**: Confidence Level
   - Value type : Double
   - Default : 0.01
   - Range : 0 < value < 1
3. **Number of tree(s)(1 < value <= 100)**: Number of tree(s)
   - Value type : Integer
   - Default : 10
   - Range : 1 < value <= 100
4. **Number of max feature(s)(0 <= value < n_feature)**: The number of features to consider when looking for the best split. If value is 0, then max_features is n_feature-1.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature
5. **Maximum depth(0 <= value < n_features^2)**: The maximum depth of the tree. If value is 0, then nodes are expanded until all leaves are pure.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature^2

#### Outputs: table, table, model

### Python

#### USAGE
```python
from brightics.function.ad import randomForestTrain
res = randomForestTrain(input_table = ,feature_cols = ,alpha = ,ntree = ,max_features = ,max_depth = )
res['output_table_score']
res['output_table_cl']
res['output_model']
```
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Integer, Long, Double
2. **alpha**: Confidence Level
   - Value type : Double
   - Default : 0.01
   - Range : 0 < value < 1
3. **ntree**: Number of tree(s)
   - Value type : Integer
   - Default : 10
   - Range : 1 < value <= 100
4. **max_features**: The number of features to consider when looking for the best split. If value is 0, then max_features is n_feature-1.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature
5. **max_depth**: The maximum depth of the tree. If value is 0, then nodes are expanded until all leaves are pure.
   - Value type : Integer
   - Default : 0
   - Range : 0 <= value < n_feature^2

#### Outputs: table, table, model

