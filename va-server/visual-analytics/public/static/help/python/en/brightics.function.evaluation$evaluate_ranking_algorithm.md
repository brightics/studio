## Format
### Python
```python
from brightics.function.evaluation import evaluate_ranking_algorithm
res = evaluate_ranking_algorithm(table1 = ,table2 = ,user_col = ,item_col = ,rating_col = ,rating_edge = ,evaluation_measure = ,k_values = )
res['out_table']
```

## Description
Evaluate ranking algorithms. Compute relevance score for the recommendation

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **User Column**<b style="color:red">*</b>: Column name for users.
   - Allowed column type : Integer, Long, Float, Double, String
2. **Item Column**<b style="color:red">*</b>: Column name for items.
   - Allowed column type : Integer, Long, Float, Double, String
3. **Rating Column**: Column name for ratings. Type of 'Rating Column' should be number type. 'Rating Column' is required for using 'Rating Edge'.
   - Allowed column type : Integer, Long, Float, Double
4. **Rating Edge**: To produce confidence scores 'Rating Edge' is used. Assume that any item a user rated 'Rating Edge' or higher is a relevant set. (rating value of train data > 'Rating Edge')
   - Value type : Double
   - Default : Enter value
5. **Evaluation Measure**<b style="color:red">*</b>: Evaluation measure names.
   - Available items
      - Precision
      - NDCG
      - MAP
6. **K-Values**: It is required for computing 'Precision' or 'NDCG'. 'K-Values' must be positive and should be less than or equal to topN-number.

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **user_col**<b style="color:red">*</b>: Column name for users.
   - Allowed column type : Integer, Long, Float, Double, String
2. **item_col**<b style="color:red">*</b>: Column name for items.
   - Allowed column type : Integer, Long, Float, Double, String
3. **rating_col**: Column name for ratings. Type of 'Rating Column' should be number type. 'Rating Column' is required for using 'Rating Edge'.
   - Allowed column type : Integer, Long, Float, Double
4. **rating_edge**: To produce confidence scores 'Rating Edge' is used. Assume that any item a user rated 'Rating Edge' or higher is a relevant set. (rating value of train data > 'Rating Edge')
   - Value type : Double
   - Default : Enter value
5. **evaluation_measure**<b style="color:red">*</b>: Evaluation measure names.
   - Available items
      - prec
      - ndcg
      - map
6. **k_values**: It is required for computing 'Precision' or 'NDCG'. 'K-Values' must be positive and should be less than or equal to topN-number.

#### Outputs: table

