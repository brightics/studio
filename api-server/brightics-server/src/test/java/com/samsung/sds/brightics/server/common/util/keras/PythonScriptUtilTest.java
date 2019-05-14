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

package com.samsung.sds.brightics.server.common.util.keras;

import com.google.gson.JsonArray;
import com.google.gson.JsonNull;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.samsung.sds.brightics.server.common.util.keras.model.KerasParameterConstant;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;

import java.util.Arrays;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class PythonScriptUtilTest {

    private JsonObject param;

    @Before
    public void setUp() {
        param = new JsonObject();
        param.addProperty("optimizer", "adam");
        param.addProperty("loss", "categorical_crossentropy");
        param.addProperty("metrics", "accuracy");
    }

    @Test
    public void canMakePythonParameterStringUsingParameterKeysAndJsonObject() throws Exception {
        String parameters = PythonScriptUtil.makePythonArgumentsString(
                Arrays.asList(KerasParameterConstant.OPTIMIZER, KerasParameterConstant.LOSS, KerasParameterConstant.METRICS)
                , Collections.emptyList()
                , param);

        assertThat(parameters).isEqualTo("optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\", metrics=[\"\"\"accuracy\"\"\"]");
    }

    @Test
    public void shouldReturnPythonParameterScriptOnlyUsingGivenKeyName() throws Exception {
        String parameters = PythonScriptUtil.makePythonArgumentsString(
                Arrays.asList(KerasParameterConstant.OPTIMIZER, KerasParameterConstant.LOSS), Collections.emptyList(), param);

        assertThat(parameters).isEqualTo("optimizer=\"\"\"adam\"\"\", loss=\"\"\"categorical_crossentropy\"\"\"");
    }

    @Test
    public void whenJsonObjectHaveBlankValueExpectThrowException() {
        param.addProperty("optimizer", StringUtils.EMPTY);

        assertThatThrownBy(() ->
                PythonScriptUtil.makePythonArgumentsString(
                        Collections.singletonList(KerasParameterConstant.OPTIMIZER)
                        , Collections.emptyList()
                        , param))
                .hasMessage("'Optimizer' is a required parameter.");
    }

    @Test
    public void whenParamsDoesNotHaveARequiredParameterExpectThrownException() {
        assertThatThrownBy(() ->
                PythonScriptUtil.makePythonArgumentsString(
                        Arrays.asList(KerasParameterConstant.OPTIMIZER, KerasParameterConstant.INPUT_SHAPE)
                        , Collections.emptyList()
                        , param))
                .hasMessage("'Input Shape' is a required parameter.");
    }

    @Test
    public void ifOptionalParametersAreNotExistInParamThenJustSkipIt() throws Exception {
        String parameters = PythonScriptUtil.makePythonArgumentsString(
                Collections.singletonList(KerasParameterConstant.OPTIMIZER)
                , Arrays.asList(KerasParameterConstant.INPUT_SHAPE)
                , param);

        assertThat(parameters).isEqualTo("optimizer=\"\"\"adam\"\"\"");
    }

    @Test
    public void tupleOrNumberTypeCheckTheValueIsNumberAndIfTheValueTypeIsNotNumberThrowException () {
        JsonObject numberParam = new JsonObject();
        numberParam.addProperty("units", "wrong");

        assertThatThrownBy(() ->
                PythonScriptUtil.makePythonArgumentsString(
                        Collections.singletonList(KerasParameterConstant.UNITS)
                        , Collections.emptyList()
                        , numberParam))
                .hasMessage("'Units' is not of Number type. Entered value is 'wrong'");

        assertThatThrownBy(() ->
                PythonScriptUtil.makePythonArgumentsString(
                        Collections.emptyList()
                        , Collections.singletonList(KerasParameterConstant.UNITS)
                        , numberParam))
                .hasMessage("'Units' is not of Number type. Entered value is 'wrong'");
    }

    @Test
    public void testJsonElementBlankMethod() {
        assertThat(PythonScriptUtil.isJsonElementBlank(null)).isTrue();

        JsonArray blankJsonArray = new JsonArray();
        assertThat(PythonScriptUtil.isJsonElementBlank(blankJsonArray)).isTrue();
        blankJsonArray.add("");
        assertThat(PythonScriptUtil.isJsonElementBlank(blankJsonArray)).isTrue();
        blankJsonArray.add("");
        assertThat(PythonScriptUtil.isJsonElementBlank(blankJsonArray)).isTrue();
        blankJsonArray.add("1");
        assertThat(PythonScriptUtil.isJsonElementBlank(blankJsonArray)).isFalse();

        assertThat(PythonScriptUtil.isJsonElementBlank(new JsonObject())).isTrue();

        assertThat(PythonScriptUtil.isJsonElementBlank(new JsonPrimitive(""))).isTrue();
        assertThat(PythonScriptUtil.isJsonElementBlank(new JsonPrimitive("1"))).isFalse();

        assertThat(PythonScriptUtil.isJsonElementBlank(JsonNull.INSTANCE)).isTrue();
    }

    @Test
    public void makeParamNameToCamelCaseString() {
        assertThat(PythonScriptUtil.paramNameCapitalize("units")).isEqualTo("Units");
        assertThat(PythonScriptUtil.paramNameCapitalize("input_shape")).isEqualTo("Input Shape");
    }
}
