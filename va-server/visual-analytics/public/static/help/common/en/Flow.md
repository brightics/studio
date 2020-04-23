## Description
This function calls the Data Model.

## Properties
1. **Model**<b style='color:red'>*</b>: Model name
2. **Version**<b style='color:red'>*</b>: Model version
3. **Input Table**: Input table of the called model(Read Only)
4. **Return Table**: Retrurn table of the called model(Read Only)
5. **Variables**: Variables of the called model

## Input Data
Sub Model analyze based on data from Sub Load function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

To use data from self-upper model, you have to drag and drop Sub Load function from 'In Data List' into 'Selected Data'

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData2.png'); margin-left: 25px; margin-bottom: 25px;"></div>

When invoking sub Model from self-upper model through flow function, input data set in Sub Load function will be replaced to input data from flow function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/InputData4.png'); margin-left: 25px; margin-bottom: 25px;"></div>

## Return Data
This model analyze data from Sub Load function created in Sub Model.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData1.png'); margin-left: 25px; margin-bottom: 25px;"></div>

Click function that contains the data you want to deliver to self-upper model. In this case, It would be Filter function. Click it.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData2.png'); margin-left: 25px;margin-bottom: 25px;"></div>

To deliver data from model itself to self-upper model, you have to drag and drop Filter function from 'Out Data List' into Selected Data'

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData3.png'); margin-left: 25px;margin-bottom: 25px;"></div>

When invoking sub Model from self-upper model, Filter function will be used as a output data of flow function.

<div style="width:800px; height:600px; border:1px solid #EEEEEE; background-image: url('static/help/common/ReturnData5.png'); margin-left: 25px;margin-bottom: 25px;"></div>