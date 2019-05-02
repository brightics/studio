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

import java.io.IOException;
import java.lang.reflect.Field;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.contrib.java.lang.system.EnvironmentVariables;

public class KvStoreClientTest {

    @Rule
    public final EnvironmentVariables environmentVariables = new EnvironmentVariables();

    @Before
    public void resetSingleton() throws SecurityException, NoSuchFieldException, IllegalArgumentException, IllegalAccessException {
        Field instance = KVStoreClient.class.getDeclaredField("instance");
        instance.setAccessible(true);
        instance.set(null, null);
    }

    @Test
    public void serializationTest() throws IOException {
        List<Double> list = new ArrayList<>();
        list.add(1d);
        list.add(2d);
        list.add(Double.NaN);
        byte[] data = KVStoreClient.getInstance().serialize(list);

        Object list2 = KVStoreClient.getInstance().deserialize(data, Object.class);
//        list2.forEach(i -> System.out.println(i));
        System.out.println(list2.toString());

        String greeting = "Hello, World!";
        byte[] data2 = KVStoreClient.getInstance().serialize(greeting);
        System.out.println(KVStoreClient.getInstance().deserialize(data2, Object.class));
    }

    @Test
    public void testPutAndGet() {
        List<Double> list = new ArrayList<>();
        list.add(1d);
        list.add(2d);
        list.add(Double.NaN);

        KVStoreClient.getInstance().put("itsjb.jung@samsung.com", "m1234", "t1234", list);
        List result = KVStoreClient.getInstance().get("itsjb.jung@samsung.com", "m1234", "t1234", List.class);
        Assert.assertEquals(3, result.size());
        Assert.assertEquals(1d, result.get(0));
        Assert.assertEquals(2d, result.get(1));
        Assert.assertEquals(Double.NaN, result.get(2));
    }

    @Test
    public void testH2Client() throws SQLException {
        environmentVariables.set("KV_STORE", "h2");
        KVStoreClient client = KVStoreClient.getInstance();
        client.put("test", "m1234", "t1234", Arrays.asList(1, 2));
        List result = client.get("test", "m1234", "t1234", List.class);
        Assert.assertEquals(2, result.size());
        Assert.assertEquals(1, result.get(0));
        Assert.assertEquals(2, result.get(1));
    }

    @Test
    public void testJsonForClientView() {
        KVStoreClient.getInstance().put("test", "{\"pickle\": {\"val\":1,\"__pickled__\": [128, 3, 99, 95, 95, 109, 97, 105, 110, 95, 95, 10, 84, 101, 115, 116, 10, 113, 0, 41, 129, 113, 1, 46]}}");
        System.out.println(KVStoreClient.getInstance().get("test", String.class));
    }
}
