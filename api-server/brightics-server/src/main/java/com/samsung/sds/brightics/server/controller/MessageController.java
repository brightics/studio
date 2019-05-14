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

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.server.model.vo.BrtcFunctionLabelVO;
import com.samsung.sds.brightics.server.model.vo.BrtcMessageVO;
import com.samsung.sds.brightics.server.service.MessageService;

@RestController
@RequestMapping("/api/core/v2")
public class MessageController {

	@Autowired
	private MessageService messageService;

	/**
	 *  GET     /api/core/v2/message/{code}/{locale}  							: get message by code
	 *  GET     /api/core/v2/message/{locale}           						: get message list
	 *  GET     /api/core/v2/functionlabel/{functionName}/{parameter}/{locale}  : get function label by code
     *  GET     /api/core/v2/functionlabel/{locale}                             : get function label list
     *  
	 *  **/
	
	@RequestMapping(value = "/message/{code}/{locale}", method = RequestMethod.GET)
	public BrtcMessageVO getMessageInfo(@PathVariable(required= true) String code,
			@PathVariable(required= false) String locale) {
		return messageService.getMessageInfo(code, locale);
	}
	
	@RequestMapping(value = {"/message", "/message/{locale}"}, method = RequestMethod.GET)
	public List<BrtcMessageVO> getMessageList(@PathVariable(required= false) String locale) {
		return messageService.getMessageList(locale);
	}
	
	@RequestMapping(value = "/functionlabel/{functionName}/{parameter}/{locale}", method = RequestMethod.GET)
	public BrtcFunctionLabelVO getFunctionLabelInfo(@PathVariable(required= true) String functionName
			, @PathVariable(required= true) String parameter, @PathVariable(required= false) String locale) {
		return messageService.getFunctionLabelInfo(functionName, parameter, locale);
	}
	@RequestMapping(value = {"/functionlabel", "/functionlabel/{locale}"}, method = RequestMethod.GET)
	public List<BrtcFunctionLabelVO> getFunctionLabelList(@PathVariable(required= false) String locale) {
		return messageService.getFunctionLabelList(locale);
	}
	
}
