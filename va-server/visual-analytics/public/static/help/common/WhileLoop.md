## Description
This functions that perform iterations while satisfying the condition.

## Properties
1. **Expression**<b style='color:red'>*</b>: Expression.
6. **Index Variable**: Index variable

## Input Data
WhileLoop Model analyze based on data from WhileLoop Load function.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

To use data from self-upper model, you have to drag and drop WhileLoop Load function from 'Selected Data' into Diagram editor.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
This model analyze data from WhileLoop Load function created in Sub Model.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Click function that contains the data you want to deliver to self-upper model. In this case, It would be Statistic Summary function. Click it.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

To deliver data from model itself to self-upper model, you have to drag and drop Statistic Summary function from 'Out Data List' into Selected Data'

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

When invoking WhileLoop Model from self-upper model, Statistic Summary function will be used as a output data of flow function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/WhileLoop6.png'); margin-left: 25px;margin-bottom: 25px;"></div>