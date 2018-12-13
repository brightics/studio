## Format
### Python
```python
from brightics.function.classification import svm_classification_train
res = svm_classification_train(feature_cols = ,label_col = ,c = ,kernel = ,degree = ,shrinking = ,tol = ,max_iter = ,random_state = ,group_by = )
res['model']
```

## Description
In machine learning, support vector machines (SVMs, also support vector networks) are supervised learning models with associated learning algorithms that analyze data used for classification and regression analysis. Given a set of training examples, each marked as belonging to one or the other of two categories, an SVM training algorithm builds a model that assigns new examples to one category or the other, making it a non-probabilistic binary linear classifier. An SVM model is a representation of the examples as points in space, mapped so that the examples of the separate categories are divided by a clear gap that is as wide as possible. New examples are then mapped into that same space and predicted to belong to a category based on which side of the gap they fall.

https://en.wikipedia.org/wiki/Support_vector_machine

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Column**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Double, Decimal, String, Float
3. **Penalty Term (C)**: Penalty parameter C of the error term.
   - Value type : Double
4. **Kernel**: The kernel type to be used in the SVM algorithm.
   - Available items
      - RBF (default)
      - Linear
      - Polynomial
      - Sigmoid
5. **Degree**: Degree of the polynomial kernel function.
   - Value type : Integer
6. **Shrinking**: Whether to use the shrinking heuristic.
7. **Tolerance**: Tolerance for stopping criterion.
   - Value type : Double
8. **Max Iterations**: Hard limit on iterations within solver, or -1 for no limit.
   - Value type : Integer
9. **Seed**: The seed of the pseudo random number generator used when shuffling the data for probability estimates.
   - Value type : Integer
10. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature columns.
   - Allowed column type : Integer, Long, Float, Double, Decimal
2. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Double, Decimal, String, Float
3. **c**: Penalty parameter C of the error term.
   - Value type : Double
4. **kernel**: The kernel type to be used in the SVM algorithm.
   - Available items
      - rbf (default)
      - linear
      - poly
      - sigmoid
5. **degree**: Degree of the polynomial kernel function.
   - Value type : Integer
6. **shrinking**: Whether to use the shrinking heuristic.
7. **tol**: Tolerance for stopping criterion.
   - Value type : Double
8. **max_iter**: Hard limit on iterations within solver, or -1 for no limit.
   - Value type : Integer
9. **random_state**: The seed of the pseudo random number generator used when shuffling the data for probability estimates.
   - Value type : Integer
10. **group_by**: Columns to group by

#### Outputs
1. **model**: model

