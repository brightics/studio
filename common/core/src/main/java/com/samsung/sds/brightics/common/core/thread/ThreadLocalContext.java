package com.samsung.sds.brightics.common.core.thread;

import java.util.HashMap;
import java.util.Map;

public class ThreadLocalContext {

    protected static ThreadLocal<Map<String, Object>> tl = new ThreadLocal<Map<String, Object>>() {
        @Override
        protected Map<String, Object> initialValue() {
            return new HashMap<String, Object>();
        }
    };
    
    public static void setThreadLocal(ThreadLocal<Map<String,Object>> newTl){
        tl = newTl;
    }

    public static Object get(String key) {
        return tl.get().get(key);
    }

    public static Object getOrDefault(String key, String defaultValue) {
        return tl.get().getOrDefault(key, defaultValue);
    }

    public static void put(String key, Object value) {
        tl.get().put(key, value);
    }

    public static void remove(String key) {
        tl.get().remove(key);
    }

}
