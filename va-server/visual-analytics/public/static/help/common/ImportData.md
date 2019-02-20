## Format

### Scala
```
function("ImportData", "input-path"->"", "copy-from"->"", "output-path"->"", "column-type"->"", "is-delete"->"", "delimiter"->"", "is-header"->"", "quote"->"", "array-delimiter"->"", "array-start-string"->"", "array-end-string"->"", "key-value-delimiter"->"", "map-start-string"->"", "map-end-string"->"", "ip"->"", "port"->"", "db-type"->"", "username"->"", "password"->"", "db-name"->"", "table-name"->"", "connection-timeout"->"", "login-timeout"->"", "socket-timeout"->"", "lock-timeout"->"")
```

## Description

ImportData is the function of importing data to Brightics repository from other file systems. When importing from Brightics repository or other HDFS, the csv file is converted to brightics data. When exporting to Relational DB, the data is loaded from the table in database.

---

## Properties

### VA
1. **Import From**<b style='color:red'>*</b> : Source file system type to import data. It must be one of Repository, HDFS, Relational DB.
2. **Input Path**<b style='color:red'>*</b> : Path of the input csv file you want to import. It is only used when Import From is Repository or HDFS. The base path is "/".
3. **Column Type** : The column datatypes of the imported data. If nothing, the datatypes are determined automatically.   
4. **Delimiter** : The delimiter of csv source file. It is only used when Import From is Repository or HDFS. Default value is Comma(,).
5. **Quote** : The quote of csv source file. It is only used when Import From is Repository or HDFS. Default value is Double Quotation(").
6. **Array Delimiter** : The delimiter of values in array data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Colon(:).
7. **Array Start** : The start string of array data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Left Square Bracket([).
8. **Array End** : The end string of array data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Right Square Bracket(]).
9. **Key Value** : The delimiter of key and value of map data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Equal(=).
10. **Map Start** : The start string of map data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Left Curly Bracket([).
11. **Map End** : The end string of map data in csv source file. It is only used when Import From is Repository or HDFS. Default value is Right Curly Bracket(]).
12. **Ip**<b style='color:red'>*</b> : The ip(host) of the source HDFS file system. It is only used when Import From is HDFS.
13. **Port**<b style='color:red'>*</b> : The port of the source HDFS file system. It is only used when Import From is HDFS. 
14. **Datasource**<b style='color:red'>*</b> : The datasource of the source relational db. It is only used when Import From is Relational DB.
15. **Table Name**<b style='color:red'>*</b> : The name of source data table in the relational db. It is only used when Import From is Relational DB.
16. **Connection Timeout** : The timeout amounts of database connection. It is only used when Import From is Relational DB. Default value is 600. It must be greater than or equal to 0.
17. **Execution Timeout** : The timeout amounts of database execution. It is only used when Import From is Relational DB. Default value is 600. It must be greater than or equal to 0.
18. **Output Path**<b style='color:red'>*</b> : The path where the imported data is saved. Only path started with "/shared/upload/" or "/{userId}/upload/" is allowed.
19. **Overwrite** : Logical value indicating whether existing file overwrite or not. Default value is True.

### Scala
1. **copy-from**<b style='color:red'>*</b> : Source file system type to import data. It must be one of 'alluxio', 'hdfs', 'jdbc'
2. **input-path**<b style='color:red'>*</b> :Path of the input csv file you want to import. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. The base path is "/".
3. **column-type** : The column datatypes of the imported data. If nothing, the datatypes are determined automatically.
4. **delimiter** : The delimiter of csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is Comma(,).
5. **quote** : The quote of csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is Double Quotation(").
6. **array-delimiter** : The delimiter of values in array data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is colon(:).
7. **array-start-string** : The start string of array data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is left square bracket([).
8. **array-end-string** : The end string of array data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is right square bracket(]).
9. **key-value-delimiter** : The delimiter of key and value of map data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is equal(=).
10. **map-start-string** : The start string of map data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is left curly bracket([).
11. **map-end-string** : The end string of map data in csv source file. It is only used when 'copy-to' is 'alluxio' or 'hdfs'. Default value is right curly bracket(]).
12. **ip**<b style='color:red'>*</b> : The ip(host) of the source file system. It is only used when 'copy-to' is 'hdfs' or 'jdbc'.
13. **port**<b style='color:red'>*</b> : The port of the source file system. It is only used when 'copy-to' is 'hdfs' or 'jdbc'.
14. **db-type**<b style='color:red'>*</b> : The type of the source database. It is only used when 'copy-to' is 'jdbc'. Supported value are 'postgre'(PostgreSQL), 'oracle'(Oracle), 'mariadb'(MariaDB)
15. **username**<b style='color:red'>*</b> : Database username. It is only used when 'copy-to' is 'jdbc'.
16. **password**<b style='color:red'>*</b> : Database password. It is only used when 'copy-to' is 'jdbc'. 
17. **db-name**<b style='color:red'>*</b> : Database name. It is only used when 'copy-to' is 'jdbc'. 
18. **table-name**<b style='color:red'>*</b> : The name of source data table in the relational db. It is only used when 'copy-to' is 'jdbc'. 
19. **connection-timeout** : The timeout amounts of database connection. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.
20. **execution-timeout** : The timeout amounts of database execution. It is only used when 'copy-to' is 'jdbc'. Default value is 600. It must be greater than or equal to 0.
21. **is-delete** : Logical value indicating whether existing file overwrite or not. (Default : false)

## Example

### VA
1. **Import From**<b style='color:red'>*</b> : Repository
2. **Input Path**<b style='color:red'>*</b> : /csv/sample_iris.csv
3. **Column Type** : double,double,double,double,string
4. **Delimiter** : Comma
5. **Header** : True
6. **Quote** : Double Quotation
7. **Array Delimiter** : Colon
8. **Array Start** : Bracket
9. **Array End** : Right Square Bracket
10. **Key Value** : Equal
11. **Map Start** : Left Curly Bracket
12. **Map End** : Right Curly Bracket
13. **Output Path**<b style='color:red'>*</b> : /shared/upload/imported_sample_iris
14. **Overwrite** : True

### Scala
```
"copy-from" -> "alluxio",
"input-path" -> "/csv/sample_iris.csv",
"column-type" -> "double,double,double,double,string"
"delimiter" -> ",",
"quote" -> "\"",
"array-delimiter" -> ":",
"array-start-string" -> "[",
"array-end-string" -> "]",
"key-value-delimiter" -> "=",
"map-start-string" -> "{",
"map-end-string" -> "}",
"output-path" -> "/shared/upload/imported_sample_iris",
"is-delete" -> "true"
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