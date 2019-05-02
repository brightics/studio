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

package com.samsung.sds.brightics.server.common.thread;

import java.util.ArrayList;
import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public abstract class ManagedThread extends Thread {

    private static final Logger logger = LoggerFactory.getLogger(ManagedThread.class);

    public abstract void main() throws Exception;

    private final java.util.List<ThreadListener> listeners = Collections.synchronizedList(new ArrayList<>());

    public void addListener(ThreadListener listener) {
        listeners.add(listener);
    }

    public void removeListener(ThreadListener listener) {
        listeners.remove(listener);
    }

    private final void notifyListeners() {
        synchronized (listeners) {
            for (ThreadListener listener : listeners) {
                listener.threadComplete(this);
            }
        }
    }

    public void run() {
        try {
            main();
        } catch(InterruptedException e){
            logger.warn("Running flow jobId["+this.getName() + "] is interrupted.");
        } catch (Exception e) {
            logger.error("Error while running managed thread.", e);
        } finally {
            notifyListeners();
        }
    }
}
