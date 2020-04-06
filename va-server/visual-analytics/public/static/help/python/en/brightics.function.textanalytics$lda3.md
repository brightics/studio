## Format
### Python
```python
from brightics.function.textanalytics import lda3
res = lda3(table = ,input_col = ,topic_name = ,num_voca = ,num_topic = ,num_topic_word = ,max_iter = ,learning_method = ,learning_offset = ,random_state = ,group_by = )
res['out_table']
```

## Description
This function builds a topic model for text documents. The generated model is then used for classifying the documents based on topics automatically chosen by the model. To choose topics, this function adapts Gibbs sampling.

When we have a dataset (text documents) to analyze, we need to do pre-process for the dataset. In general, we split texts into terms (words), build a vocabulary that only consider the top max_features ordered by term frequency across the corpus, and then remove (1)  terms that have a document frequency strictly higher than 0.95 (2) terms that have a document frequency strictly lower than counts 2 (3) a built-in stop word list for English is used.  

This pre-process should be performed carefully to get better results. This function performs this pre-process with default setting we mentioned above.

Also, choosing the number of topics based on the dataset is very important. It could be possible for you to choose either randomly till you can get your desired results or thoroughly based on knowledge of the given text. Increasing number of iterations for running LDA model would give you stable results.

Reference:
+ <https://en.wikipedia.org/wiki/Latent_Dirichlet_allocation>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Column**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String, String[]
2. **Topic Column Name**: Topic name for prediction
   - Value type : String
   - Default : topic
3. **Number of Vocabularies**: The number of vocabularies that will be utilized to count their frequencies in the entire documents. It should be greater than or equal to two.
   - Value type : Integer
   - Default : 1000 (value >= 2)
4. **Number of Topics**: The number of topics that will be contained in the entire documents. It should be greater than or equal to two.
   - Value type : Integer
   - Default : 3 (value >= 2)
5. **Number of Terminologies**: Maximum number of terminologies you want to show for particular topics. It should be greater than or equal to two. Terminology number should be less than or equal to vocabulary size also.
   - Value type : Integer
   - Default : 3 (value >= 2)
6. **Iterations**: Maximum number of iterations you want to run your model. It should be at least one.
   - Value type : Integer
   - Default : 20 (value >= 1)
7. **Learning Method**: Method used to update variational parameters for topic word distribution. Choose 'Online' or 'Batch'.
- 'Online': Online variational Bayes method. In each EM update, use mini-batch of training data to update the variational parameters for topic word distribution variable incrementally. The learning rate is controlled the 'Learning Offset' parameters.
- 'Batch': Batch variational Bayes method. Use all training data in each EM update. Old variational parameters for topic word distribution will be overwritten in each iteration.
   - Available items
      - Online (default)
      - Batch
8. **Learning Offset**: A (positive) parameter that downweights early iterations in online learning. It should be greater than 1.0.
   - Value type : Double
   - Default : 10.0 (value > 1.0)
9. **Seed**: The seed used by the random number generator.
   - Value type : Integer
10. **Group By**: Columns to group by

#### Outputs: table

### Python
#### Inputs: table

#### Parameters
1. **input_col**<b style="color:red">*</b>: Column to select as input
   - Allowed column type : String, String[]
2. **topic_name**: Topic name for prediction
   - Value type : String
   - Default : topic
3. **num_voca**: The number of vocabularies that will be utilized to count their frequencies in the entire documents. It should be greater than or equal to two.
   - Value type : Integer
   - Default : 1000 (value >= 2)
4. **num_topic**: The number of topics that will be contained in the entire documents. It should be greater than or equal to two.
   - Value type : Integer
   - Default : 3 (value >= 2)
5. **num_topic_word**: Maximum number of terminologies you want to show for particular topics. It should be greater than or equal to two. Terminology number should be less than or equal to vocabulary size also.
   - Value type : Integer
   - Default : 3 (value >= 2)
6. **max_iter**: Maximum number of iterations you want to run your model. It should be at least one.
   - Value type : Integer
   - Default : 20 (value >= 1)
7. **learning_method**: Method used to update variational parameters for topic word distribution. Choose 'Online' or 'Batch'.
- 'Online': Online variational Bayes method. In each EM update, use mini-batch of training data to update the variational parameters for topic word distribution variable incrementally. The learning rate is controlled the 'Learning Offset' parameters.
- 'Batch': Batch variational Bayes method. Use all training data in each EM update. Old variational parameters for topic word distribution will be overwritten in each iteration.
   - Available items
      - online (default)
      - batch
8. **learning_offset**: A (positive) parameter that downweights early iterations in online learning. It should be greater than 1.0.
   - Value type : Double
   - Default : 10.0 (value > 1.0)
9. **random_state**: The seed used by the random number generator.
   - Value type : Integer
10. **group_by**: Columns to group by

#### Outputs: table

