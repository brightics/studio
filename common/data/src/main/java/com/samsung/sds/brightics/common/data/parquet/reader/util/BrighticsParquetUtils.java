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

package com.samsung.sds.brightics.common.data.parquet.reader.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.Footer;
import org.apache.parquet.hadoop.ParquetFileReader;
import org.apache.parquet.hadoop.ParquetReader;
import org.apache.parquet.hadoop.metadata.BlockMetaData;
import org.apache.parquet.hadoop.metadata.FileMetaData;
import org.apache.parquet.hadoop.metadata.ParquetMetadata;
import org.apache.parquet.schema.DecimalMetadata;
import org.apache.parquet.schema.GroupType;
import org.apache.parquet.schema.MessageType;
import org.apache.parquet.schema.OriginalType;
import org.apache.parquet.schema.Type;
import org.apache.parquet.schema.Type.Repetition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.data.parquet.reader.BrighticsParquetReadSupport;
import com.samsung.sds.brightics.common.data.parquet.reader.DefaultRecord;
import com.samsung.sds.brightics.common.data.parquet.reader.info.ColumnFilterParameter;
import com.samsung.sds.brightics.common.data.parquet.reader.info.FileIndex;
import com.samsung.sds.brightics.common.data.parquet.reader.info.ParquetInformation;
import com.samsung.sds.brightics.common.data.view.Column;

public class BrighticsParquetUtils {
	
	private static final Logger LOGGER = LoggerFactory.getLogger("ParquetClient");
	
	public static ParquetInformation getParquetInformation(Path path, Configuration conf, ColumnFilterParameter filterParam) throws IOException {
        FileStatus directory = FileSystem.get(conf).getFileStatus(path);
        List<Footer> footers = ParquetFileReader.readFooters(conf, directory, false);
        long previousTotalCount = 0l;
        long totalBytes = 0l;
        List<FileIndex> buf = new ArrayList<>();
        Column[] schema = null;
        Iterator<Footer> iter = footers.iterator();
        while (iter.hasNext()) {
            Footer footer = iter.next();
            ParquetMetadata meta = footer.getParquetMetadata();
            if (schema == null) {
                // set schema if it is null
                FileMetaData fileMetaData = meta.getFileMetaData();
                MessageType s = fileMetaData.getSchema();
                List<Type> fields = s.getFields();
                schema = columnGenerator(fields, filterParam);
            }
            Iterator<BlockMetaData> currentBlockIterator = meta.getBlocks().iterator();
            long currentCount = 0l;
            while (currentBlockIterator.hasNext()) {
                BlockMetaData blockMeta = currentBlockIterator.next();
                totalBytes += blockMeta.getTotalByteSize();
                currentCount += blockMeta.getRowCount();
            }
            buf.add(new FileIndex(footer.getFile().toString(), previousTotalCount, previousTotalCount + currentCount));
            previousTotalCount += currentCount;
        }
        return new ParquetInformation(schema, previousTotalCount, totalBytes, buf);
    }
	
    public static ParquetInformation getParquetInformation(Path path, Configuration conf) throws IOException {
    	return getParquetInformation(path, conf, new ColumnFilterParameter());
    }
    
	public static Column[] columnGenerator(List<Type> fields, ColumnFilterParameter filterParam) {
		int[] filteredColumns = filterParam.getFilteredColumns();
		if (filteredColumns.length == 0 || filteredColumns.length > fields.size()) {
			return fields.stream().map(c -> new Column(c.getName(), convertTypeName(c))).toArray(Column[]::new);
		} else {
			LOGGER.debug("Apply filter to column");
			Column[] columns = new Column[filteredColumns.length];
			for (int i = 0; i < filteredColumns.length; i++) {
				Type type = fields.get(filteredColumns[i]);
				columns[i] = new Column(type.getName(), convertTypeName(type));
			}
			return columns;
		}
	}

	public static Object[] rowGenerator(Object[] row, ColumnFilterParameter filterParam) {
		int[] filteredColumns = filterParam.getFilteredColumns();
		if (filteredColumns.length == 0 || filteredColumns.length > row.length) {
			return row;
		} else {
			Object[] refineRow = new Object[filteredColumns.length];
			for (int i = 0; i < filteredColumns.length; i++) {
				Object value = row[filteredColumns[i]];
				refineRow[i] = value;
			}
			return refineRow;
		}
	}

    private static String convertTypeName(Type t) {
        OriginalType originalType = t.getOriginalType();
        if (t.isPrimitive()) {
            return getPrimitiveName(t, originalType);
        } else {
            // group type
            GroupType gt = t.asGroupType();
            String fullTypeName = "";
            boolean repeated = t.isRepetition(Repetition.REPEATED);
            if (repeated) {
                fullTypeName += "<";
            } else {
                fullTypeName += getGroupName(gt, originalType);
            }
            fullTypeName += (gt.getFields().stream()
                    .map(additionalType -> convertTypeName(additionalType))
                    .collect(Collectors.joining(",")));
            if (repeated)
                fullTypeName += ">";
            return fullTypeName;
        }

    }

    private static String getGroupName(GroupType gt, OriginalType originalType) {
        if (originalType == null)
            return "struct=";
        switch (originalType) {
        case LIST:
            return "array";
        case MAP:
            return "map";
        default:
            return "struct=";
        }
    }

    private static String getPrimitiveName(Type t, OriginalType originalType) {
        switch (t.asPrimitiveType().getPrimitiveTypeName()) {
        case BINARY:
            if (originalType == OriginalType.UTF8)
                return "string";
            else
                return "binary";
        case BOOLEAN:
            return "boolean";
        case DOUBLE:
            return "double";
        case FIXED_LEN_BYTE_ARRAY:
            if (originalType == null)
                return "binary";
            switch (originalType) {
            case DECIMAL:
                DecimalMetadata meta = t.asPrimitiveType().getDecimalMetadata();
                return "decimal(" + meta.getPrecision() + "," + meta.getScale() + ")";
            default:
                return "binary";
            }
        case FLOAT:
            return "float";
        case INT32:
            if (originalType == null)
                return "int";
            switch (originalType) {
            case DECIMAL:
                DecimalMetadata meta = t.asPrimitiveType().getDecimalMetadata();
                return "decimal(" + meta.getPrecision() + "," + meta.getScale() + ")";
            case INT_8:
                return "tinyint";
            case INT_16:
                return "smallint";
            case DATE:
                return "date";
            default:
                return "int";
            }
        case INT64:
            return "bigint";
        case INT96:
            // we always assume int96 as timestamp.
            return "timestamp";
        default:
            // never arrive here
            return null;
        }
    }

    public static ParquetReader<DefaultRecord> getReader(Path path) throws IOException {
        return ParquetReader.builder(new BrighticsParquetReadSupport(), path).build();
    }
}
