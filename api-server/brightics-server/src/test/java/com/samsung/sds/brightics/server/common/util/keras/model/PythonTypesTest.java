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
