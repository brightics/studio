package com.samsung.sds.brightics.server.service;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.text.StringSubstitutor;
import org.apache.commons.text.lookup.StringLookup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.server.common.util.ValidationUtil;
import com.samsung.sds.brightics.server.model.entity.BrtcSql;
import com.samsung.sds.brightics.server.model.entity.repository.BrtcSqlRepository;

/**
 * This class of service manages the database 
 * The values ​​in the database are brought to the information that stored in the data source service. 
 * @author hk.im
 */
@Service
public class DatabaseService {

	@Autowired
    BrtcSqlRepository repo;

    static final String QUOTE_FORMAT = "'%s'";

    public String getSqlWithCondition(BrtcSql brtcSql) {
        BrtcSql targetSql = repo.findOne(brtcSql.getSqlId());
        ValidationUtil.throwIfEmpty(targetSql, "SQL for " + brtcSql.getSqlId());
        return formatSqlWithCondition(targetSql.getSql(), brtcSql.getCondition());
    }

    @SuppressWarnings("unchecked")
    private String formatSqlWithCondition(String sql, Map<String, Object> condition) {
        Map<String, String> parameterMap = new HashMap<>();
        if (condition != null) {
            condition.forEach((key, value) -> {
                Boolean quote = true;
                Object param = value;
                if(value instanceof Map){
                    //value has properties
					Map<String, Object> valueMap = (Map<String, Object>) value;
                    quote = (Boolean)valueMap.getOrDefault("quote", true);
                    param = valueMap.get("value");
                }
                parameterMap.put(key, convertObjectAsQueryParameter(param,quote));
                
            });
        }
        return formatParameters(sql, parameterMap);
    }

    @SuppressWarnings("unchecked")
    private String convertObjectAsQueryParameter(Object any, Boolean quote) {
        if (any == null)
            return null;
        if (any instanceof List) {
            return ((List<Object>) any).stream().map(i -> convertObjectAsQueryParameter(i, quote)).collect(Collectors.joining(","));
        } else if (any instanceof Double || any instanceof Integer) {
            return any.toString();
        } else if (any instanceof String) {
            if(quote) return String.format(QUOTE_FORMAT, (String) any); 
            else return (String) any;
        } else {
            return any.toString();
        }
    }

    private String formatParameters(String target, Map<String, String> valueMap) {
        if (target == null)
            return null;
        Set<String> absentParameters = new LinkedHashSet<>();
        StringSubstitutor replacer = new StringSubstitutor(new StringLookup() {
            @Override
            public String lookup(String key) {
                if (valueMap == null)
                    return null;
                if (key == null)
                    return null;
                final Object obj = valueMap.get(key.trim());
                if (obj == null) {
                    absentParameters.add(key);
                    return null;
                }
                return obj.toString();
            }
        });
        String result = replacer.replace(target);
        if(absentParameters.size() > 0){
            throw new BrighticsCoreException("3134", absentParameters.stream().collect(Collectors.joining(", ")));
        }
        return result;
    }

}
