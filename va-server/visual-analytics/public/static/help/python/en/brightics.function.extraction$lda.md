## Format
### Python
```python
from brightics.function.extraction import lda
res = lda(table = ,feature_cols = ,label_col = ,solver = ,store_covariance = ,tol = ,n_components = ,shrinkage = ,shrinkage_value = ,new_column_name = ,group_by = )
res['out_table']
res['model']
```

## Description
Linear Discriminant Analysis (LDA), Normal Discriminant Analysis (NDA), or Discriminant Function Analysis is generalization of Fisher's linear discriminant, a method used in statistics and machine learning to find a linear combination of features that characterizes or separates two or more classes of objects or events. The resulting combination may be used as a linear classifier, or for dimensionality reduction before classification.

Reference:
+ <https://en.wikipedia.org/wiki/Linear_discriminant_analysis>

---

## Properties
### VA
#### Inputs: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Double, Float, Integer, Long
2. **Label Column**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **Solver**: Solver to use
4. **Store Covariance**: 
   - Available items
      - True
      - False (default)
5. **Tolerance**: 
   - Value type : Double
   - Default : 0.0001 (value >= 0)
6. **Number of components**: Number of components (< n_classes - 1) for dimensionality reduction
   - Value type : Integer
   - Default : 1 (value >= 1)
7. **Shrinkage**: Shrinkage works only with eigen solver.
8. **Shrinkage value**: Value for float Shrinkage
   - Value type : Double
   - Default : (1 >= value >= 0)
9. **New Column Name**: Name of new column(s)
   - Value type : String
   - Default : projected_
10. **Group By**: Columns to group by

#### Outputs: table, model

### Python
#### Inputs: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Columns to select as features
   - Allowed column type : Double, Float, Integer, Long
2. **label_col**<b style="color:red">*</b>: Columns to select as label
   - Allowed column type : Integer, Long, Float, Double, String
3. **solver**: Solver to use
4. **store_covariance**: 
   - Available items
      - True
      - False (default)
5. **tol**: 
   - Value type : Double
   - Default : 0.0001 (value >= 0)
6. **n_components**: Number of components (< n_classes - 1) for dimensionality reduction
   - Value type : Integer
   - Default : 1 (value >= 1)
7. **shrinkage**: Shrinkage works only with eigen solver.
8. **shrinkage_value**: Value for float Shrinkage
   - Value type : Double
   - Default : (1 >= value >= 0)
9. **new_column_name**: Name of new column(s)
   - Value type : String
   - Default : projected_
10. **group_by**: Columns to group by

#### Outputs: table, model

