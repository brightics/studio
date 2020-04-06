## Format
### Python
```python
from brightics.function.textanalytics import extract_senti_words
res = extract_senti_words(table = ,user_dict = ,input_col = ,hold_cols = )
res['out_table']
```

## Description
This function extracts sentimental words from given documents. A data of the first column in user-dictionary should be words and the second column should be scores. A range of scores of the default dictionary is [-2, 2]

---

## Properties
### VA
#### Inputs: table, table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Hold Columns**: Column to select as hold.

#### Outputs: table

### Python
#### Inputs: table, table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **hold_cols**: Column to select as hold.

#### Outputs: table

