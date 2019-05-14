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
