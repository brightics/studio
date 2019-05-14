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

/* 
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package com.samsung.sds.brightics.common.data.parquet.reader;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.MathContext;
import java.math.RoundingMode;

import org.apache.parquet.io.api.Binary;
import org.apache.parquet.io.api.Converter;
import org.apache.parquet.io.api.GroupConverter;
import org.apache.parquet.io.api.PrimitiveConverter;
import org.apache.parquet.schema.DecimalMetadata;
import org.apache.parquet.schema.GroupType;
import org.apache.parquet.schema.OriginalType;
import org.apache.parquet.schema.PrimitiveType.PrimitiveTypeName;
import org.apache.parquet.schema.Type;
import org.apache.parquet.schema.Type.Repetition;

import com.samsung.sds.brightics.common.data.parquet.reader.util.ParquetTimestampUtils;

/**
 * 
 * 
 * @author
 */
public class DefaultRecordConverter extends GroupConverter {

    private final Converter converters[];
    protected final DefaultRecordConverter parent;
    protected AbstractRecord<?> record;
    protected String name;
    protected int fieldIndex;

    public DefaultRecordConverter(GroupType schema) {
        this(schema, null, null, 0);
    }

    public DefaultRecordConverter(GroupType schema, String name, DefaultRecordConverter parent, int fieldIndex) {
        this.converters = new Converter[schema.getFieldCount()];
        this.parent = parent;
        this.name = name;
        this.fieldIndex = fieldIndex;

        int i = 0;
        for (Type field : schema.getFields()) {
            converters[i] = createConverter(field,i);
            i++;
        }
    }

    private Converter createConverter(Type field, int fieldIndex) {
        OriginalType otype = field.getOriginalType();

        if (field.isPrimitive()) {
            if (otype != null) {
                switch (otype) {
                case MAP:
                    break;
                case LIST:
                    break;
                case UTF8:
                    return new StringConverter(fieldIndex);
                case MAP_KEY_VALUE:
                    break;
                case ENUM:
                    break;
                case INT_8:
                    return new ByteConverter(fieldIndex); // byte
                case INT_16:
                    return new ShortConverter(fieldIndex); // short
                case DATE:
                    return new DateConverter(fieldIndex);
                case DECIMAL:
                    DecimalMetadata meta = field.asPrimitiveType().getDecimalMetadata();
                    return new DecimalConverter(fieldIndex, meta.getPrecision(), meta.getScale());
                default:
                    break;
                }
            }

            if (field.asPrimitiveType().getPrimitiveTypeName() == PrimitiveTypeName.INT96) {
                // A type of int96 is assumed as timestamp
                return new Int96AsTimestampConverter(fieldIndex);
            }

            return new SimplePrimitiveConverter(fieldIndex);
        }

        GroupType groupType = field.asGroupType();
        if (otype != null) {
            switch (otype) {
            case MAP:
                return new MapRecordConverter(groupType, field.getName(), this, fieldIndex);
            case LIST:
                return new ListRecordConverter(groupType, field.getName(), this, fieldIndex);
            default:
                break;
            }
        }
        
        if(field.getRepetition() == Repetition.REPEATED){
            return new RepeatedRecordConverter(groupType, field.getName(), this, fieldIndex);
        }
        return new DefaultRecordConverter(groupType, field.getName(), this, fieldIndex);
    }

    @Override
    public Converter getConverter(int fieldIndex) {
        return converters[fieldIndex];
    }

    public AbstractRecord<?> getCurrentRecord() {
        return record;
    }

    @Override
    public void start() {
        record = new DefaultRecord(converters.length);
    }

    @Override
    public void end() {
        if (parent != null) {
            parent.getCurrentRecord().add(fieldIndex, record.values);
        }
    }

    private class SimplePrimitiveConverter extends PrimitiveConverter {

        protected int fieldIndex;
        private SimplePrimitiveConverter(int fieldIndex){
            this.fieldIndex = fieldIndex;
        }
        
        @Override
        public void addBinary(Binary value) {
            record.add(fieldIndex, value.getBytes());
        }

        @Override
        public void addBoolean(boolean value) {
            record.add(fieldIndex, value);
        }

        @Override
        public void addDouble(double value) {
            record.add(fieldIndex, value);
        }

        @Override
        public void addFloat(float value) {
            record.add(fieldIndex, value);
        }

        @Override
        public void addInt(int value) {
            record.add(fieldIndex, value);
        }

        @Override
        public void addLong(long value) {
            record.add(fieldIndex, value);
        }
    }

    private class StringConverter extends SimplePrimitiveConverter {

        private StringConverter(int fieldIndex){
            super(fieldIndex);
        }
        
        @Override
        public void addBinary(Binary value) {
            record.add(fieldIndex, value.toStringUsingUTF8());
        }
    }

    private class ByteConverter extends SimplePrimitiveConverter {

        private ByteConverter(int fieldIndex){
            super(fieldIndex);
        }
        
        @Override
        public void addInt(int value) {
            record.add(fieldIndex, (byte) value);
        }
    }

    private class ShortConverter extends SimplePrimitiveConverter {

        private ShortConverter(int fieldIndex){
            super(fieldIndex);
        }
        
        @Override
        public void addInt(int value) {
            record.add(fieldIndex, (short) value);
        }
    }

    private class Int96AsTimestampConverter extends SimplePrimitiveConverter {

        private Int96AsTimestampConverter(int fieldIndex){
            super(fieldIndex);
        }
        
        @Override
        public void addBinary(Binary value) {
            record.add(fieldIndex, new java.sql.Timestamp(ParquetTimestampUtils.getTimestampMillis(value)));
        }
    }

    private class DateConverter extends SimplePrimitiveConverter {

        private DateConverter(int fieldIndex){
            super(fieldIndex);
        }
        
        @Override
        public void addInt(int value) {
            record.add(fieldIndex, ParquetTimestampUtils.getDate(value));
        }
    }
    
    private class DecimalConverter extends SimplePrimitiveConverter {
        private int scale;
        private MathContext mc;

        private DecimalConverter(int fieldIndex, int precision, int scale) {
            super(fieldIndex);
            this.scale = scale;
            this.mc = new MathContext(precision, RoundingMode.HALF_UP);
        }

        @Override
        public void addInt(int value) {
            addLong(value);
        }

        @Override
        public void addLong(long value) {
            record.add(fieldIndex, decimalFromLong(value));
        }

        @Override
        public void addBinary(Binary value) {
            record.add(fieldIndex, decimalFromBinary(value));
        }

        private BigDecimal decimalFromLong(long unscaledVal) {
            return new BigDecimal(BigInteger.valueOf(unscaledVal),scale,mc);
        }

        private BigDecimal decimalFromBinary(Binary value) {
            return new BigDecimal(new BigInteger(value.getBytes()),scale,mc);
        }
    }

}
