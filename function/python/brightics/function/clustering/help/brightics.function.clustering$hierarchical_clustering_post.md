## Format
### Python
```python
from brightics.function.clustering import hierarchical_clustering_post
res = hierarchical_clustering_post(num_clusters = ,cluster_col = )
res['out_table']
res['model']
```

## Description
This function gets the number of clusters from a user and gives label using the result of hierarchical clustering.

Input table must be the output of hierarchical clustering.

Reference:

https://en.wikipedia.org/wiki/Hierarchical_clustering

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **Number of Clusters**<b style="color:red">*</b>: Number of clusters for clustering. (positive, default = 2)
   - Value type : Integer
2. **New Column Name**: name of cluster column
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table
2. **model**: model

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **num_clusters**<b style="color:red">*</b>: Number of clusters for clustering. (positive, default = 2)
   - Value type : Integer
2. **cluster_col**: name of cluster column
   - Value type : String
   - Default : prediction

#### Outputs
1. **out_table**: table
2. **model**: model

