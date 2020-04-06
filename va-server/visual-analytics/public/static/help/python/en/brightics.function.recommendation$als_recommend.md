## Format
### Python
```python
from brightics.function.recommendation import als_recommend
res = als_recommend(table = ,user_col = ,item_col = ,rating_col = ,number = ,filter = ,targets = ,implicit = ,iterations = ,reg_param = ,seed = ,rank = ,alpha = ,group_by = ,workers = )
res['out_table']
```

## Description
Recommends TOP-N items for users. This function uses the ALS(alternating least squares) algorithm to learn latent factors.

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
4. **Number of recommendations**: Number of recommendations in the top N list. (integer) 'Number of recommendations' should be greater than 0.
   - Value type : Integer
   - Default : 10 (1 <= value)
5. **Filter already liked items**: Whether to filter already liked items.
6. **Target Users**: Target users to recommend top N items. Default : all users in user-factors data.
7. **Implicit Preference**: Whether to use the explicit feedback ALS variant or one adapted for implicit feedback data.
8. **Iterations**: Maximum number of iteration. 'Iteration' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
9. **Reg Param**: Regularization constant. Default : 0.1 (Double)
   - Value type : Double
   - Default : 0.1 (0 <= value)
10. **Seed**: Random seed to have deterministic results.
    - Value type : Integer
11. **Rank**: Rank of the feature matrices computed (number of factors to use) 'Rank' should be greater than 0. Default : 10 (Integer)
    - Value type : Integer
    - Default : 10 (1 <= value)
12. **Alpha**: The alpha constant used in computing confidence in implicit ALS. Default: 1.0 (Double)
    - Value type : Double
    - Default : 1.0 (0 <= value)
13. **Group By**: Columns to group by
14. **Workers**: Number of workers(Recommended only if target is all.)
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
4. **number**: Number of recommendations in the top N list. (integer) 'Number of recommendations' should be greater than 0.
   - Value type : Integer
   - Default : 10 (1 <= value)
5. **filter**: Whether to filter already liked items.
6. **targets**: Target users to recommend top N items. Default : all users in user-factors data.
7. **implicit**: Whether to use the explicit feedback ALS variant or one adapted for implicit feedback data.
8. **iterations**: Maximum number of iteration. 'Iteration' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
9. **reg_param**: Regularization constant. Default : 0.1 (Double)
   - Value type : Double
   - Default : 0.1 (0 <= value)
10. **seed**: Random seed to have deterministic results.
    - Value type : Integer
11. **rank**: Rank of the feature matrices computed (number of factors to use) 'Rank' should be greater than 0. Default : 10 (Integer)
    - Value type : Integer
    - Default : 10 (1 <= value)
12. **alpha**: The alpha constant used in computing confidence in implicit ALS. Default: 1.0 (Double)
    - Value type : Double
    - Default : 1.0 (0 <= value)
13. **group_by**: Columns to group by
14. **workers**: Number of workers(Recommended only if target is all.)
    - Value type : Integer
    - Default : Enter value

#### Outputs: table

