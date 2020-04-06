## Format
### Python
```python
from brightics.function.clustering import gaussian_mixture_train
res = gaussian_mixture_train(table = ,input_cols = ,number_of_components = ,covariance_type = ,tolerance = ,regularize_covariance = ,max_iteration = ,initial_params = ,seed = ,group_by = )
res['model']
```

## Description
This function provides a composite Gaussian models for given data. A GMM represents a composite distribution of independent Gaussian distributions with associated "mixing" weights specifying each's contribution to the composite.

Reference:
+ <https://en.wikipedia.org/wiki/Mixture_model#Gaussian_mixture_model>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Number of Components**: The number of mixture components.
   - Value type : Integer
   - Default : 1 (value >= 1)
3. **Covariance Type**: String describing the type of covariance parameters to use. Must be one of:

 full : each component has its own general covariance matrix
 tied : all components share the same general covariance matrix
 diagonal : each component has its own diagonal covariance matrix
 spherical : each component has its own single variance
   - Available items
      - Full (default)
      - Tied
      - Diagonal
      - Spherical
4. **Tolerance**: The convergence threshold. EM iterations will stop when the lower bound average gain is below this threshold.
   - Value type : Double
   - Default : 0.001 (value > 0)
5. **Regularization of Covariance**: Non-negative regularization added to the diagonal of covariance. Allows to assure that the covariance matrices are all positive.
   - Value type : Double
   - Default : 0.000001 (value > 0)
6. **Number of Iteration**: The number of EM iterations to perform.
   - Value type : Integer
   - Default : 100 (value >= 1)
7. **Method to Initialize**: The method used to initialize the weights, the means and the precisions. Must be one of:

'kmeans' : responsibilities are initialized using kmeans.
'random' : responsibilities are initialized randomly.
   - Available items
      - K-means (default)
      - Random
8. **Seed**: Random seed
   - Value type : Integer
9. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **number_of_components**: The number of mixture components.
   - Value type : Integer
   - Default : 1 (value >= 1)
3. **covariance_type**: String describing the type of covariance parameters to use. Must be one of:

 full : each component has its own general covariance matrix
 tied : all components share the same general covariance matrix
 diagonal : each component has its own diagonal covariance matrix
 spherical : each component has its own single variance
   - Available items
      - full (default)
      - tied
      - diag
      - spherical
4. **tolerance**: The convergence threshold. EM iterations will stop when the lower bound average gain is below this threshold.
   - Value type : Double
   - Default : 0.001 (value > 0)
5. **regularize_covariance**: Non-negative regularization added to the diagonal of covariance. Allows to assure that the covariance matrices are all positive.
   - Value type : Double
   - Default : 0.000001 (value > 0)
6. **max_iteration**: The number of EM iterations to perform.
   - Value type : Integer
   - Default : 100 (value >= 1)
7. **initial_params**: The method used to initialize the weights, the means and the precisions. Must be one of:

'kmeans' : responsibilities are initialized using kmeans.
'random' : responsibilities are initialized randomly.
   - Available items
      - kmeans (default)
      - random
8. **seed**: Random seed
   - Value type : Integer
9. **group_by**: Columns to group by

#### Outputs: model

