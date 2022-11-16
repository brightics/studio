(function () {
	'use strict';

	var root = this;
	root.Brightics.OptFunctions = {
		ALSRecommend: {
			"optSelected": "true",
			"optParam": {
				"topn-number": {
					"min": 1,
					"max": 5,
					"value": 3,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		AutoFeatureSelection: {
			"optSelected": "true",
			"optParam": {
				"max-num-features": {
					"min": 1,
					"max": 5,
					"value": 3,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		AutoRandomForestTrainForClassification: {
			"optSelected": "true",
			"optParam": {
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [1, 5, 10, 30],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"min-info-gain": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"min-instances-per-node": {
					"set": [1, 3, 5, 7, 10],
					"value": 1,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-folds": {
					"set": [3, 5, 9],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-trees": {
					"set": [20, 50, 100],
					"value": 50,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"sub-sampling-rate": {
					"min": 0.01,
					"max": 1,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"train-ratio": {
					"min": 0,
					"max": 1,
					"value": 0.75,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		AutoRandomForestTrainForRegression: {
			"optSelected": "true",
			"optParam": {
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [1, 5, 10, 30],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"min-info-gain": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"min-instances-per-node": {
					"set": [1, 3, 5, 7, 10],
					"value": 1,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-folds": {
					"set": [3, 5, 9],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-trees": {
					"set": [20, 50, 100],
					"value": 50,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"sub-sampling-rate": {
					"min": 0.01,
					"max": 1,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"train-ratio": {
					"min": 0,
					"max": 1,
					"value": 0.75,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		ArimaTrain: {
			"optSelected": "true",
			"optParam": {
				"p": {
					"min": 0,
					"max": 5,
					"value": 1,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				},
				"d": {
					"min": 0,
					"max": 2,
					"value": 0,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				},
				"q": {
					"min": 0,
					"max": 5,
					"value": 1,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		ARX: {
			"optSelected": "true",
			"optParam": {
				"xMaxLag": {
					"min": 0,
					"max": 5,
					"value": 1,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				},
				"yMaxLag": {
					"min": 0,
					"max": 5,
					"value": 1,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		Binarizer: {
			"optSelected": "true",
			"optParam": {
				"Threshold": {
					"min": -10,
					"max": 10,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		ChiSqSelection: {
			"optSelected": "true",
			"optParam": {
				"numFolds": {
					"set": [3, 5, 9],
					"value": 9,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"trainRatio": {
					"min": 0,
					"max": 1,
					"value": 0.75,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		DecisionTreeTrain: {
			"optSelected": "true",
			"optParam": {
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [1, 5, 10, 30],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				}
			}
		},
		Ewma: {
			"optSelected": "true",
			"optParam": {
				"number": {
					"set": [2, 4, 6, 8, 10],
					"value": 4,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"ratio": {
					"min": 0.1,
					"max": 0.9,
					"value": 0.5,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		HoltWintersTrain: {
			"optSelected": "true",
			"optParam": {
				"period": {
					"set": [4, 5, 7, 30, 52, 168],
					"value": 4,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"model-type": {
					"set": ["additive", "multiplicative"],
					"type": "DISCRETE_SET_STRING",
					"optParamSelected": "true"
				}
			}
		},
		GaussianMixtureTrain: {
			"optSelected": "true",
			"optParam": {
				"num-clusters": {
					"min": 1,
					"max": 5,
					"value": 3,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		IndependentFilter: {
			"optSelected": "true",
			"optParam": {
				"threshold": {
					"min": 0,
					"max": 10,
					"value": 0.000001,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		KMeans: {
			"optSelected": "true",
			"optParam": {
				"clusters": {
					"set": [2, 3, 4, 5, 8, 10],
					"value": 3,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				}
			}
		},
		LinearRegressionTrain: {
			"optSelected": "true",
			"optParam": {
				"regularization": {
					"min": 0,
					"max": 1,
					"value": 0.01,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"types": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		LogisticRegressionTrain: {
			"optSelected": "true",
			"optParam": {
				"regularization": {
					"min": 0,
					"max": 1,
					"value": 0.01,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"types": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		MahalanobisDistanceOutlierDetection: {
			"optSelected": "true",
			"optParam": {
				"sampling-rate": {
					"min": 0,
					"max": 1,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		MovingAverage: {
			"optSelected": "true",
			"optParam": {
				"number": {
					"set": [3, 5, 7, 11, 20],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				}
			}
		},
		NaiveBayesTrain: {
			"optSelected": "true",
			"optParam": {
				"lambda": {
					"min": 0,
					"max": 10,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		NGram: {
			"optSelected": "true",
			"optParam": {
				"number": {
					"min": 1,
					"max": 8,
					"value": 3,
					"type": "DISCRETE_RANGE",
					"optParamSelected": "true"
				}
			}
		},
		OneVsRestLRClassifierTrain: {
			"optSelected": "true",
			"optParam": {
				"reg-param": {
					"min": 0,
					"max": 1,
					"value": 0.01,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		OutlierRemoval: {
			"optSelected": "true",
			"optParam": {
				"method": {
					"set": ['carling', 'tuckey'],
					"type": "DISCRETE_SET_STRING",
					"optParamSelected": "true"
				},
				"multiplier": {
					"min": 0.1,
					"max": 3.0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		PolynomialRegressionTrain: {
			"optSelected": "true",
			"optParam": {
				"regularization": {
					"min": 0,
					"max": 1,
					"value": 0.01,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"types": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		PowerIterationClustering: {
			"optSelected": "true",
			"optParam": {
				"n-clusters": {
					"set": [2, 3, 4, 5, 8, 10],
					"value": 3,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				}
			}
		},
		RandomForestClassificationTrain: {
			"optSelected": "true",
			"optParam": {
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [1, 5, 10, 30],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"min-info-gain": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"min-instances-per-node": {
					"set": [1, 3, 5, 7, 10],
					"value": 1,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-folds": {
					"set": [3, 5, 9],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-trees": {
					"set": [20, 50, 100],
					"value": 50,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"sub-sampling-rate": {
					"min": 0.01,
					"max": 1,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"train-ratio": {
					"min": 0,
					"max": 1,
					"value": 0.75,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		RandomForestRegressionTrain: {
			"optSelected": "true",
			"optParam": {
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [1, 5, 10, 30],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"min-info-gain": {
					"min": 0,
					"max": 1,
					"value": 0,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"min-instances-per-node": {
					"set": [1, 5, 10],
					"value": 1,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-folds": {
					"set": [3, 5, 9],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-trees": {
					"set": [20, 50, 100],
					"value": 50,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"sub-sampling-rate": {
					"min": 0.01,
					"max": 1,
					"value": 1,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				},
				"train-ratio": {
					"min": 0,
					"max": 1,
					"value": 0.75,
					"type": "CONTINUOUS",
					"optParamSelected": "true"
				}
			}
		},
		RandomForestTrain: {
			"optSelected": "true",
			"optParam": {
				"num-classes": {
					"set": [2, 4, 16],
					"value": 2,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"num-trees": {
					"set": [3, 15, 30],
					"value": 3,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-depth": {
					"set": [5, 10, 20],
					"value": 5,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"max-bins": {
					"set": [2, 4, 8, 32, 128],
					"value": 32,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				}
			}
		},
		TimeSeriesDecomposition: {
			"optSelected": "true",
			"optParam": {
				"period": {
					"set": [4, 5, 7, 30, 52, 168],
					"value": 4,
					"type": "DISCRETE_SET_INTEGER",
					"optParamSelected": "true"
				},
				"model-type": {
					"set": ["additive", "multiplicative"],
					"type": "DISCRETE_SET_STRING",
					"optParamSelected": "true"
				}
			}
		},
		'brightics.function.regression$xgb_regression_train': {
            "optSelected": "true",
            "optParam": {
                "max_depth": {
                    "set": [3,5,10],
                    "value": 3,
                    "type": "DISCRETE_SET_INTEGER",
                    "optParamSelected": "true"
                },
                "n_estimators": {
					"set": [50,100,200],
					"value": 100,
                    "type": "DISCRETE_SET_INTEGER",
                    "optParamSelected": "true"
                }
            }
		},
		'brightics.function.classification$xgb_classification_train': {
            "optSelected": "true",
            "optParam": {
                "max_depth": {
                    "set": [3,5,10],
                    "value": 3,
                    "type": "DISCRETE_SET_INTEGER",
                    "optParamSelected": "true"
                },
                "n_estimators": {
					"set": [50,100,200],
					"value": 100,
                    "type": "DISCRETE_SET_INTEGER",
                    "optParamSelected": "true"
                }
            }
        }

	};
}).call(this);
