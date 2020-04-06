## Format
### Python
```python
from brightics.function.textanalytics import word2vec_similarity2
res = word2vec_similarity2(table = ,model = ,positive_col = ,negative_col = ,topn = )
res['out_table']
```

## Description
"Word2Vec Similarity finds the top-N most similar words. Positive words contribute positively towards the similarity, negative words negatively.
 This method computes cosine similarity between a simple mean of the projection weight vectors of the given words and the vectors for each word in the model. The method corresponds to the word-analogy and distance scripts in the original word2vec implementation." 

 Reference:
+<https://radimrehurek.com/gensim/models/keyedvectors.html#gensim.models.keyedvectors.WordEmbeddingsKeyedVectors.most_similar>

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Positive Column**: List of words that contribute positively.
   - Allowed column type : String
2. **Negative Column**: List of words that contribute negatively.
   - Allowed column type : String
3. **Top N similar words**: Number of top-N similar words to return.
   - Value type : Integer
   - Default : 1 (value >= 1)

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **positive_col**: List of words that contribute positively.
   - Allowed column type : String
2. **negative_col**: List of words that contribute negatively.
   - Allowed column type : String
3. **topn**: Number of top-N similar words to return.
   - Value type : Integer
   - Default : 1 (value >= 1)

#### Outputs: table

