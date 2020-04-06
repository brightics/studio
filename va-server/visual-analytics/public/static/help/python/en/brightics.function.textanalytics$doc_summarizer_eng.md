## Format
### Python
```python
from brightics.function.textanalytics import doc_summarizer_eng
res = doc_summarizer_eng(table = ,input_col = ,result_type = ,hold_cols = ,ratio = ,num_sentence = ,new_col_name = )
res['out_table']
```

## Description
This function summarizes English documents.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **Result Type**: Output type of summarization.
   - Available items
      - Summarized Document
      - Sentence (default)
3. **Hold Columns**: Column to select as hold.
4. **Compression Ratio**: Number between 0 and 1 that determines the proportion of the number of sentences of the original text to be chosen for the summary.
   - Value type : Double
5. **Number of Sentences**: Determines how many sentences will the output contain. If ratio is provided, then this parameter will be ignored.
   - Value type : Integer
6. **New Column Name**: New column name
   - Value type : String
   - Default : summarized_document

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String
2. **result_type**: Output type of summarization.
   - Available items
      - summarized_document
      - sentence (default)
3. **hold_cols**: Column to select as hold.
4. **ratio**: Number between 0 and 1 that determines the proportion of the number of sentences of the original text to be chosen for the summary.
   - Value type : Double
5. **num_sentence**: Determines how many sentences will the output contain. If ratio is provided, then this parameter will be ignored.
   - Value type : Integer
6. **new_col_name**: New column name
   - Value type : String
   - Default : summarized_document

#### Outputs: table

