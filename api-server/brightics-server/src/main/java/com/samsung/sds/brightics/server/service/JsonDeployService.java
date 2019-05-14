package com.samsung.sds.brightics.server.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.PreparedDataVO;
import com.samsung.sds.brightics.server.common.util.AuthenticationUtil;
import com.samsung.sds.brightics.server.common.util.ResultMapUtil;
import com.samsung.sds.brightics.server.service.repository.JobRepository;

@Service
public class JsonDeployService {

	private static final Logger logger = LoggerFactory.getLogger(JsonDeployService.class);

	@Autowired
	private JobService jobService;
	
    @Value("${brightics.jsonflow.path:./jsonflow}")
    private String JSON_FLOW_PATH;

    @PostConstruct
    private void initDirectory(){
    	createDirectory(JSON_FLOW_PATH);
    }
    
	private void createDirectory(String path) {
		File filePath = new File(path);
		if (!filePath.exists()) {
			logger.info("mkdir path : " + path);
			filePath.mkdirs();
		}
	}

	public Map<String, String> getDeployedModelList() {
		try {
			Map<String, String> modelList = new HashMap<>();
			for (File jsonModel : new File(JSON_FLOW_PATH).listFiles()) {
				String name = jsonModel.getName();
				modelList.put(name, FileUtils.readFileToString(jsonModel, "UTF-8"));
			}
			return modelList;
		} catch (IOException e) {
			logger.error("Cannot get json deploy model list.", e);
			throw new BrighticsCoreException("3453");
		}
	}

	public String getDeployedModelBody(String name) {
		try {
			return FileUtils.readFileToString(new File(JSON_FLOW_PATH + File.separator + name + ".json"), "UTF-8");
		} catch (IOException e) {
			logger.error("Cannot get json deploy model. name : " + name, e);
			throw new BrighticsCoreException("3453");
		}
	}
    
	public Map<String, Object> deployJsonFileFromFlow(String name, String modelJson) {
		String path = JSON_FLOW_PATH + File.separator + name + ".json";
		logger.info("Deploy JSON File to " + path);
		try {
			FileUtils.write(new File(path), modelJson, "UTF-8");
			return ResultMapUtil.success("success to deploy JSON file in server.");
		} catch (IOException e) {
			logger.error("exception while deploy JSON file to server. " + ExceptionUtils.getStackTrace(e));
			throw new BrighticsCoreException("3454", e.getMessage());
		}
	}
    
	public Map<String, Object> executeJsonDeployModel(String name, String user, String jid,
			Map<String, Object> globalVariable, List<PreparedDataVO> preparedDatas) { 
        String path = JSON_FLOW_PATH + File.separator + name + ".json";
		JobParam jobParam = getJobParamFromJsonFile(path);
        complementJobParam(user, jid, globalVariable, preparedDatas, jobParam);
        
        return jobService.executeJob(jobParam, JobRepository.JOB_BY_JSONMODEL);
    }

	private void complementJobParam(String user, String jid, Map<String, Object> globalVariable,
			List<PreparedDataVO> preparedDatas, JobParam jobParam) {
		if (StringUtils.isNotEmpty(jid)) {
            jobParam.setJid(jid);
        } else {
            jobParam.setJid(JobRepository.getRandomId("j"));
        }
        
        if (StringUtils.isNotEmpty(user)) {
        	jobParam.setUser(user);
        } else {
        	jobParam.setUser(AuthenticationUtil.getRequestUserId());
        }
        
        if(preparedDatas != null) {
        	jobParam.setDatas(preparedDatas);
        }

        if(globalVariable != null) {
        	jobParam.overrideVariables(JsonUtil.toJsonObject(globalVariable));
        }
	}

	private JobParam getJobParamFromJsonFile(String path) {
		try {
            return new ObjectMapper().readValue(FileUtils.readFileToString(new File(path), "UTF-8"), JobParam.class);
        } catch (IOException e) {
            logger.error("Cannot execute json deply model.", e);
            throw new BrighticsCoreException("3453");
        }
	}
	
}
