const fs = require('fs');
const path = require('path');
const express = require('express');
const jsdom = require('jsdom');
const MarkdownIt = require('markdown-it');
const router = express.Router();

const { getPalette } = require('../v3/functions');

const md = new MarkdownIt({
  html: true
}).use(require('markdown-it-ins'));

const ejsNm = 'function-reference';
const title = 'Brightics Documentation';

const renderEjs = (req, res, ejsNm, title, palette, innerHtml, operation, status, lang) => {
  return res.render(ejsNm, {
    title: title,
    palette: palette,
    operatorHtml: innerHtml,
    operator: operation,
    mtype: req.query.type,
    status: status,
    lang
  });
};

const renderEjsByFileSystem = (req, res, func2spec, targetFunc, operation, palette, lang, context) => {
  let filename = operation;
  if (func2spec[targetFunc] && func2spec[targetFunc].name) {
    filename = func2spec[targetFunc].name;
  }
  switch (operation) {
    case 'numericalVariableDerivation':
      filename = 'AddFunctionColumn';
      break;
    case 'load':
      filename = 'Load';
      break;
    case 'dbReader':
      filename = 'DBReader';
      break;
    case 'loadDpData':
      filename = 'LoadDpData';
      break;
    case 'refine':
      filename = 'RefineData';
      break;
    case 'queryExecutor':
      filename = 'SQLExecutor';
      break;
  }
  const helpReadCallback = function (err, data) {
    let innerHtml;
    let status;
    if (!err) {
      innerHtml = md.render(data);
      status = 'SUCCESS';
    } else {
      innerHtml =
        '' +
        '<style>' +
        '.brtc-ul li' +
        '{' +
        'margin-bottom: 5px;' +
        'list-style-type: decimal;' +
        '}' +
        '.panel-heading' +
        '{' +
        'padding: 10px 15px;' +
        'border-bottom: 1px solid transparent;' +
        'border-top-right-radius: 3px;' +
        'border-top-left-radius: 3px;' +
        'background-color: #EEEEEE;' +
        'font-weight: 500;' +
        '}' +
        '</style>' +
        '<div class="panel bs-docs-function-note" style="display: block;">' +
        '<div class="panel-heading"><h3 class="panel-title"><strong>Note</strong></h3></div>' +
        '<div class="panel-body">' +
        '<ul class="brtc-ul">' +
        '<li>A significant digit is 10 digits for all analytic functions. We ignore the differences between each value of outputs from analytic function results and help pages in case more than 10 significant digits are the same.</li>' +
        '<li>When you use train and predict functions, the order and the number of columns should be the same for both functions.</li>' +
        '<li>We recommend you to preprocess abnormal values such as NaN or null beforehand. You can use Brightics preprocessing functions before analyzing data.</li>' +
        '<li>The result of the function may vary depending on the system even if the same seed is used.</li>' +
        '<li>The results of Spark and Python functions may differ even if you use the same function because of the internal algorithms are different.</li>' +
        '</ul>';

      status = 'ERRNOTFOUND';
    }
    renderEjs(req, res, ejsNm, title, palette, innerHtml, operation, status, lang);
  };

  let filePath = path.join(
    __dirname,
    `../../../../public/static/help/${context}/${lang ? lang : 'en'}/${filename}.md`
  );
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, `../../../../public/static/help/${context}/en/${filename}.md`);
  }
  fs.readFile(filePath, { encoding: 'utf-8' }, helpReadCallback);
};


