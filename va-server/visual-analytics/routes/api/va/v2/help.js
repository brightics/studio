var router = __REQ_express.Router();
var request = __REQ_request;

var jsdom = require("jsdom");
var MarkdownIt = require("markdown-it");

var getPalette = require("../v3/functions").getPalette;
var getPaletteModelType = require("../v3/functions").getPaletteModelType;
var getPaletteByModelType = require("../../../../lib/merge-palette");

var md = new MarkdownIt({
  html: true
}).use(require("markdown-it-ins"));

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

var renderFunctionHelp = function(req, res) {
  try {
    var operation = req.params.name || "_default";
    var targetFunc = req.query.func;
    if (operation.startsWith("udf_")) {
      getPalette(req, res).then(({ palette, fileContents, dbContents }) => {
        var func = operation.substring(4);
        var cont = dbContents.filter(element => element.id === func)[0];
        var pmd =
          cont && cont.markdown && cont.markdown !== null ? cont.markdown : "";
        var innerHtml = md.render(pmd);
        var status = "SUCCESS";
        var ejsNm = "function-reference";
        return res.render(ejsNm, {
          title: "Brightics Documentation",
          baseUrl: baseUrl,
          palette: palette,
          operatorHtml: innerHtml,
          operator: operation,
          mtype: req.query.type,
          status: status,
          subPath: subPath,
          version: __BRTC_CONF["use-spark"]
        });
      });
    } else {
      var modelType = req.query.type;
      if (modelType === "deeplearning") {
        var palette = getPaletteByModelType(modelType);
        responseFunctionHelp_DL(req, res, operation, palette);
      } else if (modelType === "script") {
        getPaletteModelType(req, res, modelType).then(({ palette }) => {
          responseFunctionHelp(req, res, operation, palette, [], targetFunc);
        });
      } else {
        getPalette(req, res).then(({ palette, fileContents }) => {
          for (var f in fileContents) {
            var func = fileContents[f].specJson.func;
            var category = fileContents[f].specJson.category;

            var exist = false;
            var obj = { func: func, visible: true };

            for (var c in palette) {
              if (palette[c].key === category) {
                for (var k in palette[c].functions) {
                  var fnUnit = palette[c].functions[k];
                  if (fnUnit.func === func) {
                    exist = true;
                    break;
                  }
                }
                if (!exist && category !== "udf") {
                  palette[c].functions.push(obj);
                }
              }
            }
          }
          responseFunctionHelp(
            req,
            res,
            operation,
            palette,
            fileContents,
            targetFunc
          );
        });
      }
    }
  } catch (err) {
    __BRTC_ERROR_HANDLER.sendError(res, 35021);
  }
};

var responseFunctionHelp_DL = function(req, res, operation, palette, addon_js) {
  __REQ_fs.readFile(
    __REQ_path.join(
      __dirname,
      "../../../../public/static/help/scala/" + operation + ".md"
    ),
    { encoding: "utf-8" },
    function(err, data) {
      var innerHtml;
      var status;
      if (!err) {
        innerHtml = md.render(data);
        status = "SUCCESS";
      } else {
        innerHtml = md.render(
          "### Sorry, this page is not available. Please contact Administrator."
        );
        status = "ERRNOTFOUND";
      }
      var ejsNm = "function-reference";

      for (var i in palette) {
        var functions = palette[i].functions;
        for (var f in functions) {
          console.log(f + " : " + functions[f].func);
        }
      }

      return res.render(ejsNm, {
        title: "Brightics Documentation",
        baseUrl: baseUrl,
        palette: palette,
        addon_js: addon_js ? addon_js.join("\n") : "",
        operatorHtml: innerHtml,
        operator: operation,
        mtype: req.query.type,
        status: status,
        subPath: subPath,
        version: __BRTC_CONF["use-spark"]
      });
    }
  );
};

