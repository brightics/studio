## Format
### Python
```python
from brightics.function.recommendation import als_train
res = als_train(table = ,user_col = ,item_col = ,rating_col = ,implicit = ,iterations = ,reg_param = ,seed = ,rank = ,alpha = ,group_by = )
res['model']
```

## Description
Learn a recommender model from the given data. This function uses the ALS(alternating least squares) algorithm to learn latent factors.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **User Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **Item Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Double, String, Float
3. **Rating Column**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **Implicit Preference**: Whether to use the explicit feedback ALS variant or one adapted for implicit feedback data.
5. **Iterations**: Maximum number of iteration. 'Iteration' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
6. **Reg Param**: Regularization constant. Default : 0.1 (Double)
   - Value type : Double
   - Default : 0.1 (0 <= value)
7. **Seed**: Random seed to have deterministic results.
   - Value type : Integer
8. **Rank**: Rank of the feature matrices computed (number of factors to use) 'Rank' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
9. **Alpha**: The alpha constant used in computing confidence in implicit ALS. Default: 1.0 (Double)
   - Value type : Double
   - Default : 1.0 (0 <= value)
10. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **user_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double, String
2. **item_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Double, String, Float
3. **rating_col**<b style="color:red">*</b>: 
   - Allowed column type : Integer, Long, Float, Double
4. **implicit**: Whether to use the explicit feedback ALS variant or one adapted for implicit feedback data.
5. **iterations**: Maximum number of iteration. 'Iteration' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
6. **reg_param**: Regularization constant. Default : 0.1 (Double)
   - Value type : Double
   - Default : 0.1 (0 <= value)
7. **seed**: Random seed to have deterministic results.
   - Value type : Integer
8. **rank**: Rank of the feature matrices computed (number of factors to use) 'Rank' should be greater than 0. Default : 10 (Integer)
   - Value type : Integer
   - Default : 10 (1 <= value)
9. **alpha**: The alpha constant used in computing confidence in implicit ALS. Default: 1.0 (Double)
   - Value type : Double
   - Default : 1.0 (0 <= value)
10. **group_by**: Columns to group by

#### Outputs: model

