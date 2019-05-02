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

package com.samsung.sds.brightics.common.variable.resolver;

import com.google.gson.JsonElement;
import java.util.regex.Pattern;

public class ExpressionPattern {

    public static Pattern getExtractPattern() {
        return Pattern.compile(ExpressionRegex.HEAD.regex + "(" + ExpressionRegex.BODY.regex + ")" + ExpressionRegex.TAIL.regex);
    }

    public static boolean isExpressionOnly(JsonElement value) {
        if (value == null) {
            return false;
        }
        return isExpressionOnly(value.getAsString());
    }

    public static boolean isExpressionOnly(String value) {
        if (value == null) {
            return false;
        }
        return value.matches(ExpressionRegex.EXPRESSION_ONLY.regex);
    }

    public static boolean containsExpression(String value) {
        if (value == null) {
            return false;
        }
        return value.matches("(?s).*" + ExpressionRegex.EXPRESSION.regex + "(?s).*");
    }

    public static String extractBody(String value) {
        assert isExpressionOnly(value);
        return value.replaceAll("^" + ExpressionRegex.HEAD.regex + "|" + ExpressionRegex.TAIL.regex + "$", "");
    }

    public enum ExpressionRegex {
        HEAD("\\$\\{="),
        TAIL("}"),
        BODY("[^}]+"),
        EXPRESSION(HEAD.regex + BODY.regex + TAIL.regex),
        EXPRESSION_ONLY("^" + EXPRESSION.regex + "$");

        private String regex;

        ExpressionRegex(String regex) {
            this.regex = regex;
        }
    }
}
