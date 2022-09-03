## Format
This function plots Receiver Operating Characteristic(ROC) curve and Precision-Recall(PR) curve.

## Description
It can be more flexible to predict probabilities of an observation belonging to each class in a classification problem rather than predicting classes directly. The reason for this is to provide the capability to choose and even calibrate the threshold for how to interpret the predicted probabilities. For example, a default might be to use a threshold of 0.5, meaning that a probability in [0.0, 4.9] is a negative outcome(0) and a probability in [0.5, 1.0] is a positive outcome(1). This threshold can be adjusted to tune the behavior of the model for a specific problem. An example would be to reduce more of one or another type of error. When making a prediction for a binary or two-class classification problem, there are two types of errors that we could make; False Positive, False Negative. By predicting probabilities and calibrating a threshold, a balance of these two concerns can be chosen by the operator of the model.

A common way to compare models that predict probabilities for binary classification is to use ROC curve. ROC curve is a plot of the false positive rate(x-axis) versus the true positive rate(y-axis) for a number of different candidate threshold values between 0.0 and 1.0. The curves of different models can be compared directly in general or for different thresholds. And the area under the curve(AUC) can be used as a summary of the model skill.

A PR curve is a plot of precision (y-axis) and the recall(x-axis) for different thresholds, much like the ROC curve. Reviewing both precision and recall is useful in cases where there is an imbalance in the observations between the two classes.

Reference
+ <https://en.wikipedia.org/wiki/Receiver_operating_characteristic>
+ <https://en.wikipedia.org/wiki/Precision_and_recall>
+ <https://machinelearningmastery.com/roc-curves-and-precision-recall-curves-for-classification-in-python/>

---

## Properties
### VA
#### INPUT
1. **table**<b style="color:red">*</b>: (Table) A table that contains a label column and a column for probability estimates of the positive class.
#### OUTPUT
1. **model**: (Model) Plot of ROC curve and PR curves.
#### PARAMETER
1. **Label Column**<b style="color:red">*</b>: Name of the column that has true values. If labels are not either {-1, 1} or {0, 1}, then `Positive Label` should be explicitly given.

2. **Probability Column**<b style="color:red">*</b>: Name of the column that has probability estimates of the positive class.

3. **Positive Label**: The label of the positive class. When `Positive Label` is None, if `Label Column` is in {-1, 1} or {0, 1}, `Positive Label` is set to 1, otherwise an error will be raised.

4. **Figure Width**: Width of plot figure.

5. **Figure Height**: Height of plot figure.

6. **Group By**: Column to group by.


### Python
#### USAGE

```
plot_roc_pr_curve(table = , label_col = , probability_col = , pos_label = , fig_w = , fig_h = , group_by = )
```

#### INPUT
1. **table**<b style="color:red">*</b>: (Table) A table that contains a label column and a column for probability estimates of the positive class.
#### OUTPUT
1. **model**: (Model) Plot of ROC curve and PR curves.
#### PARAMETER
1. **label_col**<b style="color:red">*</b>: Name of the column that has true values. If labels are not either {-1, 1} or {0, 1}, then `pos_label` should be explicitly given.
	* Type: *str*
2. **probability_col**<b style="color:red">*</b>: Name of the column that has probability estimates of the positive class.
	* Type: *str*
3. **pos_label**: The label of the positive class. When `pos_label` is None, if `label_col` is in {-1, 1} or {0, 1}, `pos_label` is set to 1, otherwise an error will be raised.
	* Type: *str*
4. **fig_w**: Width of plot figure.
	* Type: *float*
	* Default / Range: 6.4 (value >= 0)
5. **fig_h**: Height of plot figure.
	* Type: *float*
	* Default / Range: 4.8 (value >= 0)
6. **group_by**: Column to group by.
	* Type: *list[str]*

## Example
### VA


**<a href="/static/help/python/sample_model/Plot_ROC_and_PR_Curves.json" download>[Sample Model]</a>**


<img src="/static/help/python/sample_model_img/plot_roc_and_pr_curves.PNG"  width="800px" style="border: 1px solid gray" >

In this tutorial workflow, sample_iris data is splited to train_table and test_table by Split Data function. Then _sepal\_length_ and _sepal\_width_ of the train_table is used to train a SVM Classification model with SVM Classification Train function. With the trained classification model, _species_ is predicted using the test_table by SVM Classification Predict function. Note that choosing `Label` for `Suffix Type` parameter will be helpful since _species_ has three labels in string type. At last, Plot ROC and PR Curves function is used to understand the quality of the trained classification model. The parameter settings used in the function are shown below.


++Parameters++
1. **Label Column**<b style="color:red">*</b>: species
2. **Probability Column**<b style="color:red">*</b>: probability_virginica
3. **Positive Label**: virginica
4. **Figure Width**: None
5. **Figure Height**: None
6. **Group By**: None


### Python

```
from brightics.function.evaluation import plot_roc_pr_curve
input_table = inputs[0]
result = plot_roc_pr_curve(table=input_table, label_col='species', probability_col='probability_virginica', pos_label='virginica', fig_w=6.4, fig_h=4.8, group_by=None)
output = result['result']
```

In this python script, Plot Roc and PR Curves function is used to understand the quality of the trained classification model.
