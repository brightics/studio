## Format
### Python
```python
from brightics.function.textanalytics import bow
res = bow(table = ,input_col = ,no_below = ,no_above = ,keep_n = ,group_by = )
res['model']
res['out_table']
```

## Description
A bag of words is a representation of text that describes the occurrence of words within a document. It involves two things: A vocabulary of known words. A measure of the presence of known words. 

Reference:
+ <https://en.wikipedia.org/wiki/Bag-of-words_model>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Minimum Number of Occurrence**: Keep tokens which are contained in at least no_below documents.
   - Value type : Integer
   - Default : 1 (value >= 0)
3. **Maximum Fraction of Occurrence**: Keep tokens which are contained in no more than this number of documents (fraction of total corpus size).
   - Value type : Double
   - Default : 0.8 (1.0 >= value > 0.0)
4. **N most Frequent**: Keep only the first "N" most frequent tokens.
   - Value type : Integer
   - Default : 10000 (value >= 1)
5. **Group By**: Columns to group by

#### Outputs: model, table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **no_below**: Keep tokens which are contained in at least no_below documents.
   - Value type : Integer
   - Default : 1 (value >= 0)
3. **no_above**: Keep tokens which are contained in no more than this number of documents (fraction of total corpus size).
   - Value type : Double
   - Default : 0.8 (1.0 >= value > 0.0)
4. **keep_n**: Keep only the first "N" most frequent tokens.
   - Value type : Integer
   - Default : 10000 (value >= 1)
5. **group_by**: Columns to group by

#### Outputs: model, table

