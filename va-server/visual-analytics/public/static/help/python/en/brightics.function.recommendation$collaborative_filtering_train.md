## Format
### Python
```python
from brightics.function.recommendation import collaborative_filtering_train
res = collaborative_filtering_train(table = ,user_col = ,item_col = ,rating_col = ,k = ,based = ,normalize = ,method = ,centered = ,weighted = ,group_by = )
res['model']
```

## Description
Learn a recommender model from the given data.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **User Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **Item Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Double, Float, String
3. **Rating Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **Number of Neighbors**: Number of similar items or users to get predicted rating for target.
   - Value type : Integer
   - Default : 5 (1 <= value)
5. **Based**: 
   - Available items
      - Item Based (default)
      - User Based
6. **Normalization of user tendency**: To remove individual rating bias by users who consistently always use lower or higher ratings than other users.
7. **Similarity method**: Estimate how much target user and another user is similar(close).
   - Available items
      - Cosine (default)
      - Pearson
      - Jaccard
      - Adjusted Cosine
8. **Use Centered Mean**: To make non-rated item neutral, when this is True, summation of rating becomes 0 for each items and the rating is 0 for non-rated items.
9. **Use Weighted Rating**: If True, predicted rating for target user is closer to more similar neighbor. If False, predicted rating for target user is equally close to k similar users.
10. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **user_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **item_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Double, Float, String
3. **rating_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **k**: Number of similar items or users to get predicted rating for target.
   - Value type : Integer
   - Default : 5 (1 <= value)
5. **based**: 
   - Available items
      - item (default)
      - user
6. **normalize**: To remove individual rating bias by users who consistently always use lower or higher ratings than other users.
7. **method**: Estimate how much target user and another user is similar(close).
   - Available items
      - cosine (default)
      - pearson
      - jaccard
      - adjusted
8. **centered**: To make non-rated item neutral, when this is True, summation of rating becomes 0 for each items and the rating is 0 for non-rated items.
9. **weighted**: If True, predicted rating for target user is closer to more similar neighbor. If False, predicted rating for target user is equally close to k similar users.
10. **group_by**: Columns to group by

#### Outputs: model

