(function () {
  'use strict';

  var root = this;
  var Brightics = root.Brightics;

  /**************************************************************************
   *                                 FnUnit                                  
   *************************************************************************/
  Brightics.VA.Core.Functions.Library.loadFromStaging = {
      "category": "io",
      "defaultFnUnit": {
          "func": "loadFromStaging",
          "name": "Empty",
          "param": {
              "modelId": "",
              "tableId": ""
          },
          "display": {
              "label": "Load From Staging"
          }
      },
      "description": "Load data from staging.",
      "mandatory": [
          "fs-paths"
      ],
      "tags": [
          "Load From Staging"
      ],
      "in-range": {
          "min": 0,
          "max": 0
      },
      "out-range": {
          "min": 1,
          "max": 1
      }
  };
  
}).call(this);