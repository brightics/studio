## Format
### Python
```python
from brightics.function.classification import naive_bayes_train
res = naive_bayes_train(feature_cols = ,label_col = ,alpha = ,fit_prior = ,group_by = )
res['model']
```

## Description
NaiveBayes classifiers are a family of simple probabilistic classifiers based on applying Bayes' theorem with strong(naive) independence assumptions between the features.

* Only Multinomial Naive Bayes is allowed now.

Reference :

https://en.wikipedia.org/wiki/Naive_Bayes_classifier

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Feature Columns**<b style="color:red">*</b>: Feature column names for NaiveBayes Model. Feature values represent the frequencies with certain events, which means the values should be of double, integer or long types and nonnegative.
   - Allowed column type : Integer, Long, Float, Double
2. **Label Column**<b style="color:red">*</b>: Label column names. It should be float, double, integer, long or string types.
   - Allowed column type : Integer, Long, Double, String, Float
3. **Lambda**: Smoothing parameter (default = 1.0)
   - Value type : Double
   - Default : 1.0 (0 < value)
4. **Fit Class Prior Probabilities**: Whether to learn class prior probabilities or not. If false, a uniform prior will be used.
5. **Group By**: Columns to group by

#### Outputs
1. **model**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **feature_cols**<b style="color:red">*</b>: Feature column names for NaiveBayes Model. Feature values represent the frequencies with certain events, which means the values should be of double, integer or long types and nonnegative.
   - Allowed column type : Integer, Long, Float, Double
2. **label_col**<b style="color:red">*</b>: Label column names. It should be float, double, integer, long or string types.
   - Allowed column type : Integer, Long, Double, String, Float
3. **alpha**: Smoothing parameter (default = 1.0)
   - Value type : Double
   - Default : 1.0 (0 < value)
4. **fit_prior**: Whether to learn class prior probabilities or not. If false, a uniform prior will be used.
5. **group_by**: Columns to group by

#### Outputs
1. **model**: model

