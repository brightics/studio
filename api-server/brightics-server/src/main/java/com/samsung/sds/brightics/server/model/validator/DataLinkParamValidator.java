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

package com.samsung.sds.brightics.server.model.validator;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.model.param.DataLinkParam;
import com.samsung.sds.brightics.server.model.param.DataLinkParam.DataLink;
import org.apache.commons.lang3.StringUtils;

public class DataLinkParamValidator {
    private static final String ERROR_CODE = "3102";

    public static void validateForPost(DataLinkParam dataLinkParam) {
        for (DataLink dataLink : dataLinkParam.getLinks()) {
            if (StringUtils.isEmpty(dataLink.getSource())) {
                throw new BrighticsCoreException(ERROR_CODE, "source should not be empty");
            }
            if (StringUtils.isEmpty(dataLink.getAlias())) {
                throw new BrighticsCoreException(ERROR_CODE, "alias should not be empty");
            }
            if (!dataLink.getSource().matches("/.+/.+/.+")) {
                throw new BrighticsCoreException(ERROR_CODE, "source pattern should be /{user}/{mid}/{tid}");
            }
            if (!dataLink.getAlias().matches("/.+/.+/.+")) {
                throw new BrighticsCoreException(ERROR_CODE, "alias pattern should be /{user}/{mid}/{tid}");
            }
            if (!dataLink.getAlias().startsWith("/" + AuthenticationUtil.getRequestUserId() + "/")) {
                throw new BrighticsCoreException(ERROR_CODE, "cannot make alias for other user");
            }
        }
    }

    public static void validateForDelete(DataLinkParam dataLinkParam) {
        for (DataLink dataLink : dataLinkParam.getLinks()) {
            if (StringUtils.isEmpty(dataLink.getAlias())) {
                throw new BrighticsCoreException(ERROR_CODE, "alias should not be empty");
            }
            if (!dataLink.getAlias().matches("/.+/.+/.+")) {
                throw new BrighticsCoreException(ERROR_CODE, "alias pattern should be /{user}/{mid}/{tid}");
            }
            if (!dataLink.getAlias().startsWith("/" + AuthenticationUtil.getRequestUserId() + "/")) {
                throw new BrighticsCoreException(ERROR_CODE, "cannot delete alias for other user");
            }
        }
    }
}
