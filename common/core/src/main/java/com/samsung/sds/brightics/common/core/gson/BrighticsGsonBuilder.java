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

package com.samsung.sds.brightics.common.core.gson;

import java.io.IOException;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.TypeAdapter;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

public class BrighticsGsonBuilder {

    private GsonBuilder gsonBuilder;
    private static Gson gson;

    private static final TypeAdapter<Number> DOUBLE_TYPE_ADAPTER = new TypeAdapter<Number>() {
        @Override
        public Number read(JsonReader in) throws IOException {
            if (in.peek() == JsonToken.NULL) {
                in.nextNull();
                return null;
            }
            return in.nextDouble();
        }

        @Override
        public void write(JsonWriter out, Number value) throws IOException {
            Double d = value.doubleValue();
            if (d.isNaN() || d.isInfinite()) {
                out.value(value.toString());
            } else {
                out.value(value);
            }
        }
    };

    private BrighticsGsonBuilder() {
        // when other options are needed exclusively, add method to enable needed options and make constructor and create method public.
        gsonBuilder = new GsonBuilder().disableHtmlEscaping().registerTypeAdapterFactory(new TypeAdapterFactory() {
            @Override
            public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
                Class<? super T> rawType = type.getRawType();
                //noinspection unchecked
                return (rawType == double.class || rawType == Double.class || rawType == float.class || rawType == Float.class)
                        ? (TypeAdapter<T>) DOUBLE_TYPE_ADAPTER
                        : null;
            }
        });
    }

    private Gson create() {
        return gsonBuilder.create();
    }

    public static synchronized Gson getGsonInstance() {
        if (gson == null) {
            gson = new BrighticsGsonBuilder().create();
        }
        return gson;
    }
}
