var router = __REQ_express.Router();
var request = __REQ_request;
var makePalette = require('../v3/functions').makePalette;

var getPaletteByModelType = require('../../../../lib/merge-palette');


router.get('/palette/:modelType', function (req, res) {
    var modelType = req.params.modelType;
    var palette = getPaletteByModelType(modelType);
    if (palette) {
        if (modelType === 'data') {
            makePalette(req, res, palette, modelType)
                .then(({palette}) => {
                    res.send(palette)
                })
                .catch(function (errorResponse) {
                    if (errorResponse && errorResponse.statusCode === 401) {
                        req.logout();
                        req.session = null;
                        res.status(401).send('Unauthorized');
                    } else if (errorResponse) {
                        __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(errorResponse.body), errorResponse.statusCode);
                    }
                })
        } else {
            res.send(palette);
        }
    } else {
        __BRTC_ERROR_HANDLER.sendError(res, 40, 'Invalid model type: ' + modelType);
    }
});

router.get('/templates/:modelType', function (req, res) {
    try {
        var modelType = req.params.modelType,
            templates = [], contents = {},
            path = './public/static/model-template/' + modelType + '/';

        if (typeof modelType === 'undefined') {
            res.send([]);
        }

        __REQ_fs.readdir(path, function (err, files) {
            if (err) __BRTC_ERROR_HANDLER.sendError(res, 40, 'Invalid model type: ' + modelType);
            for (var i = 0; i < files.length; i++) {
                if (!files[i].endsWith('.json')) continue;

                contents = JSON.parse(__REQ_fs.readFileSync(path + files[i], 'utf8'));
                if (contents.title === 'Default') {
                    templates.splice(0, 0, {
                        name: contents.title,
                        description: contents.description || '',
                        contents: contents
                        // ,thumbnail: path + files[i].split('.json')[0] + '.png'
                    });
                } else {
                    templates.push({
                        name: contents.title,
                        description: contents.description || '',
                        contents: contents,
                        thumbnail: '/static/model-template/' + modelType + '/' + files[i].split('.json')[0] + '.png'
                    })
                }
            }
            res.send(templates);
        });
    } catch (err) {
        res.send([]);
    }
});

router.get('/help/functions/:funcType', function (req, res) {
    try {
        var helpDoc = __REQ_fs.readFileSync('./public/static/help/' + req.params.funcType + '.html', 'utf8');
        res.send(helpDoc);
    } catch (err) {
        res.status(500).send("Sorry, the help document is not found.");
    }
});

router.get('/optcontrol', function (req, res) {
    try {
        var funcNm = req.query.func;
        var controlSpec = JSON.parse(__REQ_fs.readFileSync('./public/static/opt/' + funcNm + '.json', 'utf8')),
            method = req.query.method,
            methodType = req.query.methodType;
        var resultMethodSpec = {};
        if (controlSpec && Array.isArray(controlSpec)) {
            resultMethodSpec = controlSpec.find(function (methodObj) {
                if (methodType !== 'undefined') {
                    return methodObj.key ===  method && methodObj.type ===  methodType
                } else {
                    return methodObj.key ===  method
                }
            })
        }
        res.send(resultMethodSpec);
    } catch (err) {
        res.status(500).send("Sorry, the document is not found.");
    }
});

router.get('/message/:locale', function (req, res) {

    var locale = req.params.locale || 'en';

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/message/' + locale);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode ===  200) {
                try {
                    res.json(JSON.parse(response.body));
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body), response.statusCode);
            }
        }
    })
});


router.get('/functionlabel/:locale', function (req, res) {

    var locale = req.params.locale || 'en';

    var options = __BRTC_CORE_SERVER.createRequestOptions('GET', '/api/core/v2/functionlabel/' + locale);
    __BRTC_CORE_SERVER.setBearerToken(options, req.accessToken);
    request(options, function (error, response, body) {
        if (error) {
            __BRTC_ERROR_HANDLER.sendServerError(res, error);
        } else {
            if (response.statusCode === 200) {
                try {
                    res.json(JSON.parse(response.body));
                } catch (ex) {
                    __BRTC_ERROR_HANDLER.sendServerError(res, ex);
                }
            } else {
                __BRTC_ERROR_HANDLER.sendMessage(res, __BRTC_ERROR_HANDLER.parseError(body));
            }
        }
    })
});

module.exports = router;
