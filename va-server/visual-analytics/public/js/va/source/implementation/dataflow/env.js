(function () {
    'use strict';

    var root = this;
    var library = root.Brightics.VA.Core.Functions.Library;


    root.Brightics.VA.Implementation.DataFlow = {
        Clazz: 'data',
        Label: 'Data Flow',
        Launcher: {},
        Validator: {},
        Editors: {
            Diagram: {
                Shapes: {}
            },
            Sheet: {
                Panels: {
                    Properties: {}
                }
            },
            Header: {},
            BodyContainer: {}
        },
        Dialogs: {
            RefineSteps: {
                Validator: {}
            }
        },
        Tools: {
            Adapter: {},
            Manager: {}
        },
        Utils: {}
    };

    root.Brightics.VA.Implementation.DataFlow.Functions =
        library.extendFunctions(['load', 'dbReader', 'unload', 'cassandraLoad', 'cassandraUnload', 'randomDataGeneration', 'ewma', 'imputeDatetime', 'imputeNumberTypeFillColumn', 'imputeStringTypeFillColumn',
            'kalmanFilter', 'movingAverage', 'dataNormalization', 'sort', 'timeShift', 'timeSeriesDistance', 'conditionalUpdate', 'elementwiseProduct', 'polynomialExpansion', 'polynomialRegressionTrain', 'polynomialRegressionPredict',
            'distinctFilter', 'conditionFilter', 'minmaxFilter', 'imputeRemoveLine', 'lengthFilter', 'outlierRemoval', 'stringFilter', 'independentFilter', 'correlation',
            'quantileDiscretizer', 'frequency', 'frequencyMat', 'statisticDerivation', 'statisticSummary', 'kernelDensityEstimation', 'kernelDensity', 'gaussianMixtureTrain',
            'gaussianMixturePredict', 'chiSquareTest', 'duncanTest', 'ttest', 'typeCast', 'changeColumnName', 'capitalizeColName', 'reorganizeTable', 'join', 'colAppend', 'rowAppend',
            'powerRowAppend', 'queryExecutor', 'pivot', 'unpivot', 'stratifiedSampling', 'randomSampling', 'timeSeriesTranspose', 'splitData', 'refine', 'qrDecomposition', 'pca', 'indexToString', 'transpose',
            'bucketizer', 'mdRemove', 'mdReplaceNumber', 'mdReplaceString', 'mdTrim', 'mdCapitalize', 'mdLength', 'numericalVariableDerivation', 'rowIndexDerivation', 'conditionalDerivation',
            'ymdhwFromDatetime', 'datetimeFormatConvertor', 'datetimeCalculator', 'oneHotEncoder', 'stringIndexer', 'vectorIndexer', 'binarizer', 'nGram', 'stringSplit', 'addLeadLag', 'autoArimaTrain',
            'autoArimaPredict', 'arimaTrain', 'arimaPredict', 'linearRegressionTrain', 'linearRegressionPredict', 'logisticRegressionTrain', 'logisticRegressionPredict', 'timeSeriesLRTrain', 'timeSeriesLRPredict',
            'holtWintersTrain', 'holtWintersPredict', 'isotonicRegressionTrain', 'isotonicRegressionPredict', 'glm', 'glmForLogisticRegression', 'glmPredict', 'glmPredictForLogisticRegression', 'alsTrain', 'alsRecommend',
            'decisionTreeTrain', 'decisionTreePredict', 'decisionTreeCartTrain', 'decisionTreeCartPredict', 'kmeans', 'knn', 'naiveBayesTrain', 'naiveBayesPredict', 'hierarchicalClustering',
            'hierarchicalClusteringPostProcess', 'svmTrain', 'svmPredict', 'svd', 'randomForestTrain', 'randomForestPredict', 'latentDirichletAllocation', 'powerIterationClustering',
            'oneVsRestLRClassifierTrain', 'oneVsRestLRClassifierPredict', 'anova', 'regressionEvaluation', 'binaryClassificationEvaluation', 'multiclassClassificationEvaluation', 'csp',
            'outDet', 'calib', 'logLikelihoodRatioTest', 'logLikelihoodRatioTestForLR', 'evaluateRankingAlgorithm', 'elasticIndexing', 'elasticSearch', 'elasticRegExpSearch',
            'elasticQueryExecutor', 'scalaScript', 'pythonScript', 'rGroupBy', 'rScript', 'flatMapR', 'rScript2', 'mlpPredict', 'mlpTrain', 'dlPredict', 'sqlExecutor', 'addColumnByRefine', 'selectColumn', 'tFIDF',
            'changeValue', 'groupBy', 'simpleFilter', 'advancedFilter', 'sortByRefine', 'linearUCBTrain', 'linearUCBPrescribe', 'associationRule', 'featureEncoding', 'columnsToArray', 'arrayToColumns', 'bigDataScatter',
            'bigDataLine', 'bigDataColumn', 'bigDataBar', 'bigDataBoxPlot', 'bigDataPie', 'bigDataHistogram', 'qLearningTrain', 'qLearningPrescribe', 'sarsaTrain', 'sarsaPrescribe', 'thompsonSamplingTrain', 'thompsonSamplingPrescribe',
            'valueIterationTrain', 'valueIterationPrescribe', 'interactivePrediction', 'tokenizer', 'chiSqSelection', 'createTable', 'correlationWithPivot', 'timeSeriesAnalysis', 'eDA', 'optPreprocessing',
            'localOptimization', 'globalOptimization', 'parameterStudies', 'designOfExperiments', 'sampling', 'uncertaintyQuantification', 'randomSplit', 'unknownFunction',
            'flow',
            'if',
            'forLoop',
            'whileLoop',
            'import',
            'export',
            'setValue',
            'dataViewer',
            'udfTest',
            'kmeanspy', 'kmeansmodelpy', 'pairwisescatter', 'kmeans2', 'kmeans2model', 'testftn1', 'testftn2', 'testftn3',
            'unpivot', 'pythonRefine', 'timeSeriesSmoothen', 'timeSeriesDecomposition', 'crossCorrelation', 'autoCorrelation', 'aRXTrain', 'aRXPredict', 'tFIDF', 'stopWordsRemover',
            'vIF', 'twoSampleTTestForStacked', 'trimmedMeansOneWayTest', 'stringSummary', 'pairedTTest', 'oneSampleTTest', 'normalityTest', 'mannWhitneyUTest', 'levenesTest',
            'kruskalWallisHTest', 'fTestForStacked', 'crossTable', 'correlationTest', 'chiSquareTestOfIndependence', 'chiSquareTestForGivenProportions', 'chiSqTestForTheVariance',
            'bootstrapLimit', 'bartlettsTestForStacked', 'stepwiseLinearRegressionTrain', 'stepwiseLinearRegressionPredict', 'predictor', 'polynomialRegressionTrain', 'polynomialRegressionPredict',
            'linearRegressionResidual', 'mahalanobisDistanceOutlierDetection', 'exportColumn', 'oneHotEncoderModel', 'oneHotEncoder', 'labelIndexerModel', 'labelIndexer',
            'indexToLabelModel', 'indexToLabel', 'evaluateTimeSeries', 'sVMRBFTrain', 'sVMRBFPredict', 'sVMRBF', 'symbolicRegressionTrain', 'symbolicRegressionPredict', 'randomForestRegressionTrain',
            'randomForestRegressionPredict', 'randomForestClassificationTrain', 'randomForestClassificationPredict', 'gBTRegressionTrain', 'gBTRegressionPredict', 'gBTClassificationTrain',
            'gBTClassificationPredict', 'decisionTreeRegressionTrain', 'decisionTreeRegressionPredict', 'decisionTreeClassificationTrain', 'decisionTreeClassificationPredict',
            'autoRegressionTrain', 'autoRegressionPredict', 'autoOneVsRestLogisticRegressionTrain', 'autoMLPTrainForClassification', 'autoLogisticRegressionTrain', 'autoLogisticRegressionPredict',
            'autoLinearRegressionTrain', 'autoLinearRegressionPredict', 'autoFeatureSelection', 'autoDataCleansing', 'autoClassificationTrain', 'autoClassificationPredict',
            'bootstrapLimit', 't2train', 't2predict', 'sprt', 'sbmtrain', 'sbmpredict', 'adRandomForestTrain', 'adRandomForestPredict', 'adPoissonFilter',
            'readFromS3',
            'writeToS3',
            'readFromDb',
            'writeToDb',
            'addColumnIfPython','simpleFilterPython','advancedFilterPython',
            'selectColumnPython','sortPython','addColumnPython',
            'dialogProperties',
            'merge',
            'addFunctionColumnsPython',
            'brightics.function.evaluation$plot_roc_pr_curve',
            'queryExecutorPython',
            'createTablePython',
            'loadModel',
            'unloadModel',
            'brightics.function.transform$get_table',
            'queryExecutorPython2'
        ]);

    root.Brightics.VA.Implementation.DataFlow.Helpers =
        {
            sqlfunctionhelp: {
                label: 'SQL Function Help',
                operation: 'SQLFuncHelper'
            }
        };

    root.Brightics.VA.Implementation.DataFlow.defaultModel = $.extend(true, (function () {
        var ret = {
            variables: {},
            variableRef: [],
            innerModels: {},
            getVariableAssignedParamList: function (variableName) {
                var list = [];
                for (var i = 0; i < this.variableRef.length; i++) {
                    var ref = this.variableRef[i];
                    for (var key in ref.param) {
                        if (ref.param[key] === variableName) {
                            list.push({
                                fid: ref.fid,
                                param: key
                            });
                        }
                    }
                }
                return list;
            },
            renameVariableKey: function (curKey, nxtKey) {
                if (this.variables[nxtKey]) {
                    throw new Error('variable already exists');
                } else {
                    this.variables[nxtKey] = this.variables[curKey];
                    delete this.variables[curKey];
                }
            },
            updateVariable: function (key, type, newValue) {
                if (!this.variables[key]) {
                    throw new Error('variable not exists');
                } else {
                    this.variables[key].type = type;
                    this.variables[key].value = newValue;
                }
            },
            getInnerModel: function (mid) {
                var map = this.innerModels || {};
                return map[mid];
            },
            getInnerModels: function (mid) {
                this.innerModels = this.innerModels || {};
                return this.innerModels;
            },
            addInnerModel: function (model) {
                this.innerModels = this.innerModels || {};
                this.innerModels[model.mid] = model;
                return model;
            },
            removeInnerModel: function (mid) {
                var model = this.innerModels[mid];
                delete this.innerModels[mid];
                return model;
            },
            removeInnerModelRecursion: function (mid) {
                var _this = this;
                var model = this.innerModels[mid];
                var deletedModels = [];
                if (model) {
                    var functions = model.functions;
                    deletedModels = deletedModels.concat(_.map(functions, function (fn) {
                        var subModels =
                            Brightics.VA.Core.Utils.NestedFlowUtils.getSubModels(_this, fn);
                        return _.map(subModels, function (subModel) {
                            return _this.removeInnerModelRecursion(subModel.mid);
                        });
                    }));
                    deletedModels.push(_this.removeInnerModel(mid));
                }
                return _.filter(_.flattenDeep(deletedModels), _.negate(_.isUndefined));
            }
        };
        ret[IN_DATA] = [];
        ret[OUT_DATA] = [];
        return ret;
    }()), Brightics.VA.Default.analyticsModel);

    root.Brightics.VA.Implementation.DataFlow.innerModel = $.extend(true, (function () {
        var ret = {};
        ret[IN_DATA] = [];
        ret[OUT_DATA] = [];
        return ret;
    }()), Brightics.VA.Default.analyticsModel);


}).call(this);