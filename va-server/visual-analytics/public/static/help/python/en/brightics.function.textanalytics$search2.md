## Format
### Python
```python
from brightics.function.textanalytics import search2
res = search2(table = ,keyword_dict = ,synonym_dict = ,input_cols = ,hold_cols = ,bool_search = ,keywords = ,remove_na = )
res['out_table']
```

## Description
Text Search is to search text in a document. Keywords and the elements of Keyword Dictionary are the search text. If a search text is contained in the first column of Synonym Dictionary, then Text Search uses the synonyms as the original keyword.

---

## Properties
### VA
#### Inputs: table, table, table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Hold Columns**: Result table includes hold columns in in-table as well as the result of the operation.
3. **Boolean Search**: A type of search allowing users to combine keywords with operators such as And and Or.
   - Available items
      - Or (default)
      - And
4. **Keywords**: Search text.
5. **How to Handle Missing Data**: How to handle missing data.
   - Available items
      - Not to remove (default)
      - To remove rows with all values missing
      - To remove rows with any values missing

#### Outputs: table

### Python
#### Inputs: table, table, table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **hold_cols**: Result table includes hold columns in in-table as well as the result of the operation.
3. **bool_search**: A type of search allowing users to combine keywords with operators such as And and Or.
   - Available items
      - or (default)
      - and
4. **keywords**: Search text.
5. **remove_na**: How to handle missing data.
   - Available items
      - no (default)
      - all
      - any

#### Outputs: table

