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

package com.samsung.sds.brightics.common.data.parquet.writer;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.parquet.hadoop.api.WriteSupport;
import org.apache.parquet.io.api.Binary;
import org.apache.parquet.io.api.RecordConsumer;
import org.apache.parquet.schema.MessageType;
import org.apache.parquet.schema.OriginalType;
import org.apache.parquet.schema.PrimitiveType.PrimitiveTypeName;
import org.apache.parquet.schema.Type;
import org.apache.parquet.schema.Type.Repetition;
import org.apache.parquet.schema.Types;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;

public class CsvParquetWriteSupport extends WriteSupport<String[]> {

	RecordConsumer recordConsumer;
	String[] fieldNames;
	String[] fieldTypes;

	@Override
	public org.apache.parquet.hadoop.api.WriteSupport.WriteContext init(Configuration configuration) {
		// Get some configuration fields
		fieldNames = configuration.get(CsvParquetConfigKey.BRIGHTICS_CSV_SCHEMA_FIELD_NAMES).split(",");
		fieldTypes = configuration.get(CsvParquetConfigKey.BRIGHTICS_CSV_SCHEMA_FIELD_TYPES).split(",");
		
		Type[] types = convertFieldsToTypes(fieldNames, fieldTypes);

		MessageType messageType = Types.buildMessage().addFields(types).named("brightics_csv_schema");

		// Set extra metadata here
		Map<String, String> metadata = new HashMap<>();

		return new WriteContext(messageType, metadata);
	}

	/**
	 * Convert fields of csv header to parquet types.
	 * 
	 * @param fieldNames
	 * @param fieldTypes
	 * @return
	 */
	private Type[] convertFieldsToTypes(String[] fieldNames, String[] fieldTypes) {
		if (fieldNames.length != fieldTypes.length) {
			throw new BrighticsCoreException("5001");
		}
		final int fieldLength = fieldNames.length;
		Type[] schema = new Type[fieldLength];

		for (int i = 0; i < fieldLength; i++) {
			switch (fieldTypes[i].trim()) {
			case "double":
				schema[i] = Types.primitive(PrimitiveTypeName.DOUBLE, Repetition.OPTIONAL).named(fieldNames[i].trim());
				break;
			case "integer":
			case "int":
				schema[i] = Types.primitive(PrimitiveTypeName.INT32, Repetition.OPTIONAL).named(fieldNames[i].trim());
				break;
			case "long":
				schema[i] = Types.primitive(PrimitiveTypeName.INT64, Repetition.OPTIONAL).named(fieldNames[i].trim());
				break;
			case "string":
				schema[i] = Types.primitive(PrimitiveTypeName.BINARY, Repetition.OPTIONAL).as(OriginalType.UTF8)
						.named(fieldNames[i].trim());
				break;
			case "boolean":
				schema[i] = Types.primitive(PrimitiveTypeName.BOOLEAN, Repetition.OPTIONAL).named(fieldNames[i].trim());
				break;
			default:
				throw new BrighticsCoreException("5002", fieldTypes[i]);
			}
		}
		return schema;
	}

	@Override
	public void prepareForWrite(RecordConsumer recordConsumer) {
		this.recordConsumer = recordConsumer;
	}

	@Override
	public void write(String[] record) {
		recordConsumer.startMessage();
		for (int i = 0; i < record.length; i++) {
			String fieldData = record[i];
			// if fieldData is null. all type write null.
			if (fieldData != null) {
				writeField(fieldNames[i], fieldTypes[i], i, fieldData);
			}
		}
		recordConsumer.endMessage();
	}

	private void writeField(String fieldName, String fieldType, int index, String fieldData) {
		switch (fieldType) {
		case "double":
			writeDouble(fieldName, index, fieldData);
			break;
		case "integer":
		case "int":
			writeInteger(fieldName, index, fieldData);
			break;
		case "long":
			writeLong(fieldName, index, fieldData);
			break;
		case "string":
			writeString(fieldName, index, fieldData);
			break;
		case "boolean":
			writeBoolean(fieldName, index, fieldData);
			break;
		default:
			throw new BrighticsCoreException("5002", fieldType);
		}
	}

	// Double : "NaN"-> Double.NaN , abnormal -> null
	private void writeDouble(String fieldName, int index, String fieldData) {
		try {
			double d = Double.parseDouble(fieldData);
			recordConsumer.startField(fieldName, index);
			recordConsumer.addDouble(d);
			recordConsumer.endField(fieldName, index);
		} catch (Exception e) {
			return;
		}
	}
	
	// Integer : abnormal -> null
	private void writeInteger(String fieldName, int index, String fieldData) {
		try {
			double d = Double.parseDouble(fieldData);
			//follow spark csv law
			if (d > Integer.MAX_VALUE || d < Integer.MIN_VALUE || Double.isNaN(d) || Double.isInfinite(d)) {
				return;
			}
			recordConsumer.startField(fieldName, index);
			recordConsumer.addInteger((int) d);
			recordConsumer.endField(fieldName, index);
		} catch (Exception e) {
			return;
		}
	}

	// Long : abnormal -> null
	private void writeLong(String fieldName, int index, String fieldData) {
		try {
			double d = Double.parseDouble(fieldData);
			//follow spark csv law
			if (d > Long.MAX_VALUE || d < Long.MIN_VALUE || Double.isNaN(d) || Double.isInfinite(d)) {
				return;
			}
			recordConsumer.startField(fieldName, index);
			recordConsumer.addLong((long) d);
			recordConsumer.endField(fieldName, index);
		} catch (Exception e) {
			return;
		}
	}

	// Boolean : 1 or true -> true , 0 or false -> false
	private void writeBoolean(String fieldName, int index, String fieldData) {
		if ("1".equals(fieldData) || "true".equals(StringUtils.lowerCase(fieldData))) {
			recordConsumer.startField(fieldName, index);
			recordConsumer.addBoolean(true);
			recordConsumer.endField(fieldName, index);
		} else if("0".equals(fieldData) || "false".equals(StringUtils.lowerCase(fieldData))) {
			recordConsumer.startField(fieldName, index);
			recordConsumer.addBoolean(false);
			recordConsumer.endField(fieldName, index);
		} else {
			return;
		}
	}

	// String : null -> null
	private void writeString(String fieldName, int index, String fieldData) {
		try {
			recordConsumer.startField(fieldName, index);
			recordConsumer.addBinary(Binary.fromReusedByteArray(fieldData.getBytes("UTF-8")));
			recordConsumer.endField(fieldName, index);
		} catch (UnsupportedEncodingException e) {
			// never arrives here. trust me.
		}
	}

}
