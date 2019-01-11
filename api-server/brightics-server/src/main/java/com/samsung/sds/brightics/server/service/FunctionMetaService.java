package com.samsung.sds.brightics.server.service;

import org.springframework.stereotype.Service;

import com.samsung.sds.brightics.server.common.util.FunctionPropertiesUtil;

@Service
public class FunctionMetaService {

	public Object getFunctionMeta(String func) {
		return FunctionPropertiesUtil.getFunctionMeta(func);
	}

	public Object getFunctionMetaList() {
		return FunctionPropertiesUtil.getFunctionMetaList();
	}

	public Object getFunctionHelpList() {
		return FunctionPropertiesUtil.getFunctionHelpList();
	}

	public Object getFunctionHelp(String name) {
		return FunctionPropertiesUtil.getFunctionHelp(name);
	}

	public Object getFunctionLabelList() {
		return FunctionPropertiesUtil.getFunctionLabelList();
	}

	public Object getFunctionLabel(String functionName, String parameter) {
		return FunctionPropertiesUtil.getFunctionLabel(functionName, parameter);
	}

	public void refreshFucntionMeta() {
		FunctionPropertiesUtil.refreshFunctionProperties();
	}

}
