## Format
### Python
```python
from brightics.function.clustering import clustering_predict
res = clustering_predict(model = ,num_clusters = ,cluster_col = )
res['out_table']
res['model']
```

## Description
This function is the general post process for clustering.

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