var responseFunctionHelp = function(req, res, operation, palette, fileContents, targetFunc, lang ) {
  let status = 'ERRNOTFOUND';
  try {
    const availableContext = ['common', 'python'];
    // let filename = operation;

    const context =
      req.query.context &&
      availableContext.some(function (value) {
        return value === req.query.context;
      })
        ? req.query.context
        : '';

    const func2spec = {};
    fileContents.forEach((json) => {
      const spec = json.specJson;
      func2spec[spec.func] = spec;
      if (json.md) {
        func2spec[spec.func]['md'] = json.md;
      }
    });

    if (func2spec[targetFunc] && func2spec[targetFunc]['md']) {
      const innerHtml = md.render(
        func2spec[targetFunc]['md'][lang] || func2spec[targetFunc]['md']['en'] || func2spec[targetFunc]['md']
      );
      status = 'SUCCESS';
      renderEjs(req, res, ejsNm, title, palette, innerHtml, operation, status, lang);
    } else {
      renderEjsByFileSystem(req, res, func2spec, targetFunc, operation, palette, lang, context);
    }
  } catch (err) {
    const innerHtml =
      '<h3>&nbsp;</h3><h5>Sorry, the help document is not found. Please contact the administrator.</h5>';
    renderEjs(req, res, ejsNm, title, palette, innerHtml, operation, status, lang);
  }
};

var renderDBContentFunctionHelper = function(req, res, operation, targetFunc, lang) {
  getPalette(req, res)
    .then(({ palette, fileContents, dbContents }) => {
      // var func = operation.substring(4);
      var cont = dbContents.filter(element => element.id === targetFunc)[0];
      var dbContentMd = "";
      if (cont && cont.markdown) {
        var dbContentMarkDown = JSON.parse(cont.markdown);
        if (dbContentMarkDown[lang]){
          dbContentMd = dbContentMarkDown[lang];
        } else if(dbContentMarkDown["en"] && dbContentMarkDown["en"]!==''){
          dbContentMd = dbContentMarkDown["en"];
        } else if( typeof dbContentMarkDown ==='string'){
          dbContentMd = dbContentMarkDown;
        }else{
          dbContentMd = ''
        }
      }
      var innerHtml = md.render(dbContentMd);
      var status = "SUCCESS";
      var ejsNm = "function-reference";
      return res.render(ejsNm, {
        title: "Brightics Documentation",
        palette: palette,
        operatorHtml: innerHtml,
        operator: operation,
        mtype: req.query.type,
        status: status,
        subPath: subPath,
        version: __BRTC_CONF["use-spark"]
      });
    })
    .catch(() => {
      __BRTC_ERROR_HANDLER.sendError(res, 35021);
    });
};

var renderDataFlowFunctionHelper = function( req, res, operation, targetFunc, lang ) {
  getPalette(req, res)
    .then(({ palette, fileContents }) => {
      // for (var f in fileContents) {
      //   var func = fileContents[f].specJson.func;
      //   var category = fileContents[f].specJson.category;
      //
      //   var exist = false;
      //   var obj = { func: func, visible: true };
      //
      //   for (var c in palette) {
      //     if (palette[c].key === category) {
      //       for (var k in palette[c].functions) {
      //         var fnUnit = palette[c].functions[k];
      //         if (fnUnit.func === func) {
      //           exist = true;
      //           break;
      //         }
      //       }
      //       if (!exist && category !== "udf") {
      //         palette[c].functions.push(obj);
      //       }
      //     }
      //   }
      // }
      responseFunctionHelp( req, res, operation, palette, fileContents, targetFunc, lang );
    })
    .catch(() => {
      __BRTC_ERROR_HANDLER.sendError(res, 35021);
    });
};

var renderFunctionHelp = function(req, res) {
  try {
    var operation = req.params.name || "_default";
    var targetFunc = req.query.func;
    var lang = req.query.lang || 'en';

    if (operation.startsWith("udf_") || operation==='DistributedJdbcLoader') {
      renderDBContentFunctionHelper(req, res, operation, targetFunc, lang);
    }else {
      renderDataFlowFunctionHelper(req, res, operation, targetFunc, lang);
    }
  } catch (err) {
    __BRTC_ERROR_HANDLER.sendError(res, 35021);
  }
};

