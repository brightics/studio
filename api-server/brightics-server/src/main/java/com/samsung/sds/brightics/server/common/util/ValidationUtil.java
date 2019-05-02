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

package com.samsung.sds.brightics.server.common.util;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.ArrayUtils;

public class ValidationUtil {

    @SuppressWarnings("rawtypes")
    public static void throwIfEmpty(Object object, String name) {
        if (object == null) {
            throw new BrighticsCoreException("3002", name);
        } else {
            if (((object instanceof String) && StringUtils.isBlank((String) object))
                || ((object instanceof List) && CollectionUtils.isEmpty(((List) object)))
                || ((object instanceof Object[]) && ArrayUtils.isEmpty((Object[]) object))
                || ((object instanceof ArrayList) && (((ArrayList) object).size() == 0))
                || ((object instanceof Integer) && ((Integer) object == 0))) {
                // This %s doesn't exist.
                throw new BrighticsCoreException("3002", name);
            }
        }
    }

    public static void throwWhen(boolean condition, String code, String... params) {
        if (condition) {
            throw new BrighticsCoreException(code, params);
        }
    }

    public static void throwWhen(boolean condition, String code) {
        if (condition) {
            throw new BrighticsCoreException(code);
        }
    }

    public static void throwIfEmpty(JsonElement element, String name) {
        if (element == null) {
            throw new BrighticsCoreException("3109", name);
        } else {
            if ((element.isJsonPrimitive() && element.getAsJsonPrimitive().isString() && StringUtils.isBlank(element.getAsString()))
                || (element.isJsonObject() && element.getAsJsonObject().size() == 0)
                || (element.isJsonArray() && element.getAsJsonArray().size() == 0)) {
                throw new BrighticsCoreException("3109", name);
            }
        }
    }

    public static void validateRequiredMember(JsonObject object, String memberName) {
        throwWhen(object == null || !object.has(memberName), "3109", memberName);
    }
}
