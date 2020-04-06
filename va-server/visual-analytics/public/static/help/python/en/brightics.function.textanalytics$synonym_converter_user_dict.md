## Format
### Python
```python
from brightics.function.textanalytics import synonym_converter_user_dict
res = synonym_converter_user_dict(table = ,user_dict = ,input_cols = ,hold_cols = ,synonym_list = ,prefix = )
res['out_table']
```

## Description
This function converts similar words into a representative word. The first column of user-dictionary must be representative words and the second column must be synonyms.

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
2. **Hold Columns**: Result table includes hold columns in in-table as well as the result of the operation.
3. **Synonym List**: User list of synonyms. To change 'apple', 'banana' and 'carrot' to 'fruits', enter : fruits, apple, banana, carrot
4. **Prefix**: Prefix for new column name.
   - Value type : String
   - Default : synonym_removed

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
2. **hold_cols**: Result table includes hold columns in in-table as well as the result of the operation.
3. **synonym_list**: User list of synonyms. To change 'apple', 'banana' and 'carrot' to 'fruits', enter : fruits, apple, banana, carrot
4. **prefix**: Prefix for new column name.
   - Value type : String
   - Default : synonym_removed

#### Outputs: table

