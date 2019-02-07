package com.samsung.sds.brightics.common.workflow.runner;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.workflow.context.parameter.Parameters;
import com.samsung.sds.brightics.common.workflow.runner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobParam;
import com.samsung.sds.brightics.common.workflow.runner.vo.JobStatusVO;

public class FlowRunnerContextTest {

	private static final Logger logger = LoggerFactory.getLogger(FlowRunnerContextTest.class);

	public class JobRunnerApiTest implements IJobRunnerApi {
		@Override
		public String executeTask(String taskId, String name, String parameters, String attributes) {
			logger.info("executeTask : " + taskId);
			return null;
		}

		@Override
		public boolean isFinishTask(String taskId) {
			logger.info("isFinishTask : " + taskId);
			return true;
		}

		@Override
		public Object getTaskResult(String taskId) {
			return null;
		}

		@Override
		public void stopTask(String stopTaskId, String functionName, String context) {
		}

		@Override
		public void updateJobStatus(JobParam jobParam, JobStatusVO jobStatusVO) {
		}

		@Override
		public Object getDatasourceInfo(String datasourceName) {
			return null;
		}

		@Override
		public String getScriptWithParam(Parameters params) {
			return null;
		}

		@Override
		public boolean isMetadataRequest(JsonObject json) {
			return false;
		}

		@Override
		public JsonElement convert(JsonObject json) {
			return null;
		}

		@Override
		public Object getData(String mid, String tid, long min, long max) {
			return null;
		}

		@Override
		public void addDataAlias(String source, String alias) {
		}

	}

	@Test
	public void initFlowRunnerContextTest() {

		String testjob = "{'main':'mph5bmch635mamuc','models':{'mph5bmch635mamuc':{'variables':{},'variableRef':[],'innerModels':{},'inData':[],'outData':[],'type':'data','param':{},'functions':[{'persist-mode':'auto','func':'load','name':'Subflow','outData':['tfasncdwbmuakf7c'],'param':{'functions':[{'fid':'f7ck3sqa7k9assmx','func':'load','name':'InOutData','outData':['tfasncdwbmuakf7c'],'param':{'io-mode':'read','fs-type':'alluxiocsv','df-names':['tfasncdwbmuakf7c'],'fs-paths':['/shared/upload/sample_iris.csv']},'persist':true,'label':'Load'}],'entries':['f7ck3sqa7k9assmx']},'fid':'f87u9eyp7yubqf2s','label':'Load','persist':true,'skip':false},{'persist-mode':'auto','func':'kMeans212345','name':'KMeans2','param':{'maxIter':30,'initMode':'k-means||','initSteps':5,'tol':0.0001,'inputCols':['sepal_length','sepal_width','petal_length','petal_width'],'k':-1},'meta':{'inTable':{'type':'table'},'outTable':{'type':'table'},'outSummary':{'type':'model'}},'context':'scala','version':'3.6','inputs':{'inTable':'tfasncdwbmuakf7c'},'outputs':{'outTable':'txmmwsxavjkad542','outSummary':'t8qvkujfevvb2ah9'},'fid':'fvp7f7sb67bjxzyj','label':'K-Means','persist':true,'skip':false}],'links':[{'kid':'kx86uws77ssxxspg','sourceFid':'f87u9eyp7yubqf2s','targetFid':'fvp7f7sb67bjxzyj'}],'mid':'mph5bmch635mamuc','title':'test','persist-mode':'auto','diagram':{'PAPER_MARGIN_TOP':20,'PAPER_MARGIN_LEFT':20,'FIGURE_WIDTH':195,'FIGURE_HEIGHT':60,'GAP_WIDTH':55,'GAP_HEIGHT':40},'entries':['f87u9eyp7yubqf2s'],'optModels':{}}},'version':'3.5'}";

		JobParam fromJson = JsonUtil.fromJson(testjob, JobParam.class);
		fromJson.setUser("testuser");
		fromJson.setJid("testjobId");
		JobRunnerApiTest jobRunnerApiTest = new JobRunnerApiTest();
		JobRunner jobRunner = JobRunnerBuilder.builder().setApiInterface(jobRunnerApiTest).config(new JobRunnerConfig())
				.create(fromJson);
		jobRunner.run();

	}

}
