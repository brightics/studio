## Format
### Python
```python
from brightics.function.extraction import label_encoder_model
res = label_encoder_model(new_column_name = )
res['out_table']
```

## Description
This function transforms the features using the result of Label Encoder.

---

## Properties
### VA
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **New Column Name**: New column name
   - Value type : String
   - Default : encoded_column

#### Outputs
1. **out_table**: table

### Python
#### Inputs
1. **table**: table
2. **model**: model

#### Parameters
1. **new_column_name**: New column name
   - Value type : String
   - Default : encoded_column

#### Outputs
1. **out_table**: table

