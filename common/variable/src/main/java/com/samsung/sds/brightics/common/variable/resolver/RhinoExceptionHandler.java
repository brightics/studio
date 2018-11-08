package com.samsung.sds.brightics.common.variable.resolver;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.mozilla.javascript.EcmaError;
import org.mozilla.javascript.RhinoException;
import org.mozilla.javascript.ScriptRuntime;

public final class RhinoExceptionHandler {

    private static Pattern undefinedNamePattern;

    static {
        String patternString = ScriptRuntime.getMessage("msg.is.not.defined", new String[]{"(.*)"});
        patternString = "^" + patternString.replaceAll("[.]$", "[.]").replaceAll("\"", "\\\"") + "$";
        undefinedNamePattern = Pattern.compile(patternString);
    }

    private RhinoExceptionHandler() {
        // nothing to do
    }

    public static BrighticsCoreException handle(RhinoException e, String errorScriptSource) {
        if (e instanceof EcmaError) {
            return handleEcmaError((EcmaError) e, errorScriptSource);
        } else {
            return new BrighticsCoreException("3136", errorScriptSource).addDetailMessage(e.getMessage());
        }
    }

    private static BrighticsCoreException handleEcmaError(EcmaError e, String errorScriptSource) {
        if ("ReferenceError".equals(e.getName())) {
            String undefinedName = getReferenceErrorName(e.getErrorMessage());
            return new BrighticsCoreException("3120", undefinedName);
        } else {
            return new BrighticsCoreException("3136", errorScriptSource).addDetailMessage(e.getErrorMessage());
        }
    }

    private static String getReferenceErrorName(String msg) {
        Matcher matcher = undefinedNamePattern.matcher(msg);
        if (matcher.matches()) {
            return matcher.group(1);
        }
        return null;
    }
}
