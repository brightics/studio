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

package com.samsung.sds.brightics.common.core.util;

import org.apache.commons.lang3.math.NumberUtils;

public class SystemEnvUtil {
    public static String getEnvOrPropOrElse(String key, String propKey, String defaultValue) {
        String env = System.getenv(key);
        if (env == null) {
            String prop = System.getProperty(propKey, defaultValue);
            return prop;
        } else
            return env;
    }

    public static String BRIGHTICS_DATA_ROOT;
    public static String ARRAY_LIMIT;
    public static Integer LOOP_LIMIT;
    public static String CURRENT_LOCALE;
    
    public static String BRIGHTICS_AGENT_HOST;
    public static String BRIGHTICS_SERVER_HOST;
    public static String BRIGHTICS_SERVER_PORT;
    
    public static boolean IS_SPARK_USE;
    public static String BRIGHTICS_AGENT_HOME;
    public static String BRIGHTICS_SERVER_HOME;
    public static String PID_PATH;
    public static int IDLE_TIME_MIN;
    
    public static void refresh(){
        BRIGHTICS_DATA_ROOT = getEnvOrPropOrElse("BRIGHTICS_DATA_ROOT", "brightics.data.root", "");
        ARRAY_LIMIT = getEnvOrPropOrElse("ARRAY_LIMIT", "brightics.array.limit", "100");
        LOOP_LIMIT = NumberUtils
                .toInt(getEnvOrPropOrElse("LOOP_LIMIT", "brightics.loop.limit", ""), 1000000);
        CURRENT_LOCALE = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_LOCALE", "brightics.locale",
                "en");
        
        BRIGHTICS_AGENT_HOST = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_AGENT_HOST","brightics.agent.host", "localhost");
        BRIGHTICS_SERVER_HOST = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_SERVER_HOST","brightics.server.host", "localhost");
        BRIGHTICS_SERVER_PORT = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_SERVER_PORT","brightics.server.port", "9098");
        
        IS_SPARK_USE = Boolean.parseBoolean(SystemEnvUtil.getEnvOrPropOrElse("IS_SPARK_USE","brightics.agent.useSpark", "false"));
        BRIGHTICS_AGENT_HOME = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_AGENT_HOME","brightics.agent.home",".");
        BRIGHTICS_SERVER_HOME = SystemEnvUtil.getEnvOrPropOrElse("BRIGHTICS_SERVER_HOME", "brightics.server.home", ".");
        PID_PATH = SystemEnvUtil.getEnvOrPropOrElse("PID_PATH", "brightics.agent.pidPath",BRIGHTICS_AGENT_HOME + "/pid");
        IDLE_TIME_MIN = Integer.parseInt(SystemEnvUtil.getEnvOrPropOrElse("IDLE_TIME_MIN", "brightics.agent.idleTimeMin","60"));
    }
    
    static {
        refresh();
    }
}
