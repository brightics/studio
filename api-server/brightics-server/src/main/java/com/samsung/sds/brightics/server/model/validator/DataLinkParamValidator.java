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
