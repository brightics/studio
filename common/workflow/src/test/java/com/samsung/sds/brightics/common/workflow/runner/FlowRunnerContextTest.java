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

	public class JobRunnerApiTest extends AbsJobRunnerApi {
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

		String testjob = "{'main':'mgb2v6pmcg6ktfk6','models':{'mgb2v6pmcg6ktfk6':{'variables':{},'variableRef':[],'innerModels':{},'inData':[],'outData':[],'type':'data','param':{},'functions':[{'persist-mode':'auto','func':'brightics.function.io$load13889','name':'brightics.function.io$load','param':{'partial_path':['/brightics@samsung.com/upload/sample_iris.csv']},'meta':{'table':{'type':'table'}},'context':'python','version':'3.6','outputs':{'table':'tx3zcjkzxtut65gs'},'fid':'f5rjwgm6azcx3cnt','label':'Load','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.statistics$profile_table22844','name':'brightics.function.statistics$profile_table','param':{'check_correlation':false,'group_by':['species']},'meta':{'table':{'type':'table'},'result':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'tx3zcjkzxtut65gs'},'outputs':{'result':'tf86zzqj7nk96qfq'},'fid':'fbjmbmaywre4bmyb','label':'Profile Table','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.statistics$pairplot98411','name':'brightics.function.statistics$pairplot','param':{'kind':'scatter','diag_kind':'auto','dropna':true,'x_vars':['sepal_length','sepal_width','petal_length','petal_width'],'hue':'species'},'meta':{'table':{'type':'table'},'result':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'tx3zcjkzxtut65gs'},'outputs':{'result':'tbusv26w9m3w6gmc'},'fid':'fvkhfhdk4jc9er2a','label':'Pair Plot','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.transform$split_data','name':'brightics.function.transform$split_data','param':{},'meta':{'table':{'type':'table'},'train_table':{'type':'table'},'test_table':{'type':'table'}},'context':'python','version':'3.6','inputs':{'table':'tx3zcjkzxtut65gs'},'outputs':{'train_table':'tym6y2j4puhymzg6','test_table':'tqxz978puuedzus3'},'fid':'f8p3qxm8sbhbedd4','label':'Split Data','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.classification$decision_tree_classification_train12559','name':'brightics.function.classification$decision_tree_classification_train','param':{'criterion':'gini','splitter':'best','feature_cols':['sepal_length','sepal_width','petal_length','petal_width'],'label_col':'is_virginica','max_depth':3},'meta':{'table':{'type':'table'},'model':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'tym6y2j4puhymzg6'},'outputs':{'model':'taa22dpyu6qg6g2n'},'fid':'fth7fdzam6seccgm','label':'Decision Tree Classification Train','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.classification$decision_tree_classification_predict50634','name':'brightics.function.classification$decision_tree_classification_predict','param':{'prediction_col':'prediction'},'meta':{'table':{'type':'table'},'out_table':{'type':'table'},'model':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'tqxz978puuedzus3','model':'taa22dpyu6qg6g2n'},'outputs':{'out_table':'thvcpsnpftz56wuj'},'fid':'fuxgfqtkyj4ra9dq','label':'Decision Tree Classification Predict','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.evaluation$evaluate_classification','name':'brightics.function.evaluation$evaluate_classification','param':{'label_col':'is_virginica','prediction_col':'prediction'},'meta':{'table':{'type':'table'},'result':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'thvcpsnpftz56wuj'},'outputs':{'result':'tmfbjzfq7k3msdmf'},'fid':'fxjpdfjsszqrnwbb','label':'Evaluate Classification','persist':true,'skip':false},{'persist-mode':'auto','func':'brightics.function.clustering$kmeans_silhouette_train_predict54809','name':'brightics.function.clustering$kmeans_silhouette_train_predict','param':{'init':'k-means++','n_init':3,'max_iter':300,'tol':0.0001,'precompute_distances':true,'n_jobs':1,'algorithm':'auto','input_cols':['sepal_length','sepal_width','petal_length','petal_width'],'n_clusters_list':[2,3,5,7]},'meta':{'table':{'type':'table'},'out_table':{'type':'table'},'model':{'type':'model'}},'context':'python','version':'3.6','inputs':{'table':'tx3zcjkzxtut65gs'},'outputs':{'out_table':'t7geraqkhqx8swx3','model':'txkapcxzf9xs8cej'},'fid':'fkhv6gzm9gdwjjyp','label':'K-Means (Silhouette)','persist':true,'skip':false}],'links':[{'kid':'kw6nftq2rqp862ut','sourceFid':'f5rjwgm6azcx3cnt','targetFid':'fbjmbmaywre4bmyb'},{'kid':'kdvj939rj2qt38n5','sourceFid':'f5rjwgm6azcx3cnt','targetFid':'fvkhfhdk4jc9er2a'},{'kid':'k32hbv4q3zwtupfj','sourceFid':'f8p3qxm8sbhbedd4','targetFid':'fth7fdzam6seccgm'},{'kid':'ka9edg2ra3d26w8c','sourceFid':'f8p3qxm8sbhbedd4','targetFid':'fuxgfqtkyj4ra9dq'},{'kid':'k28unwkbhrt8z5w3','sourceFid':'fth7fdzam6seccgm','targetFid':'fuxgfqtkyj4ra9dq'},{'kid':'kr6r28h97x6ncr9n','sourceFid':'fuxgfqtkyj4ra9dq','targetFid':'fxjpdfjsszqrnwbb'},{'kid':'kq6rak5wxrac557y','sourceFid':'f5rjwgm6azcx3cnt','targetFid':'fkhv6gzm9gdwjjyp'},{'kid':'kj4gzftddn74zman','sourceFid':'f5rjwgm6azcx3cnt','targetFid':'f8p3qxm8sbhbedd4'}],'mid':'mgb2v6pmcg6ktfk6','title':'iris','persist-mode':'auto','diagram':{'PAPER_MARGIN_TOP':20,'PAPER_MARGIN_LEFT':20,'FIGURE_WIDTH':195,'FIGURE_HEIGHT':60,'GAP_WIDTH':55,'GAP_HEIGHT':40},'entries':['f5rjwgm6azcx3cnt'],'optModels':{}}},'version':'3.6'}";

		JobParam fromJson = JsonUtil.fromJson(testjob, JobParam.class);
		fromJson.setUser("testuser");
		fromJson.setJid("testjobId");
		JobRunnerApiTest jobRunnerApiTest = new JobRunnerApiTest();
		JobRunner jobRunner = JobRunnerBuilder.builder().setApiInterface(jobRunnerApiTest).config(new JobRunnerConfig())
				.create(fromJson);
		jobRunner.run();

	}

}
