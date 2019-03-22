package com.samsung.sds.brightics.common.workflow.flowrunner.jslib;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Set;
import java.util.regex.Pattern;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Kit;
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

	private static MomentJsLibrary instance;

	synchronized static public MomentJsLibrary getInstance() {
		if (instance == null) {
			instance = new MomentJsLibrary();
		}
		return instance;
	}

	private String momentJsString;

	private MomentJsLibrary() {
		try {
			initLibrary();
		} catch (IOException e) {
			LOGGER.error("Failed to load lib, so ignored.", e);
		}
	}

	private synchronized void initLibrary() throws IOException {
		if (momentJsString == null) {
			Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
					.setUrls(ClasspathHelper.forPackage("com.samsung.sds.brightics.common.workflow.flowrunner.jslib")));
			Set<String> resources = reflections.getResources(Pattern.compile("moment.js"));
			for (String resource : resources) {
				InputStreamReader rd = new InputStreamReader(
						Thread.currentThread().getContextClassLoader().getResourceAsStream(resource));
				momentJsString = Kit.readReader(rd);
				rd.close();
			}
		}
	}

	@Override
	public void loadLibrary(VariableScope variableScope) {
		try {
			Context cx = Context.enter();
			cx.setOptimizationLevel(-1);
			initLibrary();
			cx.evaluateString(variableScope.getScope(), momentJsString, "moment.js", 1, null);
			Context.exit(); 
		} catch (Exception e) {
			LOGGER.error("Failed to load lib, so ignored.", e);
		}
	}
}
