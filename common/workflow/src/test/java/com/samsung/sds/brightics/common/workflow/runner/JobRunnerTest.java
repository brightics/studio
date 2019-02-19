package com.samsung.sds.brightics.common.workflow.runner;

import org.junit.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerBuilder;
import com.samsung.sds.brightics.common.workflow.flowrunner.JobRunnerConfig;
import com.samsung.sds.brightics.common.workflow.flowrunner.job.JobRunner;
import com.samsung.sds.brightics.common.workflow.flowrunner.vo.JobParam;

public class JobRunnerTest {

//	private static final Logger logger = LoggerFactory.getLogger(JobRunnerTest.class);

	@Test
	public void jobRunnerRunTest() throws Exception {

		//initialize job runner API, configuration.
		JobRunnerConfig config = new JobRunnerConfig();
		config.setPersistForcedFalse(true);
		config.setVariableRepositoryPath("./variable");

		//build job runner builder
		JobRunnerBuilder jobRunnerBuilder = JobRunnerBuilder.builder().config(config);
		
		//create job runner
		JobParam fromJson = getTestJsonModel();
		JobRunner runner = jobRunnerBuilder.create(fromJson);
		
		runner.run();
		
		//clear job runner context
		runner.clear();
	}

	// 3.6 version model
	private JobParam getTestJsonModel() throws Exception {
		String jobJson = "{\"main\":\"mgb2v6pmcg6ktfk6\",\"models\":{\"mgb2v6pmcg6ktfk6\":{\"variables\":{},\"variableRef\":[],\"innerModels\":{},\"inData\":[],\"outData\":[],\"type\":\"data\",\"param\":{},\"functions\":[{\"persist-mode\":\"auto\",\"func\":\"brightics.function.io$event_load13889\",\"name\":\"brightics.function.io$event_load\",\"param\":{\"extradata\":true,\"col_names\":[\"test\",\"test2\"],\"type_array\":[\"int\",\"string\"],\"data_array\":[[\"1\",\"test\"]]},\"meta\":{\"table\":{\"type\":\"table\"}},\"context\":\"python\",\"version\":\"3.6\",\"outputs\":{\"table\":\"tx3zcjkzxtut65gs\"},\"fid\":\"f5rjwgm6azcx3cnt\",\"label\":\"EventLoad\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.statistics$profile_table22844\",\"name\":\"brightics.function.statistics$profile_table\",\"param\":{\"check_correlation\":false,\"group_by\":[\"species\"]},\"meta\":{\"table\":{\"type\":\"table\"},\"result\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tx3zcjkzxtut65gs\"},\"outputs\":{\"result\":\"tf86zzqj7nk96qfq\"},\"fid\":\"fbjmbmaywre4bmyb\",\"label\":\"Profile Table\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.statistics$pairplot98411\",\"name\":\"brightics.function.statistics$pairplot\",\"param\":{\"kind\":\"scatter\",\"diag_kind\":\"auto\",\"dropna\":true,\"x_vars\":[\"sepal_length\",\"sepal_width\",\"petal_length\",\"petal_width\"],\"hue\":\"species\"},\"meta\":{\"table\":{\"type\":\"table\"},\"result\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tx3zcjkzxtut65gs\"},\"outputs\":{\"result\":\"tbusv26w9m3w6gmc\"},\"fid\":\"fvkhfhdk4jc9er2a\",\"label\":\"Pair Plot\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.transform$split_data\",\"name\":\"brightics.function.transform$split_data\",\"param\":{},\"meta\":{\"table\":{\"type\":\"table\"},\"train_table\":{\"type\":\"table\"},\"test_table\":{\"type\":\"table\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tx3zcjkzxtut65gs\"},\"outputs\":{\"train_table\":\"tym6y2j4puhymzg6\",\"test_table\":\"tqxz978puuedzus3\"},\"fid\":\"f8p3qxm8sbhbedd4\",\"label\":\"Split Data\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.classification$decision_tree_classification_train12559\",\"name\":\"brightics.function.classification$decision_tree_classification_train\",\"param\":{\"criterion\":\"gini\",\"splitter\":\"best\",\"feature_cols\":[\"sepal_length\",\"sepal_width\",\"petal_length\",\"petal_width\"],\"label_col\":\"is_virginica\",\"max_depth\":3},\"meta\":{\"table\":{\"type\":\"table\"},\"model\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tym6y2j4puhymzg6\"},\"outputs\":{\"model\":\"taa22dpyu6qg6g2n\"},\"fid\":\"fth7fdzam6seccgm\",\"label\":\"Decision Tree Classification Train\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.classification$decision_tree_classification_predict50634\",\"name\":\"brightics.function.classification$decision_tree_classification_predict\",\"param\":{\"prediction_col\":\"prediction\"},\"meta\":{\"table\":{\"type\":\"table\"},\"out_table\":{\"type\":\"table\"},\"model\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tqxz978puuedzus3\",\"model\":\"taa22dpyu6qg6g2n\"},\"outputs\":{\"out_table\":\"thvcpsnpftz56wuj\"},\"fid\":\"fuxgfqtkyj4ra9dq\",\"label\":\"Decision Tree Classification Predict\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.evaluation$evaluate_classification\",\"name\":\"brightics.function.evaluation$evaluate_classification\",\"param\":{\"label_col\":\"is_virginica\",\"prediction_col\":\"prediction\"},\"meta\":{\"table\":{\"type\":\"table\"},\"result\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"thvcpsnpftz56wuj\"},\"outputs\":{\"result\":\"tmfbjzfq7k3msdmf\"},\"fid\":\"fxjpdfjsszqrnwbb\",\"label\":\"Evaluate Classification\",\"persist\":true,\"skip\":false},{\"persist-mode\":\"auto\",\"func\":\"brightics.function.clustering$kmeans_silhouette_train_predict54809\",\"name\":\"brightics.function.clustering$kmeans_silhouette_train_predict\",\"param\":{\"init\":\"k-means++\",\"n_init\":3,\"max_iter\":300,\"tol\":0.0001,\"precompute_distances\":true,\"n_jobs\":1,\"algorithm\":\"auto\",\"input_cols\":[\"sepal_length\",\"sepal_width\",\"petal_length\",\"petal_width\"],\"n_clusters_list\":[2,3,5,7]},\"meta\":{\"table\":{\"type\":\"table\"},\"out_table\":{\"type\":\"table\"},\"model\":{\"type\":\"model\"}},\"context\":\"python\",\"version\":\"3.6\",\"inputs\":{\"table\":\"tx3zcjkzxtut65gs\"},\"outputs\":{\"out_table\":\"t7geraqkhqx8swx3\",\"model\":\"txkapcxzf9xs8cej\"},\"fid\":\"fkhv6gzm9gdwjjyp\",\"label\":\"K-Means (Silhouette)\",\"persist\":true,\"skip\":false}],\"links\":[{\"kid\":\"kw6nftq2rqp862ut\",\"sourceFid\":\"f5rjwgm6azcx3cnt\",\"targetFid\":\"fbjmbmaywre4bmyb\"},{\"kid\":\"kdvj939rj2qt38n5\",\"sourceFid\":\"f5rjwgm6azcx3cnt\",\"targetFid\":\"fvkhfhdk4jc9er2a\"},{\"kid\":\"k32hbv4q3zwtupfj\",\"sourceFid\":\"f8p3qxm8sbhbedd4\",\"targetFid\":\"fth7fdzam6seccgm\"},{\"kid\":\"ka9edg2ra3d26w8c\",\"sourceFid\":\"f8p3qxm8sbhbedd4\",\"targetFid\":\"fuxgfqtkyj4ra9dq\"},{\"kid\":\"k28unwkbhrt8z5w3\",\"sourceFid\":\"fth7fdzam6seccgm\",\"targetFid\":\"fuxgfqtkyj4ra9dq\"},{\"kid\":\"kr6r28h97x6ncr9n\",\"sourceFid\":\"fuxgfqtkyj4ra9dq\",\"targetFid\":\"fxjpdfjsszqrnwbb\"},{\"kid\":\"kq6rak5wxrac557y\",\"sourceFid\":\"f5rjwgm6azcx3cnt\",\"targetFid\":\"fkhv6gzm9gdwjjyp\"},{\"kid\":\"kj4gzftddn74zman\",\"sourceFid\":\"f5rjwgm6azcx3cnt\",\"targetFid\":\"f8p3qxm8sbhbedd4\"}],\"mid\":\"mgb2v6pmcg6ktfk6\",\"title\":\"iris\",\"persist-mode\":\"auto\",\"diagram\":{\"PAPER_MARGIN_TOP\":20,\"PAPER_MARGIN_LEFT\":20,\"FIGURE_WIDTH\":195,\"FIGURE_HEIGHT\":60,\"GAP_WIDTH\":55,\"GAP_HEIGHT\":40},\"entries\":[\"f5rjwgm6azcx3cnt\"],\"optModels\":{}}},\"version\":\"3.6\"}";
		JobParam fromJson = new ObjectMapper().readValue(jobJson, JobParam.class);
		fromJson.setUser("brightics@samsung.com");
		fromJson.setJid("jobid0001");
		return fromJson;
	}

}
