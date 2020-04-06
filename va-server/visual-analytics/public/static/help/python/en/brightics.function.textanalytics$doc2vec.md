## Format
### Python
```python
from brightics.function.textanalytics import doc2vec
res = doc2vec(table = ,input_col = ,dm = ,vector_size = ,window = ,min_count = ,alpha = ,min_alpha = ,seed = ,train_epoch = ,workers = ,hs = ,negative = ,ns_exponent = )
res['doc_table']
res['word_table']
res['model']
```

## Description
"Doc2Vec is an extension of word2vec to construct embeddings from entire documents (rather than the individual words)."

Reference:
+ <https://en.wikipedia.org/wiki/Word2vec>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **Training Algorithm**: Training algorithm: PV-DM, PV-DBOW.
   - Available items
      - PV-DM (default)
      - PV-DBOW
3. **Dimension of Vectors**: Dimensionality of the feature vectors.
   - Value type : Integer
   - Default : 100
4. **Window Size**: Maximum distance between the current and predicted word within a sentence.
   - Value type : Integer
   - Default : 5 (value >= 1)
5. **Minimum count**: Ignores all words with total frequency lower than this.
   - Value type : Integer
   - Default : 1
6. **Alpha**: The initial learning rate.
   - Value type : Double
   - Default : 0.025
7. **Minimum alpha**: Learning rate will linearly drop to min_alpha as training progresses.
   - Value type : Double
   - Default : 0.025
8. **Seed**: Seed for the random number generator. Initial vectors for each word are seeded with a hash of the concatenation of word + str(seed). Note that hash randomization that breaks reproducibility is used by default.
   - Value type : Integer
9. **Train epoch**: Number of iterations (epochs) over the corpus.
   - Value type : Integer
   - Default : 100
10. **Number of workers**: Use these many worker threads to train the model (=faster training with multicore machines).
    - Value type : Integer
    - Default : 1 (value >= 1)
11. **Hierarchical softmax**: If it is True, hierarchical softmax will be used for model training. If it is False, and Negative is non-zero, negative sampling will be used.
12. **Negative**: If Negative > 0, negative sampling will be used, the int for negative specifies how many noise words should be drawn (usually between 5-20).
    - Value type : Integer
    - Default : 5
13. **Negative sampling exponent**: The exponent used to shape the negative sampling distribution. A value of 1.0 samples exactly in proportion to the frequencies, 0.0 samples all words equally, while a negative value samples low-frequency words more than high-frequency words. The popular default value of 0.75 was chosen by the original Word2Vec paper.
    - Value type : Integer
    - Default : 0.75

#### Outputs: table, table, model

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String[]
2. **dm**: Training algorithm: PV-DM, PV-DBOW.
   - Available items
      - 1 (default)
      - 0
3. **vector_size**: Dimensionality of the feature vectors.
   - Value type : Integer
   - Default : 100
4. **window**: Maximum distance between the current and predicted word within a sentence.
   - Value type : Integer
   - Default : 5 (value >= 1)
5. **min_count**: Ignores all words with total frequency lower than this.
   - Value type : Integer
   - Default : 1
6. **alpha**: The initial learning rate.
   - Value type : Double
   - Default : 0.025
7. **min_alpha**: Learning rate will linearly drop to min_alpha as training progresses.
   - Value type : Double
   - Default : 0.025
8. **seed**: Seed for the random number generator. Initial vectors for each word are seeded with a hash of the concatenation of word + str(seed). Note that hash randomization that breaks reproducibility is used by default.
   - Value type : Integer
9. **train_epoch**: Number of iterations (epochs) over the corpus.
   - Value type : Integer
   - Default : 100
10. **workers**: Use these many worker threads to train the model (=faster training with multicore machines).
    - Value type : Integer
    - Default : 1 (value >= 1)
11. **hs**: If it is True, hierarchical softmax will be used for model training. If it is False, and Negative is non-zero, negative sampling will be used.
12. **negative**: If Negative > 0, negative sampling will be used, the int for negative specifies how many noise words should be drawn (usually between 5-20).
    - Value type : Integer
    - Default : 5
13. **ns_exponent**: The exponent used to shape the negative sampling distribution. A value of 1.0 samples exactly in proportion to the frequencies, 0.0 samples all words equally, while a negative value samples low-frequency words more than high-frequency words. The popular default value of 0.75 was chosen by the original Word2Vec paper.
    - Value type : Integer
    - Default : 0.75

#### Outputs: table, table, model

