package com.samsung.sds.brightics.server.service.repository;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.samsung.sds.brightics.server.model.vo.JobStatusVO;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;

/**
 * Repository for managing jobs.
 */
@Component
public class JobRepository {
 
	private static final Logger logger = LoggerFactory.getLogger(JobRepository.class);
	private static final Logger joblogger = LoggerFactory.getLogger("job-log");

	public static final String JOB_BY_DEPLOYMODEL = "DEPLOYMODEL";
	public static final String JOB_BY_JSONMODEL = "JSONMODEL";
	public static final String JOB_BY_SCHEDULER = "SCHEDULER";
	public static final String JOB_BY_STREAMCLIENT = "STREAMCLIENT";
	public static final String JOB_BY_ERROR_MODEL = "JOBERRORMODEL";
	public static final String JOB_BY_API = "API";
	
	public static final String STATE_WAITING = "WAIT";
	public static final String STATE_PROCESSING = "PROCESSING";
	public static final String STATE_DONE = "DONE";
	public static final String STATE_SUCCESS = "SUCCESS";
	public static final String STATE_FAIL = "FAIL";
	public static final String INVALID_JOBID_MESSAGE = "INVALID_JOBID";
	public Map<String, List<String>> dlJobIdAsTaskid = new ConcurrentHashMap<>();
	
	private LoadingCache<String, JobStatusVO> jobStatusCache;
	private static Map<String, JobStatusVO> jobStatusMap = new ConcurrentHashMap<String, JobStatusVO>();

	@PostConstruct
	public void init() {
		int expiremin = 5;
		Config configObject = ConfigFactory.load();
		try {
			if (configObject.getInt("brightics.jobstatus.expiremin") != 0) {
				expiremin = configObject.getInt("brightics.jobstatus.expiremin");
			}
		} catch (Exception e) {
			logger.debug("default brightics.jobstatus.expiremin (5 min)");
		}

		jobStatusCache = CacheBuilder.newBuilder().expireAfterAccess(expiremin, TimeUnit.MINUTES)
				.build(new CacheLoader<String, JobStatusVO>() {
					@Override
					public JobStatusVO load(String key) throws Exception {
						return null;
					}
				});
	}

	public JobStatusVO getJobStatus(String jobId) {
	    if(jobStatusMap.containsKey(jobId)){
	        //job status is running.
	        return jobStatusMap.get(jobId);
	    } else {
	        //job status is finish.
	        return jobStatusCache.getIfPresent(jobId);
	    }
	}

	public void saveJobStatus(String jobId, JobStatusVO jobStatusDTO) {
	    jobStatusMap.put(jobId, jobStatusDTO);
	}

	//change job status to cache memory, remove thread.
	public void finishJob(String jobId) {
	    JobStatusVO finishjobStatus = jobStatusMap.get(jobId);
	    jobStatusCache.put(jobId, finishjobStatus);
	    jobStatusMap.remove(jobId);
	}

	public List<JobStatusVO> getJobStatusList() {
		List<JobStatusVO> jobStatusList = new ArrayList<JobStatusVO>();
		for (JobStatusVO jobStatus : jobStatusCache.asMap().values()) {
			jobStatusList.add(jobStatus);
		}
		for (JobStatusVO jobStatus : jobStatusMap.values()) {
		    jobStatusList.add(jobStatus);
		}
		return jobStatusList;
	}

	public void insertJobStatusLog(JobStatusVO jobStatusDTO, String agentId) {

		long currentTimeMillis = System.currentTimeMillis();
		Date beginData = new Date(jobStatusDTO.getBegin());
		Date endData = new Date(currentTimeMillis);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
		String result = jobStatusDTO.getStatus();
		if (jobStatusDTO.getStatus().equals(STATE_SUCCESS)) {
			result = "SUCC";
		}
		String beginFormData = sdf.format(beginData);
		String endFormData = sdf.format(endData);
		long elapseMillis = currentTimeMillis - jobStatusDTO.getBegin();
		int elapseSec = (int) (elapseMillis / 1000);
		String logInfo = "{\"jid\":\"" + jobStatusDTO.getJobId() + "\" ,\"user\":\"" + jobStatusDTO.getUser() + "\" ,\"agent\":\"" + agentId
				+ "\" ,\"start\":\"" + beginFormData + "\" ,\"end\":\"" + endFormData + "\" ,\"elapse\":\"" + elapseSec
				+ "\" ,\"result\":\"" + result + "\"}";

		joblogger.info(logInfo);
	}
	
	public static String getRandomId(String init){
		return init+"_"+UUID.randomUUID().toString().replace("-", "")+"_" + new SimpleDateFormat("yyyyMMddHHmmssSSSS").format(new Date());
	}

}
