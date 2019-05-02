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

package com.samsung.sds.brightics.common.variable.scope;

import com.samsung.sds.brightics.common.variable.storage.AbstractScriptableStorage;
import java.util.concurrent.atomic.AtomicInteger;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.Scriptable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * VariableScope is wrapper class of Scriptable object.
 * It connects Scriptable to ScriptableStorage to do backup.
 *
 * @author jb.jung
 */
public class VariableScope {

    private static final Logger LOGGER = LoggerFactory.getLogger(VariableScope.class);

    private final String name;
    private final Scriptable scope;
    private AbstractScriptableStorage backupStorage;
    private final AtomicInteger scriptRunCounter = new AtomicInteger(0);
    private boolean backupAvailable = false;


    /**
     * Constructs a newly allocated VariableScope object that represents the scope argument.
     */
    public VariableScope(String name, Scriptable scope) {
        super();
        this.name = name;
        this.scope = scope;
    }

    /**
     * Given AbstractScriptableStorage, it first tries to read object from that storage.
     * If there is no object, new Scriptable object will be created.
     * Also the backup function turns on after the creation.
     */
    public VariableScope(String name, AbstractScriptableStorage storage) {
        super();
        this.name = name;
        this.scope = storage.getScriptable();
        setBackupStorage(storage);
    }

    public String getName() {
        return name;
    }

    public Scriptable getScope() {
        return scope;
    }

    public final void setBackupStorage(AbstractScriptableStorage storage) {
        this.backupStorage = storage;
        backupAvailable = true;
    }

    /**
     * Executes javascript on this scope.
     * Specified debug name appears at stacktrace when the given script causes errors.
     */
    public synchronized Object evaluate(String debugName, String script) {
        try {
            Context cx = Context.enter();
            scriptRunCounter.getAndIncrement();
            Object result = cx.evaluateString(scope, script, debugName, 1, null);
            backup();
            return result;
        } finally {
            Context.exit();
        }
    }

    /**
     * Tries to backup this scope.
     * If no variable storage is associated with this, it does nothing.
     */
    public void backup() {
        if (backupAvailable) {
            try {
                Context.enter();
                Scriptable parent = this.scope.getParentScope();
                this.scope.setParentScope(null);
                backupStorage.writeScriptable(this.scope);
                this.scope.setParentScope(parent);
            } catch (Exception e) {
                LOGGER.warn("VariableScope [" + name + "] fails to backup. Backup function will be disabled and storage will be closed.");
                backupStorage.close();
                backupAvailable = false;
            } finally {
                Context.exit();
            }
        }
    }

}
