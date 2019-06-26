## Format
### Python
```python
from brightics.function.recommendation import association_rule
res = association_rule(items = ,user_name = ,min_support = ,min_confidence = ,min_lift = ,max_lift = ,min_conviction = ,max_conviction = ,group_by = )
res['out_table']
```

## Description
This function computes the association rules using the FP-growth algorithm. It requires an input table of database consisting of transactions, where a transaction is a set of items. It presents rules which are defined by an itemset(antecedent) and an item(consequent). An example rule for the supermarket domain could be {butter, bread}=> milk, meaning that if butter and bread are bought, then the customer is likely to buy milk. Several measures are presented including support, confidence, lift, and conviction.

Reference:

https://en.wikipedia.org/wiki/Association_rule_learning

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Item Column**<b style="color:red">*</b>: 
2. **User Column**<b style="color:red">*</b>: 
3. **Min Support**: The minimal support level. Default: 0.01
   - Value type : Double
   - Default : 0.01 (0 <= value <= 1)
4. **Min Confidence**: The minimal confidence. Default: 0.8
   - Value type : Double
   - Default : 0.8 (0 <= value <= 1)
5. **Min Lift**: 
   - Value type : Double
   - Default : 0
6. **Max Lift**: 
   - Value type : Double
   - Default : infinity
7. **Min Conviction**: 
   - Value type : Double
   - Default : 0
8. **Max Conviction**: 
   - Value type : Double
   - Default : infinity
9. **Group By**: Columns to group by

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **items**<b style="color:red">*</b>: 
2. **user_name**<b style="color:red">*</b>: 
3. **min_support**: The minimal support level. Default: 0.01
   - Value type : Double
   - Default : 0.01 (0 <= value <= 1)
4. **min_confidence**: The minimal confidence. Default: 0.8
   - Value type : Double
   - Default : 0.8 (0 <= value <= 1)
5. **min_lift**: 
   - Value type : Double
   - Default : 0
6. **max_lift**: 
   - Value type : Double
   - Default : infinity
7. **min_conviction**: 
   - Value type : Double
   - Default : 0
8. **max_conviction**: 
   - Value type : Double
   - Default : infinity
9. **group_by**: Columns to group by

#### Outputs
1. **out_table**: table

