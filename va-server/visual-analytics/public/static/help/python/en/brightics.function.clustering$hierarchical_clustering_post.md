## Format
### Python
```python
from brightics.function.clustering import hierarchical_clustering_post
res = hierarchical_clustering_post(model = ,num_clusters = ,cluster_col = )
res['out_table']
res['model']
```

## Description
This function gets the number of clusters from a user and gives label using the result of hierarchical clustering.

Input table must be the output of hierarchical clustering. 

Reference:
+ <https://en.wikipedia.org/wiki/Hierarchical_clustering>

---

## Properties
### VA
#### Inputs: model

#### Parameters
1. **Maximum Number of Clusters**<b style="color:red">*</b>: Maximum number of clusters requested for clustering.
   - Value type : Integer
   - Default : (value >= 1)
2. **New Column Name**: Name of cluster column.
   - Value type : String
   - Default : cluster

#### Outputs: table, model

### Python
#### Inputs: model

#### Parameters
1. **num_clusters**<b style="color:red">*</b>: Maximum number of clusters requested for clustering.
   - Value type : Integer
   - Default : (value >= 1)
2. **cluster_col**: Name of cluster column.
   - Value type : String
   - Default : cluster

#### Outputs: table, model

