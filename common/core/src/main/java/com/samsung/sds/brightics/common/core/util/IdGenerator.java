package com.samsung.sds.brightics.common.core.util;

import java.util.UUID;

public class IdGenerator {
    public static String getSimpleId(){
        String fullId = getFullId();
        return fullId.substring(0,fullId.indexOf("-"));
    }
    public static String getFullId(){
        return UUID.randomUUID().toString();
    }
}
