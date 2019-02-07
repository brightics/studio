package com.samsung.sds.brightics.common.core.util;

import org.slf4j.MDC;

/**
 * Created by brightics on 17. 7. 31.
 * TODO: implement AutoCloseable
 */
public class LoggerUtil {

    public static void pushMDC(String key, String val) {
        MDC.put(key, val);
        String indent = "";
        if (MDC.get("indent") != null) {
            indent = MDC.get("indent");
        }
        MDC.put("indent", indent + "  ");
    }

    public static void popMDC(String key) {
        MDC.remove(key);
        MDC.put("indent", MDC.get("indent").substring(2));
    }
}
