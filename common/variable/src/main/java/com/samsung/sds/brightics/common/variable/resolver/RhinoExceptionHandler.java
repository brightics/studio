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
