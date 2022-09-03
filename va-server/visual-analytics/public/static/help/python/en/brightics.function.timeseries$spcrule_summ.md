## Format
Anomaly Detection using Statistical Process Control (SPC) rules.

## Description
This function works for Anomaly Detection using Statistical Process Control (SPC) rules.


|Ruleset|description|
|:---:|---|
|Basic| 1. recent 1 sample is more than 3 sigma from the mean|
|Nelson| 1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 9 samples are on the same side from the mean <br> 5. recent 6 samples are continuously increasing or decreasing<br>6. recent 15 samples are within 1 sigma from the mean<br>7. recent 14 samples are alternate in direction(increasing then decreasing)<br>8. recent 8 samples are on the outside 1 sigma from the mean
|Western Electric(WE)| 1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 8 samples are on the same side from the mean
|WE supplemental Rule| 1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 8 samples are on the same side from the mean <br> 5. recent 6 samples are continuously increasing or decreasing<br>6. recent 15 samples are within 1 sigma from the mean<br>7. recent 14 samples are alternate in direction(increasing then decreasing)<br>8. recent 8 samples are on the outside 1 sigma from the mean
|WE Rule - Asymmetric control limits<br>for small sample| 1. recent 1 sample is more than 3 sigma from the mean on the positive side<br>2. recent 2 samples are over 2 sigma from the mean on the positive side<br>3. recent 3 over 1 sigma from the mean on the positive side<br>4. recent 7 samples are on the positive side from the mean<br>5. recent 10 samples are on the negative side from the mean<br>6. recent 6 samples are below 1 sigma from the mean on the negative side<br> 7. recent 4 samples are below 2 sigma from the mean on the negative side
|Juran | 1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 9 samples are on the same side from the mean <br> 5. recent 6 samples are continuously increasing or decreasing<br>6. recent 8 samples are on the outside 1 sigma from the mean
|Gitlow|1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 8 samples are on the same side from the mean <br> 5. recent 8 samples are continuously increasing or decreasing
|Duncan|1. recent 1 sample is more than 3 sigma from the mean<br>2. 2 out of 3 recent samples are more than 2 sigma from the mean on the same side<br>3. 4 out of 5 recent samples are more than a sigma from the mean on the same side<br>4. recent 7 samples are continuously increasing or decreasing
|Westgard|1. recent 1 sample is more than 3 sigma from the mean<br>2. recent 2 samples are more than 2 sigma from the mean on the same side<br>3. recent 4 samples are more than a sigma from the mean on the same side<br>4. recent 10 samples are on the same side from the mean <br> 5. recent 8 samples are continuously increasing or decreasing<br>6. recent 2 samples are more than 2 sigma from the mean on the opposite side
|AIAG|1. recent 1 sample is more than 3 sigma from the mean<br>2. recent 7 samples are on the same side from the mean <br> 3. recent 7 samples are continuously increasing or decreasing



Ruleset Reference
- <https://en.wikipedia.org/wiki/Nelson_rules>
- <https://en.wikipedia.org/wiki/Western_Electric_rules>
- <http://quinn-curtis.com/index.php/spcnamedrulesets>
 

---




## Properties
### VA
#### Inputs
1. **table**<b style="color:red">*</b>: table
2. **summary**<b style="color:red">*</b>: table
#### Outputs
1. **out_table**: table (result)
2. **out_table2**: table (summary for future use)

#### Parameters
1. **Time Column**<b style="color:red">*</b>: time column to sort by
2. **Value Column**<b style="color:red">*</b>: value column to execute anomaly detection
3. **Ruleset**<b style="color:red">*</b>: select Statistical Process Control Ruleset.
4. **Minimun sample count**: minimun sample count before execute anomaly detection
5. **remove outliers**: before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)




### Python
#### USAGE
```
spcrule_summ(time_col = ,value_col = ,ruleset_id = ,min_sample_cnt = ,filtering = )
```
#### Inputs
1. **table**<b style="color:red">*</b>: table
2. **summary**<b style="color:red">*</b>: table
#### Outputs
1. **out_table**: table (result)
2. **out_table2**: table (summary for future use)


#### Parameters
1. **time_col**<b style="color:red">*</b>: time column to sort by
2. **value_col**<b style="color:red">*</b>: value column to execute anomaly detection
   - Allowed column type : Integer, Long, Float, Double, Decimal
3. **ruleset_id**<b style="color:red">*</b>: select Statistical Process Control Ruleset.
4. **min_sample_cnt**: minimun sample count before execute anomaly detection
   - Value type : Integer
   - Default : 50
5. **filtering**: before calculate mean and standard deviation, filter the value using Interquartile range(IQR) filter. (Outlier = below Q1 − 1.5 IQR or above Q3 + 1.5 IQR)
   - Available items
      - 1 (default)
      - 0


