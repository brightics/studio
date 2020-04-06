## Format
### Python
```python
from brightics.function.clustering import agglomerative_clustering
res = agglomerative_clustering(table = ,input_cols = ,prediction_col = ,linkage = ,affinity = ,n_clusters = ,compute_full_tree_auto = ,compute_full_tree = ,group_by = )
res['out_table']
res['model']
```

## Description
The agglomerative clustering is the most common type of hierarchical clustering used to group objects in clusters based on their similarity. It’s also known as AGNES (Agglomerative Nesting). The algorithm starts by treating each object as a singleton cluster. Next, pairs of clusters are successively merged until all clusters have been merged into one big cluster containing all objects. The result is a tree-based representation of the objects, named dendrogram.

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
3. **Linkage**: Which linkage criterion to use
   - Available items
      - ward (default)
      - complete
      - average
      - single
4. **Affinity**: Metric used to compute the linkage (If linkage is “ward”, then “euclidean” will be used)
   - Available items
      - euclidean (default)
      - l1
      - l2
      - manhattan
      - cosine
5. **N Clusters**: The number of clusters to find. It must be None if distance_threshold is not None.
   - Value type : Integer
   - Default : 2 (value >= 1)
6. **Compute Full Tree Auto**: Compute Full Tree Mode
7. **Compute Full Tree**: Stop early the construction of the tree at n_clusters
8. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
3. **linkage**: Which linkage criterion to use
   - Available items
      - ward (default)
      - complete
      - average
      - single
4. **affinity**: Metric used to compute the linkage (If linkage is “ward”, then “euclidean” will be used)
   - Available items
      - euclidean (default)
      - l1
      - l2
      - manhattan
      - cosine
5. **n_clusters**: The number of clusters to find. It must be None if distance_threshold is not None.
   - Value type : Integer
   - Default : 2 (value >= 1)
6. **compute_full_tree_auto**: Compute Full Tree Mode
7. **compute_full_tree**: Stop early the construction of the tree at n_clusters
8. **group_by**: Columns to group by

#### Outputs: table, model

