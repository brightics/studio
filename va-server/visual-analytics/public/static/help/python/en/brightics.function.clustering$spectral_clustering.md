## Format
### Python
```python
from brightics.function.clustering import spectral_clustering
res = spectral_clustering(table = ,input_cols = ,prediction_col = ,n_clusters = ,eigen_solver = ,random_state = ,n_init = ,gamma = ,affinity = ,n_neighbors = ,eigen_tol = ,assign_labels = ,degree = ,coef0 = ,group_by = )
res['out_table']
res['model']
```

## Description
In multivariate statistics and the clustering of data, spectral clustering techniques make use of the spectrum (eigenvalues) of the similarity matrix of the data to perform dimensionality reduction before clustering in fewer dimensions. The similarity matrix is provided as an input and consists of a quantitative assessment of the relative similarity of each pair of points in the dataset.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction
3. **N Clusters**: The dimension of the projection subspace
   - Value type : Integer
   - Default : 8 (value >= 1)
4. **Eigen Solver**: The eigenvalue decomposition strategy to use
   - Available items
      - None (default)
      - arpack
      - lobpcg
5. **Seed**: The seed used by the random number generator
   - Value type : Integer
6. **N Init**: Number of time the k-means algorithm will be run with different centroid seeds. The final results will be the best output of n_init consecutive runs in terms of inertia.
   - Value type : Integer
   - Default : 10 (value >= 1)
7. **Gamma**: Kernel coefficient for rbf, poly, sigmoid, laplacian and chi2 kernels
   - Value type : Double
   - Default : 1.0
8. **Affinity**: If a string, this may be one of ‘nearest_neighbors’, ‘precomputed’, ‘rbf’ or one of the kernels supported by sklearn.metrics.pairwise_kernels
   - Available items
      - nearest_neighbors
      - precomputed
      - rbf (default)
      - amg
      - poly
      - sigmoid
      - polynomial
      - laplacian
      - chi2
9. **N Neighbors**: Number of neighbors to use when constructing the affinity matrix using the nearest neighbors method
   - Value type : Integer
   - Default : 10 (value >= 1)
10. **Eigen Tolerance**: Stopping criterion for eigendecomposition of the Laplacian matrix when eigen_solver='arpack'
    - Value type : Double
    - Default : 0.0
11. **Assign Labels**: The strategy to use to assign labels in the embedding space
    - Available items
       - kmeans (default)
       - discretize
12. **Degree**: Degree of the polynomial kernel
    - Value type : Double
    - Default : 3
13. **Zero Coefficient**: Zero coefficient for polynomial and sigmoid kernels
    - Value type : Double
    - Default : 1
14. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
3. **n_clusters**: The dimension of the projection subspace
   - Value type : Integer
   - Default : 8 (value >= 1)
4. **eigen_solver**: The eigenvalue decomposition strategy to use
   - Available items
      - None (default)
      - arpack
      - lobpcg
5. **random_state**: The seed used by the random number generator
   - Value type : Integer
6. **n_init**: Number of time the k-means algorithm will be run with different centroid seeds. The final results will be the best output of n_init consecutive runs in terms of inertia.
   - Value type : Integer
   - Default : 10 (value >= 1)
7. **gamma**: Kernel coefficient for rbf, poly, sigmoid, laplacian and chi2 kernels
   - Value type : Double
   - Default : 1.0
8. **affinity**: If a string, this may be one of ‘nearest_neighbors’, ‘precomputed’, ‘rbf’ or one of the kernels supported by sklearn.metrics.pairwise_kernels
   - Available items
      - nearest_neighbors
      - precomputed
      - rbf (default)
      - amg
      - poly
      - sigmoid
      - polynomial
      - laplacian
      - chi2
9. **n_neighbors**: Number of neighbors to use when constructing the affinity matrix using the nearest neighbors method
   - Value type : Integer
   - Default : 10 (value >= 1)
10. **eigen_tol**: Stopping criterion for eigendecomposition of the Laplacian matrix when eigen_solver='arpack'
    - Value type : Double
    - Default : 0.0
11. **assign_labels**: The strategy to use to assign labels in the embedding space
    - Available items
       - kmeans (default)
       - discretize
12. **degree**: Degree of the polynomial kernel
    - Value type : Double
    - Default : 3
13. **coef0**: Zero coefficient for polynomial and sigmoid kernels
    - Value type : Double
    - Default : 1
14. **group_by**: Columns to group by

#### Outputs: table, model

