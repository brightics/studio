package com.samsung.sds.brightics.common.workflow.runner.jslib;

import com.samsung.sds.brightics.common.variable.context.JsLibrary;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import org.mozilla.javascript.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MomentJsLibrary implements JsLibrary {

    private static final Logger LOGGER = LoggerFactory.getLogger(MomentJsLibrary.class);

    @Override
    public void loadLibrary(VariableScope variableScope) {
        Context.enter();
        try (Reader reader = new InputStreamReader(getClass().getResourceAsStream("/rhino/template/moment.js"))) {
            Context.getCurrentContext().evaluateReader(variableScope.getScope(), reader, "moment.js", 1, null);
        } catch (IOException e) {
            LOGGER.error("Failed to load lib, so ignored.", e);
        }
        Context.exit();
    }
}