var responseFunctionHelp = function(
  req,
  res,
  operation,
  palette,
  fileContents,
  targetFunc
) {
  try {
    var availableContext = ["common", "python", "scala"];
    var filename = operation;

    var context =
      req.query.context &&
      availableContext.some(function(value) {
        return value === req.query.context;
      })
        ? req.query.context
        : "";
    var func2spec = {};
    fileContents.forEach(json => {
      var spec = json.specJson;
      func2spec[spec.func] = spec;
      if (json.md) {
        func2spec[spec.func]["md"] = json.md;
      }
    });
    if (
      func2spec[targetFunc] &&
      func2spec[targetFunc]["md"] &&
      func2spec[targetFunc]["md"] !== ""
    ) {
      var innerHtml;
      var status;

      innerHtml = md.render(func2spec[targetFunc]["md"]);
      status = "SUCCESS";

      var ejsNm = "function-reference";
      return res.render(ejsNm, {
        title: "Brightics Documentation",
        baseUrl: baseUrl,
        palette: palette,
        operatorHtml: innerHtml,
        operator: operation,
        mtype: req.query.type,
        status: status,
        subPath: subPath,
        version: __BRTC_CONF["use-spark"]
      });
    } else {
      filename =
        func2spec[targetFunc] && func2spec[targetFunc].name
          ? func2spec[targetFunc].name
          : filename;
      __REQ_fs.readFile(
        __REQ_path.join(
          __dirname,
          "../../../../public/static/help/" + context + "/" + filename + ".md"
        ),
        { encoding: "utf-8" },
        function(err, data) {
          var innerHtml;
          var status;
          if (!err) {
            innerHtml = md.render(data);
            status = "SUCCESS";
          } else {
            innerHtml =
              "" +
              "<style>" +
              ".brtc-ul li" +
              "{" +
              "margin-bottom: 5px;" +
              "list-style-type: decimal;" +
              "}" +
              ".panel-heading" +
              "{" +
              "padding: 10px 15px;" +
              "border-bottom: 1px solid transparent;" +
              "border-top-right-radius: 3px;" +
              "border-top-left-radius: 3px;" +
              "background-color: #EEEEEE;" +
              "font-weight: 500;" +
              "}" +
              "</style>" +
              '<div class="panel bs-docs-function-note" style="display: block;">' +
              '<div class="panel-heading"><h3 class="panel-title"><strong>Note</strong></h3></div>' +
              '<div class="panel-body">' +
              '<ul class="brtc-ul">' +
              "<li>A significant digit is 10 digits for all analytic functions. We ignore the differences between each value of outputs from analytic function results and help pages in case more than 10 significant digits are the same.</li>" +
              "<li>When you use train and predict functions, the order and the number of columns should be the same for both functions.</li>" +
              "<li>We recommend you to preprocess abnormal values such as NaN or null beforehand. You can use Brightics preprocessing functions before analyzing data.</li>" +
              "<li>The result of the function may vary depending on the system even if the same seed is used.</li>" +
              "<li>The results of Spark and Python functions may differ even if you use the same function because of the internal algorithms are different.</li>" +
              "</ul>";
            "</div>" + "</div>";

            status = "ERRNOTFOUND";
          }
          var ejsNm = "function-reference";
          return res.render(ejsNm, {
            title: "Brightics Documentation",
            baseUrl: baseUrl,
            palette: palette,
            operatorHtml: innerHtml,
            operator: operation,
            mtype: req.query.type,
            status: status,
            subPath: subPath,
            version: __BRTC_CONF["use-spark"]
          });
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

var extractFormatString = function(docString, callback) {
  var htmlString = docString;
  var jquery = __REQ_fs.readFileSync(
    __REQ_path.join(
      __dirname,
      "../../../../public/js/plugins/jquery/jquery-3.3.1.min.js"
    ),
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
  getPalette(req, res).then(({ palette, fileContents }) => {
    for (var fc in fileContents) {
      if (fileContents[fc].specJson.func === func) {
          models = fileContents[fc].exampleModels;
        break;
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
        __BRTC_ERROR_HANDLER.sendError(res, 32011);
    }
  });
};

const getBase64SampleImage = function(req, res) {
  var func = req.params.func;
  var imageName = req.params.fileName;
  var images = [];
  var base64Image = "";
  getPalette(req, res).then(({ palette, fileContents }) => {
    for (var fc in fileContents) {
      if (fileContents[fc].specJson.func === func) {
        images = fileContents[fc].sampleImages;
        break;
      }
    }
    for (var img in images) {
      if (images[img].fileName === imageName) {
        base64Image = images[img].base64;
        break;
      }
    }
    if (base64Image !== '') {
        var im = base64Image.split(',')[1];
        var imType = base64Image.split(',')[0];
        var type = imType.split(':')[1].split(';')[0];
        var format = imType.split(':')[1].split(';')[1];
        var img = Buffer.from(im, format);
        res.writeHead(200, {
            'Content-Type': type,
            'Content-Length': img.length
        });
        res.end(img);
    } else {
        __BRTC_ERROR_HANDLER.sendError(res, 32011);
    }
  });
};

router.get("/function", renderFunctionHelp);
router.get("/function/:name", renderFunctionHelp);
router.get("/functionformat/:name", responseFormatHelp);
router.get("/downloads/:func/example-model/:fileName", downloadExampleModelJson);
router.get("/images/:func/:fileName", getBase64SampleImage);

module.exports = router;
