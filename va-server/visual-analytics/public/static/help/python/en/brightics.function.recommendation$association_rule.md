## Format
### Python
```python
from brightics.function.recommendation import association_rule
res = association_rule(table = ,input_mode = ,array_input = ,mul_items = ,user_name = ,items = ,min_support = ,min_confidence = ,min_lift = ,max_lift = ,min_conviction = ,max_conviction = ,group_by = )
res['out_table']
```

## Description
This function computes the association rules using the FP-growth algorithm. It requires an input table of database consisting of transactions, where a transaction is a set of items. It presents rules which are defined by an itemset(antecedent) and an item(consequent). An example rule for the supermarket domain could be {butter, bread}=> milk, meaning that if butter and bread are bought, then the customer is likely to buy milk. Several measures are presented including support, confidence, lift, and conviction.

Reference:

https://en.wikipedia.org/wiki/Association_rule_learning

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Type**: 
   - Available items
      - User - single item (default)
      - User - multiple items 
      - Array
2. **Input Column**: Column to select as input
   - Allowed column type : String[], Double[]
3. **Item Columns**: for Input Type "User - multiple items"
   - Allowed column type : Integer, Long, Float, Double, String
4. **User Column**<b style="color:red">*</b>: for Input Type "User-single item"
   - Allowed column type : Integer, Long, Float, Double, String
5. **Item Column**<b style="color:red">*</b>: for Input Type "User-single item"
   - Allowed column type : Integer, Long, Float, Double, String
6. **Min Support**: The minimal support level. Default: 0.01
   - Value type : Double
   - Default : 0.01 (0 <= value <= 1)
7. **Min Confidence**: The minimal confidence. Default: 0.8
   - Value type : Double
   - Default : 0.8 (0 <= value <= 1)
8. **Min Lift**: 
   - Value type : Double
   - Default : 0
9. **Max Lift**: 
   - Value type : Double
   - Default : infinity
10. **Min Conviction**: 
    - Value type : Double
    - Default : 0
11. **Max Conviction**: 
    - Value type : Double
    - Default : infinity
12. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_mode**: 
   - Available items
      - item_user (default)
      - user_multiple
      - transaction
2. **array_input**: Column to select as input
   - Allowed column type : String[], Double[]
3. **mul_items**: for Input Type "User - multiple items"
   - Allowed column type : Integer, Long, Float, Double, String
4. **user_name**<b style="color:red">*</b>: for Input Type "User-single item"
   - Allowed column type : Integer, Long, Float, Double, String
5. **items**<b style="color:red">*</b>: for Input Type "User-single item"
   - Allowed column type : Integer, Long, Float, Double, String
6. **min_support**: The minimal support level. Default: 0.01
   - Value type : Double
   - Default : 0.01 (0 <= value <= 1)
7. **min_confidence**: The minimal confidence. Default: 0.8
   - Value type : Double
   - Default : 0.8 (0 <= value <= 1)
8. **min_lift**: 
   - Value type : Double
   - Default : 0
9. **max_lift**: 
   - Value type : Double
   - Default : infinity
10. **min_conviction**: 
    - Value type : Double
    - Default : 0
11. **max_conviction**: 
    - Value type : Double
    - Default : infinity
12. **group_by**: Columns to group by

#### Outputs: table

