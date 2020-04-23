## Description
This functions that perform iterations while satisfying the condition.

## Properties
1. **Loop Type**<b style='color:red'>*</b>: 'Count' or 'Collection', Loop type.
2. **Start**<b style='color:red'>*</b>: Start Index, If 'Loop Type' property is Count.
3. **End**<b style='color:red'>*</b>: End Index, If 'Loop Type' property is Count.
4. **Collection**<b style='color:red'>*</b>: Collection, If 'Loop Type' property is Collection.
5. **Element Variable**: Element Variable, If 'Loop Type' property is Collection.
6. **Index Variable**: Index variable

## Input Data
Loop Model analyze based on data from Loop Load function.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

To use data from self-upper model, you have to drag and drop Loop Load function from 'Selected Data' into Diagram editor.

<div style="width:800px; height:509px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
This model analyze data from Loop Load function created in Sub Model.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop3.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Click function that contains the data you want to deliver to self-upper model. In this case, It would be Statistic Summary function. Click it.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop4.png'); margin-left: 25px;margin-bottom: 25px;"></div>

To deliver data from model itself to self-upper model, you have to drag and drop Statistic Summary function from 'Out Data List' into Selected Data'

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop5.png'); margin-left: 25px;margin-bottom: 25px;"></div>

When invoking Loop Model from self-upper model, Statistic Summary function will be used as a output data of flow function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/Loop6.png'); margin-left: 25px;margin-bottom: 25px;"></div>