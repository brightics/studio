## Format
### Python
```python
from brightics.function.textanalytics import stopwords_remover_user_dict
res = stopwords_remover_user_dict(table = ,user_dict = ,input_cols = ,hold_cols = ,default_dict = ,stop_words = ,prefix = )
res['out_table']
```

## Description
This function removes stopwords which are commonly used word.

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
2. **Hold Columns**: Result table includes hold columns in in-table as well as the result of the operation.
3. **Default Dictionary**: Option on whether to use default dictionary.
4. **Stop Words**: User list of stop words.
5. **Prefix**: Prefix for new column name.
   - Value type : String
   - Default : stopwords

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
2. **hold_cols**: Result table includes hold columns in in-table as well as the result of the operation.
3. **default_dict**: Option on whether to use default dictionary.
4. **stop_words**: User list of stop words.
5. **prefix**: Prefix for new column name.
   - Value type : String
   - Default : stopwords

#### Outputs: table

