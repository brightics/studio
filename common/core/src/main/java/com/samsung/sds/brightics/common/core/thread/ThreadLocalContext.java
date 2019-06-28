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
