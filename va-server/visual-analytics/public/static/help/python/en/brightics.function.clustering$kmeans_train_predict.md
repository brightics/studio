## Format
### Python
```python
from brightics.function.clustering import kmeans_train_predict
res = kmeans_train_predict(table = ,input_cols = ,n_clusters = ,prediction_col = ,init = ,n_init = ,max_iter = ,tol = ,precompute_distances = ,seed = ,n_jobs = ,algorithm = ,n_samples = ,group_by = )
res['out_table']
res['model']
```

## Description
"k-means clustering is a method of vector quantization, originally from signal processing, that is popular for cluster analysis in data mining. k-means clustering aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean, serving as a prototype of the cluster. This results in a partitioning of the data space into Voronoi cells." 

Reference:
+ <https://en.wikipedia.org/wiki/K-means_clustering>

This function fits and predicts using sklearn.cluster.KMeans model.

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Number of Clusters**: The number of clusters to form as well as the number of centroids to generate.
   - Value type : Integer
   - Default : 3 (value >= 1)
3. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction
4. **Method for initialization**: Method for initialization.
   - Available items
      - k-means++ (default)
      - random
5. **Number of Different Initial Points**: Number of time the k-means algorithm will be run with different centroid seeds.
   - Value type : Integer
   - Default : 10 (value >= 1)
6. **Maximum Number of Iterations**: Maximum number of iterations of the k-means algorithm for a single run.
   - Value type : Integer
   - Default : 300 (value >= 1)
7. **Relative Tolerance**: Relative tolerance with regards to inertia to declare convergence.
   - Value type : Double
   - Default : 0.0001
8. **Precompute Distances**: Precompute distances (faster but takes more memory).
9. **Seed**: Random seed.
   - Value type : Integer
10. **Number of Jobs**: The number of jobs to use for the computation. This works by computing each of the n_init runs in parallel.
    - Value type : Integer
    - Default : 1 (value >= 1)
11. **Kmeans Algorithm**: K-means algorithm to use. The classical EM-style algorithm is 'full'. The 'Elkan' variation is more efficient by using the triangle inequality, but currently doesn't support sparse data. 'auto' chooses 'Elkan' for dense data and 'full' for sparse data.
    - Available items
       - auto (default)
       - full
       - elkan
12. **Number of Samples**: Number of samples
    - Value type : Integer
    - Default : (value >= 0)
13. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **n_clusters**: The number of clusters to form as well as the number of centroids to generate.
   - Value type : Integer
   - Default : 3 (value >= 1)
3. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
4. **init**: Method for initialization.
   - Available items
      - k-means++ (default)
      - random
5. **n_init**: Number of time the k-means algorithm will be run with different centroid seeds.
   - Value type : Integer
   - Default : 10 (value >= 1)
6. **max_iter**: Maximum number of iterations of the k-means algorithm for a single run.
   - Value type : Integer
   - Default : 300 (value >= 1)
7. **tol**: Relative tolerance with regards to inertia to declare convergence.
   - Value type : Double
   - Default : 0.0001
8. **precompute_distances**: Precompute distances (faster but takes more memory).
9. **seed**: Random seed.
   - Value type : Integer
10. **n_jobs**: The number of jobs to use for the computation. This works by computing each of the n_init runs in parallel.
    - Value type : Integer
    - Default : 1 (value >= 1)
11. **algorithm**: K-means algorithm to use. The classical EM-style algorithm is 'full'. The 'Elkan' variation is more efficient by using the triangle inequality, but currently doesn't support sparse data. 'auto' chooses 'Elkan' for dense data and 'full' for sparse data.
    - Available items
       - auto (default)
       - full
       - elkan
12. **n_samples**: Number of samples
    - Value type : Integer
    - Default : (value >= 0)
13. **group_by**: Columns to group by

#### Outputs: table, model

