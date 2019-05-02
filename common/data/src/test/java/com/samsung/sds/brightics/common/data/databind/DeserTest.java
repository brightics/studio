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

package com.samsung.sds.brightics.common.data.databind;

import java.io.IOException;

import org.assertj.core.api.Assertions;
import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.scala.DefaultScalaModule;

public class DeserTest {

    private static ObjectMapper MAPPER = new ObjectMapper();

    @BeforeClass
    public static void setUp() {
        MAPPER.registerModules(new DefaultScalaModule(), new KVStoredDataModule());
    }

    @Test
    public void testTupleData() throws IOException {
        String serDataWithTuple = "{\"tuple\": {\"__tuple__\": [{\"__tuple__\": [1, 2]}, 3]}}";
        String deserData = String.valueOf(MAPPER.readValue(serDataWithTuple, Object.class));
        Assertions.assertThat(deserData).isEqualToIgnoringWhitespace("{tuple=[[1, 2], 3]}");
    }

    @Test
    public void testSetData() throws IOException {
        String serDataWithSet = "{\"set\": {\"__set__\": [1, 2, 3]}}";
        String deserData = String.valueOf(MAPPER.readValue(serDataWithSet, Object.class));
        Assertions.assertThat(deserData).isEqualToIgnoringWhitespace("{set=[1, 2, 3]}");
    }

    @Test
    public void testPickleData() throws IOException {
        String serDataWithPickle = "{\"pickle\": {\"__pickled__\": [1, 2, 3]}}";
        String deserData = String.valueOf(MAPPER.readValue(serDataWithPickle, Object.class));
        Assertions.assertThat(deserData).isEqualToIgnoringWhitespace("{pickle=python object}");
    }

}
