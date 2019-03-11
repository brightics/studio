package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Set;
import java.util.StringJoiner;
import java.util.regex.Pattern;

import org.mozilla.javascript.Context;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.variable.context.JsLibrary;
import com.samsung.sds.brightics.common.variable.scope.VariableScope;

public class MomentJsLibrary implements JsLibrary {

	private static final Logger LOGGER = LoggerFactory.getLogger(MomentJsLibrary.class);
	private static final String LINE_SEPARATOR = System.getProperty("line.separator");

	private String momentJsString;

	private synchronized String initLibrary() throws IOException {
		if (momentJsString == null) {
			Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
					.setUrls(ClasspathHelper.forPackage("com.samsung.sds.brightics.common.workflow.flowrunner.jslib")));
			Set<String> resources = reflections.getResources(Pattern.compile(".*\\.js"));
			for (String resource : resources) {
				if (resources.contains("moment.js")) {
					BufferedReader rd = new BufferedReader(new InputStreamReader(
							Thread.currentThread().getContextClassLoader().getResourceAsStream(resource)));
					String line;
					StringJoiner script = new StringJoiner(LINE_SEPARATOR);
					while ((line = rd.readLine()) != null) {
						script.add(line);
					}
					rd.close();
					momentJsString = script.toString();
				}
			}
		}
		return momentJsString;
	}

	@Override
	public void loadLibrary(VariableScope variableScope) {
		try {
			Context.enter();
			initLibrary();
			Context.getCurrentContext().evaluateString(variableScope.getScope(), momentJsString, "moment.js", 1, null);
			Context.exit();
		} catch (Exception e) {
			LOGGER.error("Failed to load lib, so ignored.", e);
		}
	}
}
