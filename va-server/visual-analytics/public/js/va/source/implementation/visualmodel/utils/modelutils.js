/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    root.Brightics.VA.Implementation.Visual.Utils.ModelUtils = {
        addChartContentToSelectedVisualModel: function (options) {
            var _this = this;
            var resourceManager = Studio.getResourceManager();
            var dataSourceLabel = options.dataSourceLabel;
            var selectedModels = options.selectedModels;
            var projectId = options.projectId;
            var modelId = options.modelId;
            var tableId = options.tableId;
            var chartOptions = options.chartOptions;
            chartOptions.tag = options.dataSourceTag;
            var columns = options.columns;
            var changeLabel = options.changeLabel;

            for (var i in selectedModels) {
                var file = selectedModels[i];
                var targetVisualModel = file.getContents();
                var param = {
                    modelId: modelId,
                    tableId: tableId
                };
                var dataSource = targetVisualModel.getDataSourceUsingParam(param);

                if (dataSource) {
                    if (changeLabel) {
                        dataSource.display.label = dataSourceLabel;
                    }
                    dataSource.display.charts.push(chartOptions);
                } else {
                    dataSource = targetVisualModel.newDataSource(Brightics.VA.Implementation.Visual.DATASOURCE_TYPE.STAGING);
                    dataSource.display.label = dataSourceLabel;
                    dataSource.display.charts = [chartOptions];
                    dataSource.display.columns = columns;
                    dataSource.param.modelId = modelId;
                    dataSource.param.tableId = tableId;
                    targetVisualModel.addDataSource(dataSource);
                }

                //var newContent = targetVisualModel.newContent({
                //    type: Brightics.VA.Implementation.Visual.CONTENT_TYPE.CHART,
                //    options: $.extend(true, {}, chartOptions),
                //    dataSourceId: dataSource.fid
                //});
                //targetVisualModel.addContent(newContent);

                resourceManager.updateFile(projectId, file);
            }
        },

        getSampleVO: function () {
            var vo =
            {
                "id": "m5hkx9gxbcemd8zj",
                "project_id": "pdd84xa5bns9xsfz",
                "label": "v1",
                "contents": {
                    "mid": "m5hkx9gxbcemd8zj",
                    "type": "visual",
                    "title": "v1",
                    "functions": [
                        {
                            "fid": "dsuht483gqzmbuze",
                            "func": "loadFromStaging",
                            "name": "Empty",
                            'outData': [
                                "tchuy2ythyet6muq"
                            ],
                            "param": {
                                "modelId": "mmrxqaz5t7zzjv8s",
                                "tableId": "tvzky2cus83cwzen"
                            },
                            "display": {
                                "label": "Datatat-Load-Out"
                            },
                            "persist": true
                        }
                    ],
                    "links": [],
                    "report": {
                        "pages": [
                            {
                                "id": "rpqafeq65byyhnn3",
                                "contents": {
                                    "rcpkr8v9eku7cjw4": {
                                        "id": "rcpkr8v9eku7cjw4",
                                        "type": "chart",
                                        "size": {
                                            "width": "100%",
                                            "height": "25%"
                                        },
                                        "position": {
                                            "top": "0%",
                                            "left": "0%"
                                        },
                                        "options": {
                                            "chart": {
                                                "type": "line",
                                                "width": "100%",
                                                "height": "100%",
                                                "style": {
                                                    "markers": {
                                                        "markerSize": "",
                                                        "markerType": ""
                                                    },
                                                    "thickness": {
                                                        "lineThickness": 2
                                                    },
                                                    "colorPickerEnable": false,
                                                    "fillOpacity": 1
                                                }
                                            },
                                            "toolbar": {
                                                "visible": true,
                                                "height": 24
                                            },
                                            "xAxis": {
                                                "selected": [
                                                    {
                                                        "name": "SepalLength",
                                                        "aggregation": "none",
                                                        "label": "SepalLength"
                                                    }
                                                ],
                                                "visible": true,
                                                "rotation": 0,
                                                "minimum": null,
                                                "maximum": null
                                            },
                                            "yAxis": {
                                                "selected": [
                                                    {
                                                        "name": "SepalWidth",
                                                        "aggregation": "none",
                                                        "label": "SepalWidth"
                                                    }
                                                ],
                                                "gridLineWidth": 0,
                                                "visible": true
                                            },
                                            "stripLines": {},
                                            "legend": {
                                                "visible": true
                                            },
                                            "colorBy": {
                                                "selected": []
                                            },
                                            "lineBy": {
                                                "selected": []
                                            },
                                            "valueBy": {
                                                "selected": []
                                            },
                                            "sizeBy": {
                                                "selected": []
                                            },
                                            "shapeBy": {
                                                "selected": []
                                            },
                                            "fromCol": {
                                                "selected": []
                                            },
                                            "toCol": {
                                                "selected": []
                                            },
                                            "conditionCol": {
                                                "selected": []
                                            },
                                            "nodeLabelCol": {
                                                "selected": []
                                            },
                                            "edgeLabelCol": {
                                                "selected": []
                                            },
                                            "parentCol": {
                                                "selected": []
                                            },
                                            "childCol": {
                                                "selected": []
                                            },
                                            "valueCol": {
                                                "selected": []
                                            },
                                            "clusterCol": {
                                                "selected": []
                                            },
                                            "clusterGroupCol": {
                                                "selected": []
                                            },
                                            "heightCol": {
                                                "selected": []
                                            },
                                            "typeCol": {
                                                "selected": [
                                                    {
                                                        "name": "mcc_type"
                                                    }
                                                ],
                                                "typeMapping": {
                                                    "lotTime": {
                                                        "type": "L",
                                                        "label": "Lot"
                                                    },
                                                    "processTime": {
                                                        "type": "P",
                                                        "label": "Process"
                                                    },
                                                    "loadTime": {
                                                        "type": "O",
                                                        "label": "Load"
                                                    },
                                                    "unloadTime": {
                                                        "type": "U",
                                                        "label": "Unload"
                                                    },
                                                    "valueColumns": [
                                                        {
                                                            "type": "C",
                                                            "column": "Unit"
                                                        },
                                                        {
                                                            "type": "W",
                                                            "column": "Wafer"
                                                        }
                                                    ]
                                                }
                                            },
                                            "columnFormatters": {}
                                        },
                                        "dataSourceId": "dsuht483gqzmbuze"
                                    }
                                }
                            }
                        ]
                    }
                },
                "description": "",
                "model_image": null,
                "creator": "ty_tree.kim@samsung.com",
                "create_time": "2017-02-11T07:32:25.629Z",
                "updater": "ty_tree.kim@samsung.com",
                "update_time": "2017-02-11T07:32:25.629Z",
                "type": null,
                "tag": null,
                "event_key": "170211_163225_629705"
            };
            return vo;
        },
        getMobileTestSample: function () {
            var vo = [
                {
                    "id": "mnsurbkqpnq6e4qk",
                    "project_id": "pt4rn27rtat4w8yb",
                    "label": "TEST",
                    "contents": {
                        "mid": "mnsurbkqpnq6e4qk",
                        "type": "visual",
                        "title": "TEST",
                        "functions": [
                            {
                                "func": "loadFromStaging",
                                "name": "Empty",
                                "param": {
                                    "modelId": "mr9ehbgjkn8jajja",
                                    "tableId": "tb7fvr82fccta97r"
                                },
                                "display": {
                                    "label": "1. 반가워, Brightics! (with iris)-Statistic Summary-In"
                                },
                                "persist": true,
                                "fid": "dsczs5nz756msym6"
                            },
                            {
                                "func": "loadFromAlluxio",
                                "name": "Subflow",
                                'outData': [
                                    "tmmjcw4t335tz4nv"
                                ],
                                "param": {
                                    "functions": [
                                        {
                                            "fid": "ffcfn6b42swamkvj",
                                            "func": "load",
                                            "name": "InOutData",
                                            'outData': [
                                                "tmmjcw4t335tz4nv"
                                            ],
                                            "param": {
                                                "io-mode": "read",
                                                "fs-type": "alluxiocsv",
                                                "df-names": [
                                                    "tmmjcw4t335tz4nv"
                                                ],
                                                "fs-paths": [
                                                    "/brtc/repo/shared/array_test"
                                                ]
                                            },
                                            "persist": true
                                        }
                                    ],
                                    "links": []
                                },
                                "display": {
                                    "label": "/brtc/repo/shared/array_test"
                                },
                                "persist": true,
                                "fid": "dsb33anhwk9gd8mz"
                            }
                        ],
                        "links": [],
                        "report": {
                            "pages": [
                                {
                                    "id": "rpja8cbfb2kcp3px",
                                    "contents": {
                                        "rcgd6f6sekkwrxum": {
                                            "id": "rcgd6f6sekkwrxum",
                                            "type": "chart",
                                            "size": {
                                                "width": 720,
                                                "height": 250
                                            },
                                            "position": {
                                                "top": 30,
                                                "left": 30
                                            },
                                            "options": {
                                                "chart": {
                                                    "type": "column",
                                                    "width": "100%",
                                                    "height": "100%"
                                                }
                                            },
                                            "dataSourceId": "dsczs5nz756msym6"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "description": "",
                    "model_image": null,
                    "creator": "ty_tree.kim@samsung.com",
                    "create_time": "2017-03-30T01:33:39.778Z",
                    "updater": "ty_tree.kim@samsung.com",
                    "update_time": "2017-04-10T04:45:06.440Z",
                    "type": null,
                    "tag": null,
                    "event_key": "170410_134506_440660"
                },
                {
                    "id": "mnsurbkqpnq6e4q2",
                    "project_id": "pt4rn27rtat4w8yb",
                    "label": "TEST",
                    "contents": {
                        "mid": "mnsurbkqpnq6e4q2",
                        "type": "visual",
                        "title": "TEST",
                        "functions": [
                            {
                                "func": "loadFromStaging",
                                "name": "Empty",
                                "param": {
                                    "modelId": "mr9ehbgjkn8jajja",
                                    "tableId": "tb7fvr82fccta97r"
                                },
                                "display": {
                                    "label": "2. 반가워, Brightics! (with iris)-Statistic Summary-In"
                                },
                                "persist": true,
                                "fid": "dsczs5nz756msym6"
                            },
                            {
                                "func": "loadFromAlluxio",
                                "name": "Subflow",
                                'outData': [
                                    "tmmjcw4t335tz4nv"
                                ],
                                "param": {
                                    "functions": [
                                        {
                                            "fid": "ffcfn6b42swamkvj",
                                            "func": "load",
                                            "name": "InOutData",
                                            'outData': [
                                                "tmmjcw4t335tz4nv"
                                            ],
                                            "param": {
                                                "io-mode": "read",
                                                "fs-type": "alluxiocsv",
                                                "df-names": [
                                                    "tmmjcw4t335tz4nv"
                                                ],
                                                "fs-paths": [
                                                    "/brtc/repo/shared/array_test"
                                                ]
                                            },
                                            "persist": true
                                        }
                                    ],
                                    "links": []
                                },
                                "display": {
                                    "label": "/brtc/repo/shared/array_test"
                                },
                                "persist": true,
                                "fid": "dsb33anhwk9gd8mz"
                            }
                        ],
                        "links": [],
                        "report": {
                            "pages": [
                                {
                                    "id": "rpja8cbfb2kcp3px",
                                    "contents": {
                                        "rcgd6f6sekkwrxum": {
                                            "id": "rcgd6f6sekkwrxum",
                                            "type": "chart",
                                            "size": {
                                                "width": 720,
                                                "height": 250
                                            },
                                            "position": {
                                                "top": 30,
                                                "left": 30
                                            },
                                            "options": {
                                                "chart": {
                                                    "type": "column",
                                                    "width": "100%",
                                                    "height": "100%"
                                                }
                                            },
                                            "dataSourceId": "dsczs5nz756msym6"
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "description": "",
                    "model_image": null,
                    "creator": "ty_tree.kim@samsung.com",
                    "create_time": "2017-03-30T01:33:39.778Z",
                    "updater": "ty_tree.kim@samsung.com",
                    "update_time": "2017-04-10T04:45:06.440Z",
                    "type": null,
                    "tag": null,
                    "event_key": "170410_134506_440660"
                }
            ];
            return vo;
        }
    };

}).call(this);