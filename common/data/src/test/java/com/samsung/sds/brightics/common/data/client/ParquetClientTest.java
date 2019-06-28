/*
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.samsung.sds.brightics.common.data.client;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.common.data.parquet.reader.AbstractRecord;
import com.samsung.sds.brightics.common.data.parquet.reader.BrighticsParquetReadSupport;
import com.samsung.sds.brightics.common.data.parquet.reader.DefaultRecord;
import com.samsung.sds.brightics.common.data.parquet.writer.CsvParquetWriterBuilder;
import com.samsung.sds.brightics.common.data.util.NumberParser;
import com.samsung.sds.brightics.common.data.view.ObjectTable;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetFileReader;
import org.apache.parquet.hadoop.ParquetFileWriter.Mode;
import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.metadata.ParquetMetadata;
import org.junit.Assert;
import org.junit.Test;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class ParquetClientTest {

    static String path = "C:/work/data/mydata/parq_write_test.parquet";

    // def create(inputBufferIter: BufferedIterator[String], targetPath: String, delimiter: String, columnType: Array[String], columnName: Array[String])
    @Test
    public void testInferSchema() throws IOException {
        ParquetWriter<String[]> writer = new CsvParquetWriterBuilder(new Path("C:/work/data/mydata/nan.parquet"),
                "myInt,myLong,myDouble,myString,myBoolean", "int,long,double,string,boolean")
                        .withWriteMode(Mode.OVERWRITE)
                        // .withCompressionCodec(CompressionCodecName.GZIP)
                        .withRowGroupSize(ParquetClient.ROW_GROUP_SIZE_IN_BYTE)
                        .withPageSize(ParquetClient.PAGE_SIZE_IN_BYTE).build();
        writer.write(new String[] { "1", "321", "3.2415", null, "true" });
        writer.write(new String[] { "2", "456", "NaN", null, "false" });
        writer.write(new String[] { "3", "789", "3.5", "GHI", "false" });
        writer.close();

        // Reading from spark is successful.
    }

    @Test
    public void testParseDouble() {
        System.out.println(NumberParser.getDouble(Double.toString(Double.MAX_VALUE)));
        System.out.println(NumberParser.getDouble(Double.toString(Double.MIN_VALUE)));
        System.out.println(NumberParser.getDouble(Double.toString(Double.POSITIVE_INFINITY)));
        System.out.println(NumberParser.getDouble(Double.toString(Double.NEGATIVE_INFINITY)));
        System.out.println(NumberParser.getDouble(Double.toString(Double.NaN)));
        System.out.println(NumberParser.getDouble(Double.toString(2.43653453241981891891897894534)));
        System.out.println(NumberParser.getDouble(Double.toString(Math.PI)));
        System.out.println(Math.PI);
        System.out.println(NumberParser
                .getDouble(Double.toString(2.43653453241981891891897894534)) == 2.43653453241981891891897894534);
    }

    @Test
    public void testWriteCsv() throws Exception {
        long t1 = System.currentTimeMillis();
        BufferedInputStream fis = new BufferedInputStream(new FileInputStream("c:/work/data/ODS_S_PROMO.csv"));
        String names = "SALES_LEVEL,SALES_ID,ITEM_ID,START_DATE,END_DATE,START_YEAR,START_WEEK,END_YEAR,END_WEEK,S_PROMO_BNC_VALUE,S_PROMO_BUNDLE_VALUE,S_PROMO_CASHBACK_VALUE,S_PROMO_FLYER_VALUE,S_PROMO_TV_VALUE,S_PROMO_DMD_INQ_VALUE,DATASET";
        String types = "string,string,string,string,string,int,int,int,int,double,double,double,double,double,double,string";
        // String types = "string,string,string,string,string,int,int,int,int,string,string,string,string,string,string,string";
        ParquetClient.writeCsvToParquet(fis, ",", names, types, 0, "c:/work/data/ODS_S_PROMO_PARQUET", true, true);
        System.out.println(System.currentTimeMillis() - t1);
    }

    @Test
    public void testReadParquet() throws IOException {
        String parquetPath = "D:/dev/temp/image_table.pq";

        ObjectTable table = ParquetClient.readParquet(parquetPath, 0, 2);
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(table));
        System.out.println(table.getData().get("data"));
    }

    @Test
    public void testDataType() throws IOException {
        String datatype = DigestUtils.sha1Hex("brightics-studio v1.0");
        Assert.assertEquals("83c78ba730ba09fa13c8559f2a616e887005e021", datatype);
    }
    /**
     * The input data for this test is from Spark using code below.
     * 
----------------------------------------------------------------------------------------------------------------------------------------
import org.apache.spark._
import org.apache.spark.sql._
import org.apache.spark.sql.types._

val struct =
      StructType(
        StructField("f1", FloatType, true) ::
          StructField("f2", ArrayType(BooleanType), true) :: Nil)
val dataTypes =
      Seq(
        IntegerType, StringType, BinaryType, BooleanType,
        ByteType, ShortType, IntegerType, LongType,
        FloatType, DoubleType, DecimalType(25, 5), DecimalType(6, 5),
        DateType, TimestampType,
        ArrayType(IntegerType), MapType(StringType, LongType), struct)
        
val fields = dataTypes.zipWithIndex.map { case (dataType, index) =>
      StructField(s"col$index", dataType, nullable = true)
    }
val schema = StructType(fields)

val constantValues =
  Seq(
    "my name is jb",
    "a string in binary".getBytes("UTF-8"),
    true,
    1.toByte,
    2.toShort,
    3,
    Long.MaxValue,
    0.25.toFloat,
    0.75,
    new java.math.BigDecimal(s"1234.23456"),
    new java.math.BigDecimal(s"1.23456"),
    java.sql.Date.valueOf("2015-01-01"),
    java.sql.Timestamp.valueOf("2015-01-01 23:50:59.123"),
    Seq(2, 3, 4),
    Map("a string" -> 2000L),
    Row(4.75.toFloat, Seq(false, true)))
sqlContext.createDataFrame(sc.parallelize(1 to 1000,10).map(i => Row.fromSeq(Seq(i) ++ constantValues)),schema).write.mode(SaveMode.Overwrite).parquet("/tmp/alltype_test")
----------------------------------------------------------------------------------------------------------------------------------------     *
     * @throws IOException
     */
    @Test
    public void testReadParquetAllType() throws IOException {
        URL url = this.getClass().getResource("/alltype_test");
        ObjectTable table = ParquetClient.readParquet(url.toString(), 35, 55);
        ObjectMapper mapper = new ObjectMapper();
        System.out.println(mapper.writeValueAsString(table));
    }

    @Test
    public void testReadParquetAllTypeThreading() throws IOException {
        ExecutorService es = Executors.newFixedThreadPool(10);
        es.execute(getReadingThread(3, 7));
        es.execute(getReadingThread(5, 10));
        es.execute(getReadingThread(0, 10));
        es.execute(getReadingThread(50, 51));
        es.execute(getReadingThread(9, 11));
        try {
            es.awaitTermination(20, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private Thread getReadingThread(int start, int end) {
        return new Thread() {
            @Override
            public void run() {
                try {
                    URL url = this.getClass().getResource("/alltype_test");
                    ObjectTable table = ParquetClient.readParquet(url.toString(), start, end);
                    ObjectMapper mapper = new ObjectMapper();
                    System.out.println(mapper.writeValueAsString(table));
                } catch (JsonProcessingException e) {
                    System.out.println("ERROR");
                    e.printStackTrace();
                } catch (IllegalArgumentException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        };
    }

    @Test
    public void testReadAllType() {
        ParquetReader<DefaultRecord> reader = null;
        try {
            PrintWriter writer = new PrintWriter(System.out, true);
//            Path path = new Path(
//                    "C:/work/data/alltype_test3/part-00000-c9f07451-6077-41c2-b15b-42bfaf3adbce-c000.snappy.parquet");
            Path path = new Path(
                    "C:/work/data/mydata/null_test2.parquet");
            // Path path = new Path("C:/work/data/alltype_zero/part-00000-3692fa8f-3de9-4e7c-bf69-ea381407ab84-c000.snappy.parquet");
            reader = ParquetReader.builder(new BrighticsParquetReadSupport(), path).build();
            ParquetMetadata metadata = ParquetFileReader.readFooter(new Configuration(), path);
            // JsonRecordFormatter.JsonGroupFormatter formatter = JsonRecordFormatter
            // .fromSchema(metadata.getFileMetaData().getSchema());

            for (AbstractRecord value = reader.read(); value != null; value = reader.read()) {
                // writer.write(formatter.formatRecord(value));
                // value.prettyPrint(writer);
                // for(Object nv : value.getValues()){
                // System.out.println(nv +" : "+nv.getClass().getName());
                // }
                Object[] values = (Object[]) value.getValues();
                for (Object o : values) {
//                    writer.println(o + " : " + o.getClass().getName());
                    writer.print(o);
                    writer.print(",");
                }
                writer.println();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (Exception ex) {
                }
            }
        }
    }
}
