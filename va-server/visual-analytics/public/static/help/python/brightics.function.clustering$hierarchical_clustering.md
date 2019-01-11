## Format
### Python
```python
from brightics.function.clustering import hierarchical_clustering
res = hierarchical_clustering(input_cols = ,link = ,met = ,num_rows = ,figure_height = ,orient = ,group_by = )
res['model']
```

## Description
This  function calculates hierarchical clustering using bottom-up way. In the beginning, each point is clustered in all different cluster, and agglomerative clustering is executed in the bottom-up design. Output table contains cluster information joined at each iteration, height and the number of original observations in the newly formed cluster. There are several linkage criteria supported such as complete, single, and Ward.

Reference:

https://en.wikipedia.org/wiki/Hierarchical_clustering

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: column names of double type. At least one column must be chosen.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Linkage Method**: linkage method name to be used in Hierarchical Clustering. It must be one of 'Single', 'Complete', 'Average', 'Weighted', 'Centroid', 'Median', 'Ward'. (default = 'Complete')
3. **Metric**: The distance metric to use in the case that input is a collection of observation vectors; ignored otherwise. (default='euclidean')
4. **Number of Rows of Linkage Matrix**: number of rows of linkage matrix (default=20)
   - Value type : Integer
   - Default : 20
5. **Figure Height**: height of figure (default=6.4)
   - Value type : Double
   - Default : 6.4
6. **Figure Orientation**: The direction to plot the dendrogram:
if 'top', plots the root at the top, and plot descendent links going downwards.
if 'right', plots the root at the right, and plot descendent links going left. (default)
   - Available items
      - Right (default)
      - Top
7. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: column names of double type. At least one column must be chosen.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **link**: linkage method name to be used in Hierarchical Clustering. It must be one of 'Single', 'Complete', 'Average', 'Weighted', 'Centroid', 'Median', 'Ward'. (default = 'Complete')
3. **met**: The distance metric to use in the case that input is a collection of observation vectors; ignored otherwise. (default='euclidean')
4. **num_rows**: number of rows of linkage matrix (default=20)
   - Value type : Integer
   - Default : 20
5. **figure_height**: height of figure (default=6.4)
   - Value type : Double
   - Default : 6.4
6. **orient**: The direction to plot the dendrogram:
if 'top', plots the root at the top, and plot descendent links going downwards.
if 'right', plots the root at the right, and plot descendent links going left. (default)
   - Available items
      - right (default)
      - top
7. **group_by**: Columns to group by

#### Outputs
1. **model**: model

