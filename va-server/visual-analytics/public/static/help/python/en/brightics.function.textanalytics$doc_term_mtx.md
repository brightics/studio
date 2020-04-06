## Format
### Python
```python
from brightics.function.textanalytics import doc_term_mtx
res = doc_term_mtx(table = ,model = ,input_col = ,result_type = )
res['out_table']
```

## Description
"A document-term matrix or term-document matrix is a mathematical matrix that describes the frequency of terms that occur in a collection of documents." 

Reference:
+ <https://en.wikipedia.org/wiki/Document-term_matrix>

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Result**: Select result type.
   - Available items
      - Doc to BOW with Token (default)
      - Term-document Matrix
      - Document-term Matrix

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **result_type**: Select result type.
   - Available items
      - doc_to_bow_token (default)
      - term_doc_mtx
      - doc_term_mtx

#### Outputs: table

