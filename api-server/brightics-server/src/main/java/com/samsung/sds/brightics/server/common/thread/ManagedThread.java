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
