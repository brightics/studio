package com.samsung.sds.brightics.agent.util;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

public class ScriptUtil {
    public static String getFormattedScalaScript(String script) {
        return removeCommentsAndBlankLines(script, "\n ");
    }

    public static String getFormattedScalaSql(String script) {
        return escapeDoubleQuote(removeCommentsAndBlankLines(script, " "));
    }

    private static String escapeDoubleQuote(String s) {
        return s.replace("\"", "\\\"");
    }

    private static String removeCommentsAndBlankLines(String script, String dilem) {
        script = Arrays.stream(script.split("[\r\n]+"))
                .filter(s -> !StringUtils.startsWith(StringUtils.stripStart(s, null), "//"))
                .filter(StringUtils::isNotBlank).collect(Collectors.joining(dilem));
        return script;
    }
}
