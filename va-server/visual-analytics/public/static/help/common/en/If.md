## Description
This function that executes a branch based on a condition.

## Properties
1. **If**<b style='color:red'>*</b>: If condition
2. **Else If**<b style='color:red'>*</b>: Else if condition

## Input Data
Condition Model analyze based on data from Condition Load function.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

To use data from self-upper model, you have to drag and drop Condition Load function from 'Selected Data' into Diagram editor.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
This model analyze data from Condition Load function created in Sub Model.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Click function that contains the data you want to deliver to self-upper model. In this case, It would be Statistic Summary function. Click it.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

To deliver data from model itself to self-upper model, you have to drag and drop Statistic Summary function from 'Out Data List' into Selected Data'

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

When invoking Condition Model from self-upper model, Statistic Summary function will be used as a output data of flow function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Condition6.png'); margin-left: 25px;margin-bottom: 25px;"></div>