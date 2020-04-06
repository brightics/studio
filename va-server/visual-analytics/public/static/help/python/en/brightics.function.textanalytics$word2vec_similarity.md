## Format
### Python
```python
from brightics.function.textanalytics import word2vec_similarity
res = word2vec_similarity(model = ,positive = ,negative = ,topn = )
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
#### Inputs: model

#### Parameters
1. **Positive**: List of words that contribute positively.
2. **Negative**: List of words that contribute negatively.
3. **Top N similar words**: Number of top-N similar words to return.
   - Value type : Integer
   - Default : 1 (value >= 1)

#### Outputs: table

### Python
#### Inputs: model

#### Parameters
1. **positive**: List of words that contribute positively.
2. **negative**: List of words that contribute negatively.
3. **topn**: Number of top-N similar words to return.
   - Value type : Integer
   - Default : 1 (value >= 1)

#### Outputs: table

