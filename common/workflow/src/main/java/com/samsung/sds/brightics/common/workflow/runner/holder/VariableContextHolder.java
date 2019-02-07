package com.samsung.sds.brightics.common.workflow.runner.holder;

import java.io.File;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.variable.context.VariableContext;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;
import com.samsung.sds.brightics.common.variable.storage.impl.LocalFsStorage;
import com.samsung.sds.brightics.common.workflow.runner.jslib.MomentJsLibrary;

public class VariableContextHolder {

    private static final Logger LOGGER = LoggerFactory.getLogger(VariableContextHolder.class);

    private Map<String, VariableContext> variableContextMap = new ConcurrentHashMap<>();
    private String variableRepo;
    
	public VariableContextHolder(String variableRepo){
    	this.variableRepo = variableRepo;
    }
    
    public VariableContext getUserVariableContext(String user) {
        return Optional.ofNullable(variableContextMap.get(user))
                .orElseGet(() -> {
                    VariableContext newVariableContext = new VariableContext(getUserVariableScope(user));
                    newVariableContext.addJsLibrary(new MomentJsLibrary());
                    return newVariableContext;
                });
    }

    private VariableScope getUserVariableScope(String user) {
        File repoDir = new File(variableRepo);
        if (!repoDir.exists() && !repoDir.mkdir()) {
            LOGGER.debug("{} already exists", variableRepo);
        }

        VariableScope userScope = new VariableScope("user",
                new LocalFsStorage(variableRepo + "/" + user + ".v"));

        userScope.evaluate("user", "var sys = sys || {}");
        userScope.evaluate("user", "sys.user = '" + user + "'");

        return userScope;
    }

    public void clearVariableContext(String user) {
        variableContextMap.remove(user);
    }

}
