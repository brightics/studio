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

package com.samsung.sds.brightics.agent.context.python.calcitePandas;

import com.google.common.collect.ImmutableList;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.apache.calcite.linq4j.function.Parameter;

import java.util.List;


public class UDFS {

    private UDFS() {
    }

    public static class MlTrain {

        public static List<String> MlTrainParamNames() {
            ImmutableList.Builder<String> builder = new ImmutableList.Builder<String>();

            builder.add("model_type");
            builder.add("label_col");
            builder.add("feature_cols");
            builder.add("group_by");

            // with Linear Regression Train
            builder.add("fit_intercept");
            builder.add("normalize");

            // with Decision Tree Classification Train
            builder.add("criterion");
            builder.add("splitter");
            builder.add("max_depth");
            builder.add("min_samples_split");
            builder.add("min_samples_leaf");
            builder.add("min_weight_fraction_leaf");
            builder.add("max_features");
            builder.add("random_state");
            builder.add("max_leaf_nodes");
            builder.add("min_impurity_decrease");
            builder.add("class_weight");

            // with LogisticRegressionTrain
            builder.add("penalty");
            builder.add("dual");
            builder.add("tol");
            builder.add("C");
            builder.add("intercept_scaling");
            builder.add("solver");
            builder.add("max_iter");
            builder.add("multi_class");
            builder.add("verbose");
            builder.add("warm_start");
            builder.add("n_jobs");
            builder.add("l1_ratio");


            return builder.build();
        }

        public String linear_regression(
                @Parameter(name = "label_col") String label_col,
                @Parameter(name = "feature_cols", optional = true) List feature_cols,
                @Parameter(name = "group_by", optional = true) List group_by,
                @Parameter(name = "fit_intercept", optional = true) boolean fit_intercept,
                @Parameter(name = "normalize", optional = true) boolean normalize
        ) {
            return "trained_model";
        }

        public String decisiontree_classification(
                @Parameter(name = "label_col") String label_col,
                @Parameter(name = "feature_cols", optional = true) List feature_cols,
                @Parameter(name = "group_by", optional = true) List group_by,
                @Parameter(name = "criterion", optional = true) String criterion,
                @Parameter(name = "splitter", optional = true) String splitter,
                @Parameter(name = "max_depth", optional = true) Integer max_depth,
                @Parameter(name = "min_samples_split", optional = true) Integer min_samples_split,
                @Parameter(name = "min_samples_leaf", optional = true) Integer min_samples_leaf,
                @Parameter(name = "min_weight_fraction_leaf", optional = true) Double min_weight_function_leaf,
                @Parameter(name = "max_features", optional = true) Integer max_features,
                @Parameter(name = "random_state", optional = true) Integer random_state,
                @Parameter(name = "max_leaf_nodes", optional = true) Integer max_leaf_nodes,
                @Parameter(name = "min_impurity_decrease", optional = true) Double min_impurity_decrease,
                @Parameter(name = "min_impurity_split", optional = true) Double min_impurity_split,
                @Parameter(name = "class_weight", optional = true) List class_weight,
                @Parameter(name = "presort", optional = true) Boolean presort
        ) {
            return "trained_model";
        }

        public String eval(
                @Parameter(name = "model_type") String model_type,
                @Parameter(name = "label_col") String label_col,
                @Parameter(name = "feature_cols", optional = true) List feature_cols,
                @Parameter(name = "group_by", optional = true) List group_by,

                // with Linear Regression Train
                @Parameter(name = "fit_intercept", optional = true) boolean fit_intercept,
                @Parameter(name = "normalize", optional = true) boolean normalize,

                // with Decision Tree Classification Train
                @Parameter(name = "criterion", optional = true) String criterion,
                @Parameter(name = "splitter", optional = true) String splitter,
                @Parameter(name = "max_depth", optional = true) Integer max_depth,
                @Parameter(name = "min_samples_split", optional = true) Integer min_samples_split,
                @Parameter(name = "min_samples_leaf", optional = true) Integer min_samples_leaf,
                @Parameter(name = "min_weight_fraction_leaf", optional = true) Double min_weight_function_leaf,
                @Parameter(name = "max_features", optional = true) Integer max_features,
                @Parameter(name = "random_state", optional = true) Integer random_state,
                @Parameter(name = "max_leaf_nodes", optional = true) Integer max_leaf_nodes,
                @Parameter(name = "min_impurity_decrease", optional = true) Double min_impurity_decrease,
                @Parameter(name = "class_weight", optional = true) List class_weight,

                // with LogisticRegressionTrain
                @Parameter(name = "penalty", optional = true) String penalty,
                @Parameter(name = "dual", optional = true) Boolean dual,
                @Parameter(name = "tol") Double tol,
                @Parameter(name = "C", optional = true) Float C,
                @Parameter(name = "intercept_scaling", optional = true) Double intercept_scaling,
                @Parameter(name = "solver", optional = true) String solver,
                @Parameter(name = "max_iter", optional = true) Integer max_iter,
                @Parameter(name = "multi_class", optional = true) String multi_class,
                @Parameter(name = "verbose", optional = true) Integer verbose,
                @Parameter(name = "warm_start", optional = true) Bool warm_start,
                @Parameter(name = "n_jobs", optional = true) Integer n_jobs,
                @Parameter(name = "l1_ratio", optional = true) Double l1_ratio
        ) {

            return "trained_model";
        }
    }

    public static class StatsFunction {

        public static List<String> StatsFunctionParamNames() {
            ImmutableList.Builder<String> builder = new ImmutableList.Builder<String>();
            builder.add("function");
            builder.add("input_cols");
            builder.add("group_by");

            return builder.build();
        }

        public String eval(
                @Parameter(name = "function") String stat_function,
                @Parameter(name = "input_cols", optional = true) List input_cols,
                @Parameter(name = "group_by", optional = true) List group_by
        ) {
            return "stats_function";
        }
    }
}
