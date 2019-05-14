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

package com.samsung.sds.brightics.common.core.exception.provider;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Set;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;

public class ExceptionProvider {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionProvider.class);

    private static Properties totalProp;

    public static void initExceptionProperties() {
        totalProp = new Properties();
        try {
            Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
                    .setUrls(ClasspathHelper.forPackage("com.samsung.sds.brightics.common.core.exception.provider")));
            Set<String> resources = reflections.getResources(Pattern.compile(".*\\.properties"));
            logger.info("exception message init");
            for (String resource : resources) {
                if (!resource.contains("label")
                        && resource.endsWith("." + StringUtils.lowerCase(SystemEnvUtil.CURRENT_LOCALE) + ".properties")) {
                    InputStream input = Thread.currentThread().getContextClassLoader().getResourceAsStream(resource);
                    Properties prop = new Properties();
                    prop.load(input);
                    totalProp.putAll(prop);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot initialize config properties.", e);
        }
    }

    public static String getExceptionMessage(String code) {
        if (totalProp == null || totalProp.isEmpty()) {
            initExceptionProperties();
        }
        return totalProp.getProperty(code, "Unknown exception message code " + code + ". contact administrator");
    }

    public static ArrayList<Entry<Object, Object>> getExceptionMessageList() {
        if (totalProp == null || totalProp.isEmpty()) {
            initExceptionProperties();
        }
        Set<Entry<Object, Object>> entrySet = totalProp.entrySet();
        return new ArrayList<Entry<Object, Object>>(entrySet);
    }

}
