package com.samsung.sds.brightics.agent.context;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import com.samsung.sds.brightics.common.network.proto.ContextType;

@Retention(RetentionPolicy.RUNTIME)
public @interface ScriptContext {
    ContextType contextType();
}
