## Format
### Python
```python
from brightics.function.textanalytics import tokenizer_kor
res = tokenizer_kor(table = ,input_cols = ,hold_cols = ,new_col_prefix = ,normalization = ,stemming = ,pos_extraction = ,is_tagged = )
res['out_table']
```

## Description
A tokenizer receives a stream of characters, breaks it up into individual tokens (usually individual words), and outputs a stream of tokens.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **Hold Columns**: Column to select as hold.
3. **New Column Prefix**: Name of the new column to be added.
   - Value type : String
   - Default : tokenized
4. **Normalization**: The process of canonicalizing tokens so that matches occur despite superficial differences in the character sequences of the tokens.
5. **Stemming**: The process of reducing inflected words to their word stem, base or root form.
6. **Extraction**: 
   - Available items
      - Noun (default)
      - Verb
      - Adjective
      - Adverb
      - Determiner
      - Exclamation
      - Josa
      - Eomi
      - PreEomi
      - Conjunction
      - Modifier
      - VerbPrefix
      - Suffix
      - Unknown
      - Korean
      - Foreign
      - Number
      - KoreanParticle
      - Alpha
      - Punctuation
      - Hashtag
      - ScreenName
      - Email
      - URL
      - CashTag
      - Space
      - Others
7. **Power of Speech Tagging**: If True, shows a POS with tokenized word.

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : String
2. **hold_cols**: Column to select as hold.
3. **new_col_prefix**: Name of the new column to be added.
   - Value type : String
   - Default : tokenized
4. **normalization**: The process of canonicalizing tokens so that matches occur despite superficial differences in the character sequences of the tokens.
5. **stemming**: The process of reducing inflected words to their word stem, base or root form.
6. **pos_extraction**: 
   - Available items
      - Noun (default)
      - Verb
      - Adjective
      - Adverb
      - Determiner
      - Exclamation
      - Josa
      - Eomi
      - PreEomi
      - Conjunction
      - Modifier
      - VerbPrefix
      - Suffix
      - Unknown
      - Korean
      - Foreign
      - Number
      - KoreanParticle
      - Alpha
      - Punctuation
      - Hashtag
      - ScreenName
      - Email
      - URL
      - CashTag
      - Space
      - Others
7. **is_tagged**: If True, shows a POS with tokenized word.

#### Outputs: table

