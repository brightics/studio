package com.samsung.sds.brightics.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import com.samsung.sds.brightics.common.core.legacy.provider.LegacyFunctionLabelProvider;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.server.model.vo.BrtcFunctionLabelVO;
import com.samsung.sds.brightics.server.model.vo.BrtcMessageVO;

@Service
public class MessageService {

    public BrtcMessageVO getMessageInfo(String code, String locale) {
        // skip request locale.
        String exceptionMessage = ExceptionProvider.getExceptionMessage(code);
        return new BrtcMessageVO(code, SystemEnvUtil.CURRENT_LOCALE, exceptionMessage);
    }

    public List<BrtcMessageVO> getMessageList(String locale) {
        // skip request locale.
        List<BrtcMessageVO> brtcMessageVOList = new ArrayList<>();
        ArrayList<Entry<Object, Object>> exceptionMessageList = ExceptionProvider.getExceptionMessageList();
        for (Entry<Object, Object> entry : exceptionMessageList) {
            brtcMessageVOList.add(new BrtcMessageVO(String.valueOf(entry.getKey()), SystemEnvUtil.CURRENT_LOCALE,
                    String.valueOf(entry.getValue())));
        }
        return brtcMessageVOList;
    }

    public BrtcFunctionLabelVO getFunctionLabelInfo(String functionName, String parameter, String locale) {
        // skip request locale.
        String label = LegacyFunctionLabelProvider.getFunctionLabel(functionName, parameter);
        return new BrtcFunctionLabelVO(functionName, parameter, SystemEnvUtil.CURRENT_LOCALE, label);
    }

    public List<BrtcFunctionLabelVO> getFunctionLabelList(String locale) {
        // skip request locale.
        List<BrtcFunctionLabelVO> brtcFunctionLabelVOList = new ArrayList<>();
        ArrayList<Entry<Object, Object>> functionLabelList = LegacyFunctionLabelProvider.getFunctionLabelList();
        for (Entry<Object, Object> entry : functionLabelList) {
            String key = String.valueOf(entry.getKey());
            String[] splitKey = key.split("[.]");
            int length = splitKey.length;
            String[] keyArr = new String[length-1];
            for (int i = 0; i < length - 1; i++) {
            	keyArr[i] = splitKey[i];
			}
            
            String functionName = StringUtils.join(keyArr, '.');
            String parameter = splitKey[length-1];
            brtcFunctionLabelVOList.add(new BrtcFunctionLabelVO(functionName, parameter, SystemEnvUtil.CURRENT_LOCALE,
                    entry.getValue().toString()));
        }
        return brtcFunctionLabelVOList;
    }

}
