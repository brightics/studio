## Format
### Python
```python
from brightics.function.recommendation import collaborative_filtering_recommend
res = collaborative_filtering_recommend(table = ,user_col = ,item_col = ,rating_col = ,N = ,filter = ,maintain_already_scored = ,targets = ,k = ,filter_minus = ,based = ,normalize = ,method = ,centered = ,weighted = ,group_by = ,workers = )
res['out_table']
```

## Description
Recommends TOP-N items for users using collaborative filtering.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **User Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **Item Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
3. **Rating Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **Number of recommendations**: Number of recommendations in the top N list.
   - Value type : Integer
   - Default : 10 (1 <= value)
5. **Filter already liked items**: Whether to filter already liked items.
6. **Maintain the score of already scored items.**: Whether to maintain the score of already scored items..
7. **Target Users**: Target users to recommend top N items. Default : all users in user-factors data.
8. **Number of Neighbors**: Number of similar items or users to get predicted rating for target.
   - Value type : Integer
   - Default : 5 (1 <= value)
9. **Filter Neighbors whose similarity is minus.**: Whether to filter Neighbors whose similarity is minus.
10. **Based**: 
    - Available items
       - Item Based (default)
       - User Based
11. **Normalization of user tendency**: To remove individual rating bias by users who consistently always use lower or higher ratings than other users.
12. **Similarity method**: Estimate how much target user and another user is similar(close).
    - Available items
       - Cosine (default)
       - Pearson
       - Jaccard
       - Adjusted Cosine
13. **Use Centered Mean**: To make non-rated item neutral, when this is True, summation of rating becomes 0 for each items and the rating is 0 for non-rated items.
14. **Use Weighted Rating**: If True, predicted rating for target user is closer to more similar neighbor. If False, predicted rating for target user is equally close to k similar users.
15. **Group By**: Columns to group by
16. **Workers**: Number of workers(Recommended only if target is all.)
    - Value type : Integer
    - Default : Enter value

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **user_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **item_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
3. **rating_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **N**: Number of recommendations in the top N list.
   - Value type : Integer
   - Default : 10 (1 <= value)
5. **filter**: Whether to filter already liked items.
6. **maintain_already_scored**: Whether to maintain the score of already scored items..
7. **targets**: Target users to recommend top N items. Default : all users in user-factors data.
8. **k**: Number of similar items or users to get predicted rating for target.
   - Value type : Integer
   - Default : 5 (1 <= value)
9. **filter_minus**: Whether to filter Neighbors whose similarity is minus.
10. **based**: 
    - Available items
       - item (default)
       - user
11. **normalize**: To remove individual rating bias by users who consistently always use lower or higher ratings than other users.
12. **method**: Estimate how much target user and another user is similar(close).
    - Available items
       - cosine (default)
       - pearson
       - jaccard
       - adjusted
13. **centered**: To make non-rated item neutral, when this is True, summation of rating becomes 0 for each items and the rating is 0 for non-rated items.
14. **weighted**: If True, predicted rating for target user is closer to more similar neighbor. If False, predicted rating for target user is equally close to k similar users.
15. **group_by**: Columns to group by
16. **workers**: Number of workers(Recommended only if target is all.)
    - Value type : Integer
    - Default : Enter value

#### Outputs: table

