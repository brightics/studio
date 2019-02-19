package com.samsung.sds.brightics.server.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.server.service.JsonDeployService;

@RestController
@RequestMapping({ "/api/core/v2/jsondeploy", "/api/core/v3/event" })
public class JsonDeployController {

	@Autowired
	private JsonDeployService jsonDeployService;

	/**
	 * GET /api/core/v3/event/flows : get saved flow model list.
	 * GET /api/core/v3/event/flow/{flowname} : get saved flow model body.
	 * POST /api/core/v3/event/deployflow/{filename} : save flow model.
	 * POST /api/core/v3/event/executeflow/{flowname} : execute flow model.
	 */
	
	@RequestMapping(value = "/flows", method = RequestMethod.GET)
	public Object getflows() {
		return jsonDeployService.getDeployedModelList();
	}

	@RequestMapping(value = "/flow/{name}", method = RequestMethod.GET)
	public Object getflowBody(@PathVariable String name) {
		return jsonDeployService.getDeployedModelBody(name);
	}

	@RequestMapping(value = "/executeflow/{flowname}", method = RequestMethod.POST)
	public Map<String, Object> executeFlowFromJsonFile(@PathVariable String flowname, @RequestBody JobParam param) {
		return jsonDeployService.executeJsonDeployModel(flowname, param.getUser(), param.getJid(), param.getArgs(),
				param.getDatas());
	}

	@RequestMapping(value = "/deployflow/{filename}", method = RequestMethod.POST)
	public Map<String, Object> deployJsonFileFromFlow(@PathVariable String filename, @RequestBody String jsonString) {
		return jsonDeployService.deployJsonFileFromFlow(filename, jsonString);
	}

}
