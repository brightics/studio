## Format
### Python
```python
from brightics.function.clustering import hierarchical_clustering
res = hierarchical_clustering(table = ,input_cols = ,input_mode = ,key_col = ,link = ,met = ,num_rows = ,figure_height = ,orient = ,group_by = )
res['model']
```

## Description
This  function calculates hierarchical clustering using bottom-up way. In the beginning, each point is clustered in all different cluster, and agglomerative clustering is executed in the bottom-up design. Output table contains cluster information joined at each iteration, height and the number of original observations in the newly formed cluster. There are several linkage criteria supported such as single, complete, average, weighted, centroid, median, and ward. 

Reference:
+ <https://en.wikipedia.org/wiki/Hierarchical_clustering>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Input Columns**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **Input Mode**:  'Matrix' or 'Original'. If it is 'Original', we consider input as original numeric values. If it is 'Matrix', we consider input as a distance square matrix and ignore values in the diagonal.
   - Available items
      - Matrix
      - Original (default)
3. **Key Column**: Column names to be used as ID. Zero or one column name must be chosen. If it is empty, 'pt_(row index)' will be used as ID if 'input-mode' is 'Original'. If it is empty, column names in 'columns' will be used as ID if 'input-mode' is 'Matrix'. If 'input-mode' is 'Matrix', column names in 'columns' must match values in 'Key Column'.
4. **Linkage Method**: Linkage method name to be used in Hierarchical Clustering. It must be one of 'Single', 'Complete', 'Average', 'Weighted', 'Centroid', 'Median', 'Ward'. (default = 'Complete')
5. **Metric**: The distance metric to use in the case that input is a collection of observation vectors; ignored otherwise. (default = 'Euclidean')
6. **Number of Rows of Linkage Matrix**: Number of rows of linkage matrix.
   - Value type : Integer
   - Default : 20 (value > 0)
7. **Figure Height**: Height of figure.
   - Value type : Double
   - Default : 6.4 (value > 0.0)
8. **Figure Orientation**: The direction to plot the dendrogram:
if 'top', plots the root at the top, and plot descendent links going downwards.
if 'right', plots the root at the right, and plot descendent links going left.
   - Available items
      - Right (default)
      - Top
9. **Group By**: Columns to group by

#### Outputs: model

### Python
#### Inputs: table

#### Parameters
1. **input_cols**<b style="color:red">*</b>: Columns to select as input
   - Allowed column type : Integer, Long, Float, Double, Double[]
2. **input_mode**:  'Matrix' or 'Original'. If it is 'Original', we consider input as original numeric values. If it is 'Matrix', we consider input as a distance square matrix and ignore values in the diagonal.
   - Available items
      - matrix
      - original (default)
3. **key_col**: Column names to be used as ID. Zero or one column name must be chosen. If it is empty, 'pt_(row index)' will be used as ID if 'input-mode' is 'Original'. If it is empty, column names in 'columns' will be used as ID if 'input-mode' is 'Matrix'. If 'input-mode' is 'Matrix', column names in 'columns' must match values in 'Key Column'.
4. **link**: Linkage method name to be used in Hierarchical Clustering. It must be one of 'Single', 'Complete', 'Average', 'Weighted', 'Centroid', 'Median', 'Ward'. (default = 'Complete')
5. **met**: The distance metric to use in the case that input is a collection of observation vectors; ignored otherwise. (default = 'Euclidean')
6. **num_rows**: Number of rows of linkage matrix.
   - Value type : Integer
   - Default : 20 (value > 0)
7. **figure_height**: Height of figure.
   - Value type : Double
   - Default : 6.4 (value > 0.0)
8. **orient**: The direction to plot the dendrogram:
if 'top', plots the root at the top, and plot descendent links going downwards.
if 'right', plots the root at the right, and plot descendent links going left.
   - Available items
      - right (default)
      - top
9. **group_by**: Columns to group by

#### Outputs: model

