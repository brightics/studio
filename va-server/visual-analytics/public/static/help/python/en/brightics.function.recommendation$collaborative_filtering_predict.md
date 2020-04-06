## Format
### Python
```python
from brightics.function.recommendation import collaborative_filtering_predict
res = collaborative_filtering_predict(table = ,model = ,maintain_already_scored = ,filter_minus = ,prediction_col = )
res['out_table']
```

## Description
This function predicts ratings for user-item pairs.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Maintain the score of already scored items.**: Whether to maintain the score of already scored items..
2. **Filter Neighbors whose similarity is minus.**: Whether to filter Neighbors whose similarity is minus.
3. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **maintain_already_scored**: Whether to maintain the score of already scored items..
2. **filter_minus**: Whether to filter Neighbors whose similarity is minus.
3. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

