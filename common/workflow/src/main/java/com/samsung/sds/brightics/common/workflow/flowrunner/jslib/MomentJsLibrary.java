package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.Set;
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

    @Override
	public void loadLibrary(VariableScope variableScope) {
		Context.enter();

		Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
				.setUrls(ClasspathHelper.forPackage("com.samsung.sds.brightics.common.workflow.flowrunner.jslib")));
		Set<String> resources = reflections.getResources(Pattern.compile(".*\\.js"));
		for (String resource : resources) {
			if (resources.contains("moment.js")) {
				try (Reader reader = new InputStreamReader(
						Thread.currentThread().getContextClassLoader().getResourceAsStream(resource))) {
					Context.getCurrentContext().evaluateReader(variableScope.getScope(), reader, "moment.js", 1, null);
				} catch (IOException e) {
					LOGGER.error("Failed to load lib, so ignored.", e);
				}
			}
		}
		
		Context.exit();
	}
}
