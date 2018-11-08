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
