## Format
### Python
```python
from brightics.function.clustering import gaussian_mixture_predict
res = gaussian_mixture_predict(table = ,model = ,display_probability = ,prediction_col_name = )
res['out_table']
```

## Description
Predict the labels for the data samples using trained model.

---

## Properties
### VA
#### Inputs: table, model

#### Parameters
1. **Display Probability**: Predict posterior probability of each component of given the data.
2. **Prediction Column Name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

### Python
#### Inputs: table, model

#### Parameters
1. **display_probability**: Predict posterior probability of each component of given the data.
2. **prediction_col_name**: Column name for prediction
   - Value type : String
   - Default : prediction

#### Outputs: table

