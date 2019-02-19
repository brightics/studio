## Format

### Scala
```
function("ExportData", "input-path"->"", "copy-to"->"", "output-path"->"", "is-delete"->"", "delimiter"->"", "is-header"->"", "quote"->"", "array-delimiter"->"", "array-start-string"->"", "array-end-string"->"", "key-value-delimiter"->"", "map-start-string"->"", "map-end-string"->"", "ip"->"", "port"->"", "db-type"->"", "username"->"", "password"->"", "db-name"->"", "table-name"->"", "connection-timeout"->"", "login-timeout"->"", "socket-timeout"->"", "lock-timeout"->"")
```

## Description

ExportData is the function of exporting data from Brightics repository to other file systems. When exporting to Brightics repository or other HDFS, the data is converted to csv file. When exporting to Relational DB, the data is saved to the table in database.

---

## Properties

### VA
1. **Input Path**<b style='color:red'>*</b> : Full path to the input file you want to copy from. Only path started with "/shared/upload/" or "/{userId}/upload/" is allowed.
2. **Export To**<b style='color:red'>*</b> : Target file system type to export data. It must be one of Repository, HDFS, Relational DB.
3. **Output Path**<b style='color:red'>*</b> : File path where the output is saved. The base path is "/".
4. **Overwrite** : Logical value indicating whether existing file overwrite or not. Default value is True.
5. **Delimiter** : The delimiter of exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Comma(,).
6. **Header** : Logical value indicating whether the column names of the input data is saved in the first line of the output file. It is only used when Export To is Repository or HDFS. Default value is True.
7. **Quote** : The quote of exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Double Quotation(").
8. **Array Delimiter** : The delimiter of values in array data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Colon(:).
9. **Array Start** : The start string of array data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Left Square Bracket([).
10. **Array End** : The end string of array data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Right Square Bracket(]).
11. **Key Value** : The delimiter of key and value of map data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Equal(=).
12. **Map Start** : The start string of map data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Left Curly Bracket([).
13. **Map End** : The end string of map data in exporting csv file. It is only used when Export To is Repository or HDFS. Default value is Right Curly Bracket(]).
14. **Ip**<b style='color:red'>*</b> : The ip(host) of the target HDFS file system. It is only used when Export To is HDFS.
15. **Port**<b style='color:red'>*</b> : The port of the target HDFS file system. It is only used when Export To is HDFS. 
16. **Datasource**<b style='color:red'>*</b> : The datasource of the target relational db. It is only used when Export To is Relational DB.
17. **Table Name**<b style='color:red'>*</b> : The name of target table of exporting data in the relational db. It is only used when Export To is Relational DB.
18. **Connection Timeout** : The timeout amounts of database connection. It is only used when Export To is Relational DB. Default value is 600. It must be greater than or equal to 0.
19. **Login Timeout** : The timeout amounts of database login. It is only used when Export To is Relational DB. Default value is 600. It must be greater than or equal to 0.
20. **Socket Timeout** : The timeout amounts of database socket communication. It is only used when Export To is Relational DB. Default value is 600. It must be greater than or equal to 0.
21. **Lock Timeout** : The timeout amounts of database lock. It is only used when Export To is Relational DB. Default value is 600. It must be greater than or equal to 0.

### Scala
1. **input-path**<b style='color:red'>*</b> : Full path to the input file you want to copy from. Only path started with "/shared/upload/" or "/{userId}/upload/" is allowed.
2. **copy-to**<b style='color:red'>*</b> : Target file system type to export data. It must be one of 'alluxio', 'hdfs', 'jdbc'
3. **output-path**<b style='color:red'>*</b> : File path where the output is saved. The base path is "/".
4. **is-delete** : Logical value indicating whether existing file overwrite or not. (Default : false)
5. **delimiter** : The delimiter of exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is Comma(,).
6. **is-header** : Logical value indicating whether the column names of the input data is saved in the first line of the output file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is True.
7. **quote** : The quote of exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is Double Quotation(").
8. **array-delimiter** : The delimiter of values in array data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is colon(:).
9. **array-start-string** : The start string of array data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is left square bracket([).
10. **array-end-string** : The end string of array data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is right square bracket(]).
11. **key-value-delimiter** : The delimiter of key and value of map data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is equal(=).
12. **map-start-string** : The start string of map data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is left curly bracket([).
13. **map-end-string** : The end string of map data in exporting csv file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is right curly bracket(]).
14. **ip**<b style='color:red'>*</b> : The ip(host) of the target file system. It is only used when 'copy-to' is 'hdfs' or 'jdbc'.
15. **port**<b style='color:red'>*</b> : The port of the target file system. It is only used when 'copy-to' is 'hdfs' or 'jdbc'.
16. **db-type**<b style='color:red'>*</b> : The type of the target database. It is only used when 'copy-to' is 'jdbc'. Supported value are 'postgre'(PostgreSQL), 'oracle'(Oracle), 'mariadb'(MariaDB)
17. **username**<b style='color:red'>*</b> : Database username. It is only used when 'copy-to' is 'jdbc'.
18. **password**<b style='color:red'>*</b> : Database password. It is only used when 'copy-to' is 'jdbc'. 
19. **db-name**<b style='color:red'>*</b> : Database name. It is only used when 'copy-to' is 'jdbc'. 
20. **table-name**<b style='color:red'>*</b> : The name of target table of exporting data in the 'jdbc'. It is only used when 'copy-to' is 'jdbc'. 
21. **connection-timeout** : The timeout amounts of database connection. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.
22. **login-timeout** : The timeout amounts of database login. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.
23. **socket-timeout** : The timeout amounts of database socket communication. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.
24. **lock-timeout** : The timeout amounts of database lock. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.

## Example

### VA
1. **Input Path**<b style='color:red'>*</b> : /shared/upload/sample_data.csv
2. **Export To**<b style='color:red'>*</b> : Repository
3. **Output Path**<b style='color:red'>*</b> : /csv/sample_data.csv
4. **Overwrite** : True
5. **Delimiter** : Comma
6. **Header** : True
7. **Quote** : Double Quotation
8. **Array Delimiter** : Colon
9. **Array Start** : Bracket
10. **Array End** : Right Square Bracket
11. **Key Value** : Equal
12. **Map Start** : Left Curly Bracket
13. **Map End** : Right Curly Bracket

### Scala
```
"input-path" -> "/shared/upload/sample_iris.csv",
"copy-to" -> "alluxio",
"output-path" -> "/csv/sample_iris.csv",
"is-delete" -> "true",
"delimiter" -> ",",
"is-header" -> "true",
"quote" -> "\"",
"array-delimiter" -> ":"
"array-start-string" -> "["
"array-end-string" -> "]"
"key-value-delimiter" -> "="
"map-start-string" -> "{"
"map-end-string" -> "}"
```

##### ++In++

|sepal_length|sepal_width|petal_length|petal_width|species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5|3.6|1.4|0.2|setosa|
|5.4|3.9|1.7|0.4|setosa|
|4.6|3.4|1.4|0.3|setosa|
|5|3.4|1.5|0.2|setosa|
|4.4|2.9|1.4|0.2|setosa|
|4.9|3.1|1.5|0.1|setosa|
|5.4|3.7|1.5|0.2|setosa|
|4.8|3.4|1.6|0.2|setosa|
|4.8|3|1.4|0.1|setosa|
|4.3|3|1.1|0.1|setosa|
|5.8|4|1.2|0.2|setosa|
|5.7|4.4|1.5|0.4|setosa|
|5.4|3.9|1.3|0.4|setosa|
|5.1|3.5|1.4|0.3|setosa|
|5.7|3.8|1.7|0.3|setosa|
|5.1|3.8|1.5|0.3|setosa|
> **Note:** Only showing top 20 rows.

##### ++Out++
|sepal_length|sepal_width|petal_length|petal_width|species|
|--:|--:|--:|--:|:--|
|5.1|3.5|1.4|0.2|setosa|
|4.9|3.0|1.4|0.2|setosa|
|4.7|3.2|1.3|0.2|setosa|
|4.6|3.1|1.5|0.2|setosa|
|5.0|3.6|1.4|0.2|setosav
|5.4|3.9|1.7|0.4|setosa|
|4.6|3.4|1.4|0.3|setosa|
|5.0|3.4|1.5|0.2|setosa|
|4.4|2.9|1.4|0.2|setosa|
|4.9|3.1|1.5|0.1|setosa|
|5.4|3.7|1.5|0.2|setosa|
|4.8|3.4|1.6|0.2|setosa|
|4.8|3.0|1.4|0.1|setosa|
|4.3|3.0|1.1|0.1|setosa|
|5.8|4.0|1.2|0.2|setosa|
|5.7|4.4|1.5|0.4|setosa|
|5.4|3.9|1.3|0.4|setosa|
|5.1|3.5|1.4|0.3|setosa|
|5.7|3.8|1.7|0.3|setosa|
> **Note:** Only showing top 20 rows.
