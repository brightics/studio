package com.samsung.sds.brightics.common.core.legacy.provider;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;
import java.util.Set;
import java.util.Map.Entry;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.core.exception.provider.ExceptionProvider;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;

public class LegacyFunctionLabelProvider {

	private static final Logger logger = LoggerFactory.getLogger(ExceptionProvider.class);

	private static Properties totalProp;

	public static void initFunctionLabelProperties() {
		totalProp = new Properties();
		try {
			Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
					.setUrls(ClasspathHelper.forPackage("com.samsung.sds.brightics.common.core.legacy.exception")));
			Set<String> resources = reflections.getResources(Pattern.compile(".*\\.properties"));
			logger.info("function label init");
			for (String resource : resources) {
				if (resource.contains("functionlabel")
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

	public static String[] getFunctionLabel(String functionName, String[] params) {
		if (totalProp == null) {
			initFunctionLabelProperties();
		}
		
		String[] labels = new String[params.length];
		for (int i = 0; i < params.length; i++) {
			String key = functionName + "." + params[i];
			String label = totalProp.getProperty(key);
			if(label == null) {
				labels[i] = params[i];
			} else {
				labels[i] = label;
			}
		}
		return labels;
	}

	public static String getFunctionLabel(String functionName, String parameter) {
		if (totalProp == null) {
			initFunctionLabelProperties();
		}
		String key = functionName + "." + parameter;
		return totalProp.getProperty(key, key);
	}

	public static ArrayList<Entry<Object, Object>> getFunctionLabelList() {
		if (totalProp == null) {
			initFunctionLabelProperties();
		}
		Set<Entry<Object, Object>> entrySet = totalProp.entrySet();
		return new ArrayList<Entry<Object, Object>>(entrySet);
	}

}
