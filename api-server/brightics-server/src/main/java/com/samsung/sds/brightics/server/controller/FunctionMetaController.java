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

package com.samsung.sds.brightics.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.service.FunctionMetaService;

@RestController
@RequestMapping("/api/core/v3/function")
public class FunctionMetaController {
	
	@Autowired
	private FunctionMetaService functionMetaService;
	
	/**
	 * GET     /api/core/v3/function/meta 								: get function meta list
	 * GET     /api/core/v3/function/meta/{func}						: get function meta by func
	 * GET     /api/core/v3/function/help								: get function help list
	 * GET     /api/core/v3/function/help/{name}						: get function help by name
	 * GET     /api/core/v3/function/label 								: get function label list
	 * GET     /api/core/v3/function/label/{functionname}/{parameter} 	: get function label
	 */
	
	@RequestMapping(value ="/meta", method = RequestMethod.GET)
	public Object getFunctionMetaList(){
		return functionMetaService.getFunctionMetaList();
	}

	@RequestMapping(value ="/meta/{func:.+}", method = RequestMethod.GET)
	public Object getFunctionMeta(@PathVariable(required= true) String func){
		return functionMetaService.getFunctionMeta(func);
	}
	
	@RequestMapping(value ="/help", method = RequestMethod.GET)
	public Object getFunctionHelpList(){
		return functionMetaService.getFunctionHelpList();
	}
	
	@RequestMapping(value ="/help/{name:.+}", method = RequestMethod.GET)
	public Object getFunctionHelp(@PathVariable(required= true) String name){
		return functionMetaService.getFunctionHelp(name);
	}
	
	@RequestMapping(value ="/label", method = RequestMethod.GET)
	public Object getFunctionLabelList(){
		return functionMetaService.getFunctionLabelList();
	}

	@RequestMapping(value = "/label/{functionname:.+}/{parameter}", method = RequestMethod.GET)
	public Object getFunctionLabel(@PathVariable(required = true) String functionname,
			@PathVariable(required = true) String parameter) {
		return functionMetaService.getFunctionLabel(functionname, parameter);
	}

	@RequestMapping(value = "/refresh", method = RequestMethod.GET)
	public void refreshFucntionMeta() {
		functionMetaService.refreshFucntionMeta();
	}
}
