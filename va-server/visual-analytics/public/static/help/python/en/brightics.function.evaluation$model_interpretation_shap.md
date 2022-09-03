# Model interpretation (SHAP)
This function interprets a regression(or classification) model using SHAP.

## Description
'Model interpretation' explains how models have achieved results so that humans can understand it.
Even if the model has good performance, it is dangerous to trust the model completely.
Because if a model derives the predict from the wrong basis, then it is not possible to get the right answer from new data.
Thus, more careful decision-making is needed in the field dealing with life such as medical care or autonomous driving.
Also, model interpretation is a useful method to find bias of models.

SHAP measures the contribution of each feature to the result based on the Shapley value.
In addition, SHAP is a model-agnostic method and can interpret the model both globally and locally.

Reference
+ <https://christophm.github.io/interpretable-ml-book/shap.html>
+ <https://github.com/slundberg/shap>
+ <https://en.wikipedia.org/wiki/Shapley_value>


## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Training data.
2. **model**<b style="color:red">*</b>: (Model) A regression(or classification) model.
#### OUTPUT
1. **out_model**: (Model) Result of model interpretation
2. **out_table**: (Table) Feature Importance table.
#### PARAMETER

1. **Plot Types**: Choose plots to use

   Available Options:
    * `Bar`: A bar chart that presents feature importance.
    * `Decision`: A broken line graph that shows decision procedure of the model.
    * `Beeswarm`: Distribution of SHAP values. The color of each point depends on the original value of the data.
    * `Scatter`: The change of SHAP values according to the value of each feature. The interaction effects appear in vertical differences of SHAP values. 
    * `Heatmap`: A heatmap of SHAP values. Data are ordered by clustering.
   
2. **Bar Option**: Select options to use the bar plot.(Use only when 'Plot types' has 'Bar'.)

    Available Options: (select one or more)
    * `Global`: Shows the average influence of each feature on the entire data.
    * `Local`: Shows the interpretation result for the input rows.

3. **Bar Data Row**: Enter the indices of the data rows to be interpreted.(Use only when 'Bar Option' has 'Local'.)
 Default:[1].  

4. **Decision Option**:  Select options to use the decision plot.(Use only when 'Plot Types' has 'Decision'.)

   Available Options: (select one or more)
    * `Global`: Shows the entire data.
    * `Local`: Shows the interpretation result for the input rows.

5. **Decision Data Row**: Enter the indices of the data rows to be interpreted.(Use only when 'Decision Option' has 'Local'.)
Default:[1].  

6. **Decision Feature Order**: Criteria for sorting features

    Available Options:
      * `Feature Importance`: Sort by absolute value of SHAP values.
      * `Hierarchical Clustering`: Sort by hierarchical clustering.
      * `None`: Keep original order.

7. **Max Display**: Number of features to display the result.
If the number of features is less than or equal to the Max Display value, all features are displayed.
   * Default: 11

### Python
#### USAGE

```
model_interpretation_shap(table = , model = , sampling = , sample_size = , seed = , plot_types = , bar_global_local = , bar_data_row = , decision_global_local = , decision_data_row = , decision_feature_order = , max_display = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) Training data
2. **model**<b style="color:red">*</b>: (Model) A regression(or classification) model
#### OUTPUT
1. **out_model**: (Model) Result of model interpretation
2. **out_table**: (Table) Feature Importance table.
#### PARAMETER

1. **plot_types**: Choose plots to use
    * Type: *list[str]*
    * Default / Range: Bar, Decision, Beeswarm, Scatter, Heatmap (Bar | Decision | Beeswarm | Scatter | Heatmap)
2. **bar_global_local**: Select options to use the bar plot.
    * Type: *list[str]*
    * Default / Range: global ( global | local )
3. **bar_data_row**: Enter the indices of the data rows to be interpreted.
    * Type: *list[int]*
4. **decision_global_local**: Select options to use the decision plot.
    * Type: *list[str]*
    * Default / Range: global ( global | local )
5. **decision_data_row**: Enter the indices of the data rows to be interpreted.
    * Type: *list[int]*
6. **decision_feature_order**: Criteria for sorting features
    * Type: *str*
    * Default / Range: importance ( importance | hclust | none )
7. **max_display**:  Number of features to display the result.
   * Type: *int*
   * Default / Range: 11


## Example
### VA

**<a href="/static/help/python/sample_model/model_interpretation_shap.json" download>[Sample Model]</a>**

<img src="/static/help/python/sample_model_img/model_interpretation_shap.PNG"  width="800px" style="border: 1px solid gray" >


++Parameters++

1. **Plot Types**</b>: Bar, Decision
2. **Bar Option**: Global, Local
3. **Bar Data Row**: [45, 90]
4. **Decision Option**: Local
5. **Decision Data Row**: [20, 60, 135]
6. **Decision Feature Order**: Feature Importance
7. **Max Display**: 11


### Python

```
from brightics.function.regression import linear_regression_train
from brightics.function.evaluation import model_interpretation_shap

input_table = inputs[0]


lr_result = linear_regression_train(table=input_table,
                                    feature_cols=['sepal_length', 'sepal_width'],
                                    label_col='petal_width',
                                    fit_intercept=True,
                                    is_vif=True,
                                    vif_threshold=10,
                                    group_by=None)

trained_model = lr_result['model']


res = model_interpretation_shap(table = input_table,
                                 model = trained_model,
                                 plot_types = ['Bar', 'Decision'],
                                 bar_global_local = ['Global', 'Local'],
                                 bar_data_row = [45, 90],
                                 decision_global_local = ['Local'],
                                 decision_data_row = [20, 60, 135],
                                 decision_feature_order = 'importance',
                                 max_display = 11)

res['out_model']
```
