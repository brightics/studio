## Format
### Python
```python
from brightics.function.textanalytics import doc_doc_mtx
res = doc_doc_mtx(table = ,model = ,input_col = ,result_type = )
res['out_table']
```

## Description
A document-document matrix is a square matrix, where each cell represents the number of common terms that two documents both contain.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Result**: Select result type.
   - Available items
      - Sparse (default)
      - Dense

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **result_type**: Select result type.
   - Available items
      - sparse (default)
      - dense

#### Outputs: table

