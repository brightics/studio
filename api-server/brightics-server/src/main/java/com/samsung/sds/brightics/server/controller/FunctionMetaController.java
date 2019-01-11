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