var extractFormatString = function(docString, callback) {
  var htmlString = docString;
  var jquery = __REQ_fs.readFileSync(
    __REQ_path.join(__dirname,
      "../../../../public/js/plugins/jquery/jquery.min.js"),
    "utf8"
  );
  jsdom.env({
    src: [jquery],
    html: htmlString,
    done: function(err, window) {
      var $ = window.$;
      var format = $(window.document.body)
        .find('h2:contains("Format")')
        .next()
        .next()
        .text();
      callback(format);
    }
  });
};

var responseFormatHelp = function(req, res) {
  try {
    var operation = req.params.name;
    var availableContext = ["python", "scala"];
    var context =
      req.query.context &&
      availableContext.some(function(value) {
        return value === req.query.context;
      })
        ? req.query.context
        : "";
    __REQ_fs.readFile(
      __REQ_path.join(
        __dirname,
        "../../../../public/static/help/" + context + "/" + operation + ".md"
      ),
      { encoding: "utf-8" },
      function(err, data) {
        var html =
          "<!DOCTYPE html><html><head></head><body>" +
          md.render(data) +
          "</body></html>";
        var callback = function(formatText) {
          res.json({
            format: formatText
          });
        };
        extractFormatString(html, callback);
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const downloadExampleModelJson = function(req, res) {
  var func = req.params.func;
  var modelName = req.params.fileName;
  var models = [];
  var modelContents = "";
  getPalette(req, res).then(({ palette, fileContents, dbContents  }) => {
    for (var fc in fileContents) {
      if (fileContents[fc].specJson.func === func) {
        models = fileContents[fc].exampleModels;
        break;
      }
    }
    if (models.length === 0){
      for (var dc in dbContents) {
        let dbContentsSpec = JSON.parse(dbContents[dc].contents)
        if (dbContentsSpec.func === func) {
          models = dbContents[dc].example_models ? JSON.parse(dbContents[dc].example_models): [];
          break;
        }
      }
    }

    for (var model in models) {
      if (models[model].fileName === modelName) {
        modelContents = models[model].contents;
        break;
      }
    }
    if (modelContents !== '') {
      res.send(JSON.stringify(modelContents));
    } else {
      __BRTC_ERROR_HANDLER.sendError(res, 35021);
    }
  });
};

const getBase64SampleImage = function(req, res) {
  var func = req.params.func;
  var imageName = req.params.fileName;
  var images = [];
  var base64Image = "";
  getPalette(req, res).then(({ palette, fileContents, dbContents }) => {
    for (let fc in fileContents) {
      if (fileContents[fc].specJson.func === func) {
        images = fileContents[fc].sampleImages;
        break;
      }
    }
    if (images.length === 0) {
      for (let dc in dbContents) {
        let dbContentsSpec = JSON.parse(dbContents[dc].contents)
        if (dbContentsSpec.func === func) {
          images = dbContents[dc].sample_images ? JSON.parse(dbContents[dc].sample_images) : [];
          break;
        }
      }
    }
    for (var img in images) {
      if (images[img].fileName === imageName) {
        base64Image = images[img].base64;
        break;
      }
    }
    if (base64Image !== "") {
      var im = base64Image.split(",")[1];
      var imType = base64Image.split(",")[0];
      var type = imType.split(":")[1].split(";")[0];
      var format = imType.split(":")[1].split(";")[1];
      var img = Buffer.from(im, format);
      res.writeHead(200, {
        "Content-Type": type,
        "Content-Length": img.length
      });
      res.end(img);
    } else {
      __BRTC_ERROR_HANDLER.sendError(res, 35021);
    }
  });
};

router.get("/function", renderFunctionHelp);
router.get("/function/:name", renderFunctionHelp);
router.get("/functionformat/:name", responseFormatHelp);
router.get("/downloads/:func/example-model/:fileName", downloadExampleModelJson);
router.get("/images/:func/:fileName", getBase64SampleImage);

module.exports = router;
