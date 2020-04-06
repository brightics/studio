## Format
### Python
```python
from brightics.function.clustering import mean_shift
res = mean_shift(table = ,input_cols = ,prediction_col = ,bandwidth = ,bin_seeding = ,min_bin_freq = ,cluster_all = ,group_by = )
res['out_table']
res['model']
```

## Description
Mean shift clustering aims to discover “blobs” in a smooth density of samples. It is a centroid-based algorithm, which works by updating candidates for centroids to be the mean of the points within a given region. These candidates are then filtered in a post-processing stage to eliminate near-duplicates to form the final set of centroids.

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
3. **Bandwidth**: Bandwidth used in the RBF kernel
   - Value type : Double
   - Default : (value > 0)
4. **Bin Seeding**: If true, initial kernel locations are the location of the discretized version of points (by binding points into grid), therefore algorithm will be speeded up
5. **Minimum Bin Frequency**: To speed up the algorithm, accept only those bins with at least minimum bin frequency points as seed
   - Value type : Integer
   - Default : 1 (value >= 1)
6. **Cluster All**: If true, then all points are clustered, even those orphans that are not within any kernel. Orphans are assigned to the nearest kernel. If false, then orphans are given cluster label -1.
7. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Double, Float, Double[]
2. **prediction_col**: Column name for prediction
   - Value type : String
   - Default : prediction
3. **bandwidth**: Bandwidth used in the RBF kernel
   - Value type : Double
   - Default : (value > 0)
4. **bin_seeding**: If true, initial kernel locations are the location of the discretized version of points (by binding points into grid), therefore algorithm will be speeded up
5. **min_bin_freq**: To speed up the algorithm, accept only those bins with at least minimum bin frequency points as seed
   - Value type : Integer
   - Default : 1 (value >= 1)
6. **cluster_all**: If true, then all points are clustered, even those orphans that are not within any kernel. Orphans are assigned to the nearest kernel. If false, then orphans are given cluster label -1.
7. **group_by**: Columns to group by

#### Outputs: table, model

