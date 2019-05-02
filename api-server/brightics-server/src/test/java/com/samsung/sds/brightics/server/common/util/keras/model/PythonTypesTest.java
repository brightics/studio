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

package com.samsung.sds.brightics.server.common.util.keras.model;

import com.google.gson.JsonArray;
import com.google.gson.JsonPrimitive;
import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class PythonTypesTest {

    @Test
    public void makePythonStrScriptWithJsonString() throws Exception {
        assertThat(PythonTypes.STR.script(new JsonPrimitive("Hello"))).isEqualTo("\"\"\"Hello\"\"\"");
    }

    @Test
    public void makePythonBoolScriptWithJsonBoolean() throws Exception {
        assertThat(PythonTypes.BOOL.script(new JsonPrimitive(true))).isEqualTo("True");
        assertThat(PythonTypes.BOOL.script(new JsonPrimitive(false))).isEqualTo("False");
    }

    @Test
    public void makePythonListScriptWithJsonString() throws Exception {
        assertThat(PythonTypes.LIST.script(new JsonPrimitive("Hello"))).isEqualTo("[\"\"\"Hello\"\"\"]");
    }

    @Test
    public void makePythonTupleScriptWithJsonArray() throws Exception {
        JsonArray arr = new JsonArray();
        arr.add(1);
        arr.add(2);
        arr.add(3);

        assertThat(PythonTypes.TUPLE.script(arr)).isEqualTo("(1,2,3)");
    }

    @Test
    public void exceptionThrownWhenPassNotArrayNumberArgumentToPythonTypeTuple() {
        JsonArray arr = new JsonArray();
        arr.add("hello");
        arr.add(2);
        arr.add(3);

        assertThatThrownBy(() -> PythonTypes.TUPLE.script(arr))
                .hasMessage("'%s' is not of Array[Number] type. Entered value is '[\"hello\",2,3]'");
    }

    @Test
    public void makePythonNumberScriptWithJsonNumberOrStringNumber() throws Exception {
        assertThat(PythonTypes.NUMBER.script(new JsonPrimitive(1))).isEqualTo("1");
        assertThat(PythonTypes.NUMBER.script(new JsonPrimitive("1"))).isEqualTo("1");
    }

    @Test
    public void ifNoneStringPassedAsParameterThenJustReturnNoneString() throws Exception {
        assertThat(PythonTypes.STR.script(new JsonPrimitive("None"))).isEqualTo("None");
        assertThat(PythonTypes.BOOL.script(new JsonPrimitive("None"))).isEqualTo("None");
        assertThat(PythonTypes.LIST.script(new JsonPrimitive("None"))).isEqualTo("None");
        assertThat(PythonTypes.TUPLE.script(new JsonPrimitive("None"))).isEqualTo("None");
        assertThat(PythonTypes.NUMBER.script(new JsonPrimitive("None"))).isEqualTo("None");
    }

    @Test
    public void exceptionThrownWhenPassNotNumberArgumentToPythonTypeNumber() {
        assertThatThrownBy(() -> PythonTypes.NUMBER.script(new JsonPrimitive("hello")))
                .hasMessage("'%s' is not of Number type. Entered value is 'hello'");
    }
}
