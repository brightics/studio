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
