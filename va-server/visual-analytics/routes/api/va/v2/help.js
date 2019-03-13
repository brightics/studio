var router = __REQ_express.Router();
var request = __REQ_request;

var jsdom = require('jsdom');
var MarkdownIt = require('markdown-it');

var getPalette = require('../v3/functions').getPalette;
var getPaletteModelType = require('../v3/functions').getPaletteModelType;
var getPaletteByModelType = require('../../../../lib/merge-palette');

var md = new MarkdownIt({
    html: true,
}).use(require('markdown-it-ins'));

var subPath = __BRTC_CONF['sub-path'] || '';
var subPathUrl = subPath ? ('/' + subPath) : ('');
var baseUrl = __BRTC_CONF['callback-host'] + subPathUrl + '/';

var responseFunctionHelp_DL = function (req, res, operation, palette, addon_js) {
    __REQ_fs.readFile(__REQ_path.join(__dirname, '../../../../public/static/help/scala/' + operation + '.md'), {encoding: 'utf-8'}, function (err, data) {
        var innerHtml;
        var status;
        if (!err) {
            innerHtml = md.render(data);
            status = 'SUCCESS';
        } else {
            innerHtml = md.render('### Sorry, this page is not available. Please contact Administrator.');
            status = 'ERRNOTFOUND';
        }
        var ejsNm = 'function-reference';

        for (var i in palette) {
            var functions = palette[i].functions;
            for (var f in functions) {
                console.log(f + ' : ' + functions[f].func);
            }
        }

        return res.render(ejsNm, {
            title: 'Brightics Documentation',
            baseUrl: baseUrl,
            palette: palette,
            addon_js: addon_js ? addon_js.join('\n') : '',
            operatorHtml: innerHtml,
            operator: operation,
            mtype: req.query.type,
            status: status,
            subPath: subPath,
            version: __BRTC_CONF['use-spark'],
        });
    });
};

var responseFunctionHelp = function (req, res, operation, palette, fileContents) {
    try {
        var availableContext = ['common', 'python', 'scala'];
        var filename = operation;
        var context = req.query.context && availableContext.some(function (value) {
            return value === req.query.context;
        })
            ? req.query.context : '';
        let func2spec = {};
        fileContents.forEach((json) => {
            let spec = json.specJson;
            func2spec[spec.func] = spec;
        });
        filename = (func2spec[operation] && func2spec[operation].name) ? func2spec[operation].name : filename;
        __REQ_fs.readFile(__REQ_path.join(__dirname, '../../../../public/static/help/' + context + '/' + filename + '.md'), {encoding: 'utf-8'}, function (err, data) {
            var innerHtml;
            var status;
            if (!err) {
                innerHtml = md.render(data);
                status = 'SUCCESS';
            } else {
                innerHtml = '' +
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
                    '</ul>' +
                    '</div>' +
                    '</div>';

                status = 'ERRNOTFOUND';
            }
            var ejsNm = 'function-reference';
            return res.render(ejsNm, {
                title: 'Brightics Documentation',
                baseUrl: baseUrl,
                palette: palette,
                operatorHtml: innerHtml,
                operator: operation,
                mtype: req.query.type,
                status: status,
                subPath: subPath,
                version: __BRTC_CONF['use-spark'],
            });
        });
    } catch (err) {
        console.log(err);
    }
};

var renderFunctionHelp = function (req, res) {
    const matFn = (func) => (fnUnit) => fnUnit.func === func;
    try {
        var operation = req.params.name || '_default';
        if (operation.startsWith('udf_')) {
            getPalette(req, res)
                .then(({palette, fileContents, dbContents}) => {
                    var func = operation.substring(4);
                    var cont = dbContents.filter((element) => element.id === func)[0];
                    var pmd = (cont && cont.markdown && cont.markdown !== null) ? cont.markdown : '';
                    var innerHtml = md.render(pmd);
                    var status = 'SUCCESS';
                    var ejsNm = 'function-reference';
                    return res.render(ejsNm, {
                        title: 'Brightics Documentation',
                        baseUrl: baseUrl,
                        palette: palette,
                        operatorHtml: innerHtml,
                        operator: operation,
                        mtype: req.query.type,
                        status: status,
                        subPath: subPath,
                        version: __BRTC_CONF['use-spark'],
                    });
                });
            return;
        }
        var modelType = req.query.type;
        if (modelType === 'deeplearning') {
            var palette = getPaletteByModelType(modelType);
            responseFunctionHelp_DL(req, res, operation, palette);
            return;
        }
        if (modelType === 'script') {
            getPaletteModelType(req, res, modelType)
                .then(({palette}) => {
                    responseFunctionHelp(req, res, operation, palette, []);
                });
            return;
        }
        getPalette(req, res)
            .then(({palette, fileContents}) => {
                for (var f in fileContents) {
                    var func = fileContents[f].specJson.func;
                    var category = fileContents[f].specJson.category;

                    var obj = {func: func, visible: true};

                    for (var c in palette) {
                        if (palette[c].key !== category) continue;
                        var exist = palette[c].functions.some(matFn(func));
                        if (!exist && category !== 'udf') {
                            palette[c].functions.push(obj);
                        }
                    }
                }
                responseFunctionHelp(req, res, operation, palette, fileContents);
            });
    } catch (err) {
        __BRTC_ERROR_HANDLER.sendError(res, 35021);
    }
};

var extractFormatString = function (docString, callback) {
    var htmlString = docString;
    var jquery = __REQ_fs.readFileSync(__REQ_path.join(__dirname, '../../../../public/js/plugins/jquery/jquery-3.3.1.min.js'), 'utf8');
    jsdom.env({
        src: [jquery],
        html: htmlString,
        done: function (err, window) {
            var $ = window.$;
            var format = $(window.document.body).find('h2:contains("Format")').next()
                .next()
                .text();
            callback(format);
        },
    });
};

var responseFormatHelp = function (req, res) {
    try {
        var operation = req.params.name;
        var availableContext = ['python', 'scala'];
        var context = req.query.context && availableContext.some(function (value) {
            return value === req.query.context;
        })
            ? req.query.context
            : '';
        __REQ_fs.readFile(__REQ_path.join(__dirname, '../../../../public/static/help/' + context + '/' + operation + '.md'), {encoding: 'utf-8'}, function (err, data) {
            var html = '<!DOCTYPE html><html><head></head><body>' + md.render(data) + '</body></html>';
            var callback = function (formatText) {
                res.json({
                    format: formatText,
                });
            };
            extractFormatString(html, callback);
        });
    } catch (err) {
        console.log(err);
    }
};


router.get('/function', renderFunctionHelp);
router.get('/function/:name', renderFunctionHelp);
router.get('/functionformat/:name', responseFormatHelp);

module.exports = router;
