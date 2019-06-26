## Format
### Python
```python
from brightics.function.evaluation import plot_roc_pr_curve
res = plot_roc_pr_curve(label_col = ,probability_col = ,pos_label = ,fig_w = ,fig_h = ,group_by = )
res['result']
```

## Description
Plot ROC Curve and PR Curve.

---

## Properties
### VA
#### Inputs
1. **table**: table

#### Parameters
1. **Label Column**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
2. **Probability Column**<b style="color:red">*</b>: Probability column.
   - Allowed column type : Integer, Long, Float, Double
3. **Positive Label**: Label considered as positive and others are considered negative.
   - Value type : String
4. **Figure Width**: Figure Width.
   - Value type : Double
   - Default : 6.4
5. **Figure Height**: Figure Height.
   - Value type : Double
   - Default : 4.8
6. **Group By**: Columns to group by

#### Outputs
1. **result**: model

### Python
#### Inputs
1. **table**: table

#### Parameters
1. **label_col**<b style="color:red">*</b>: Label column.
   - Allowed column type : Integer, Long, Float, Double, String, Boolean
2. **probability_col**<b style="color:red">*</b>: Probability column.
   - Allowed column type : Integer, Long, Float, Double
3. **pos_label**: Label considered as positive and others are considered negative.
   - Value type : String
4. **fig_w**: Figure Width.
   - Value type : Double
   - Default : 6.4
5. **fig_h**: Figure Height.
   - Value type : Double
   - Default : 4.8
6. **group_by**: Columns to group by

#### Outputs
1. **result**: model

