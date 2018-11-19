var codegen = require('../../../../lib/brtc-va-udf-func-ui-gen');

var PROPERTIES_CONTROLS = {
    string: {
        type: 'Input',
        options: {
            placeHolder: 'Enter Value',
            maxLength: 2048
        }
    },
    int: {
        type: 'NumericInput',
        options: {
            numberType: 'int',
            min: 0,
            minus: false,
            placeHolder: 'Enter Value'
        }
    },
    double: {
        type: 'NumericInput',
        options: {
            numberType: 'double',
            min: 0,
            minus: false,
            placeHolder: 'Enter Value'
        }
    },
    expression: {
        type: 'CodeMirrorInput',
        options: {
            placeholder: 'Enter Value. \\n Ex)Array("a", "b") \\n Map("a"->"b")'
        },
        mandatory: true
    }
};

var createUDFJSON = function (req) {
    var defaultUDFJSON = {
        category: 'udf',
        defaultFnUnit: {
            'func': 'udf',
            'name': 'ScalaScript',
            'inData': [],
            'outData': [],
            'param': {
                'in-table-alias': [],
                'script': '',
                'out-table-alias': [],
                'input-variables': []
            }
            ,
            'display': {
                'label': 'UDF',
                'diagram': {
                    'position': {
                        'x': 20, 'y': 10
                    }
                },
                'sheet': {
                    'in': {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]},
                    'out': {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]}
                }
            }
        },
        description: '',
        tags: ['UDF', 'User Define Function'],
        'in-range': {min: 1, max: 10},
        'out-range': {min: 1, max: 10},
        'properties-layout': []
    };
    defaultUDFJSON.defaultFnUnit.func = req.params.udfId;
    defaultUDFJSON.defaultFnUnit.name = req.body.name;
    defaultUDFJSON.defaultFnUnit.display.label = req.body.udf_name + ' ver.' + req.body.udf_version;
    defaultUDFJSON.defaultFnUnit.param.script = req.body.contents;
    defaultUDFJSON['in-range'].min = req.body.in_table_count;
    defaultUDFJSON['out-range'].min = req.body.out_table_count;
    for (var i in req.body.udfParams) {
        if (req.body.udfParams[i].inout_type === 'IN') {
            var inputVariable = [];
            inputVariable.push(req.body.udfParams[i].param_name);
            inputVariable.push(req.body.udfParams[i].arg_type);
            inputVariable.push('');
            defaultUDFJSON.defaultFnUnit.param['input-variables'].push(inputVariable);

            var propertyLayout = {
                "param": req.body.udfParams[i].param_name,
                "label": req.body.udfParams[i].param_name.charAt(0).toUpperCase() + req.body.udfParams[i].param_name.slice(1),
                "control": PROPERTIES_CONTROLS[req.body.udfParams[i].arg_type],
                "mandatory": true
            };
            defaultUDFJSON['properties-layout'].push(propertyLayout);
        }
        if (req.body.udfParams[i].inout_type === 'OUT') {
            defaultUDFJSON.defaultFnUnit.param['out-table-alias'].push(req.body.udfParams[i].param_name);
        }
    }
    defaultUDFJSON.description = req.body.description.replace(/<(?:.|\n)*?>/gm, '');
    defaultUDFJSON.tags.push(req.body.udf_name);
    defaultUDFJSON.tags.push(req.body.udf_version);

    console.log(defaultUDFJSON);
    return defaultUDFJSON;
};

exports.createUdf = function (req, res) {
    // TODO

    var snippet = codegen.generateSnippet(createUDFJSON(req));
    console.log(snippet);

    var dir = __REQ_path.join(__dirname, '../../public/js/va/user-defined-functions');
    var _path = '';
    var fileName = req.params.udfId + '.js';

    if (!__REQ_fs.existsSync(dir)) {
        __REQ_fs.mkdirSync(dir);
    }

    _path = dir + '/' + fileName;

    var stream = __REQ_fs.createWriteStream(_path);
    stream.once('open', function (fd) {
        stream.write(snippet);
        stream.end();
    });

    var udfjsFilePath = __REQ_path.join(__dirname, '../../public/js/va/brightics-va-udf.js');
    if (!__REQ_fs.existsSync(udfjsFilePath)) {
        __REQ_fs.createWriteStream(udfjsFilePath);
    }

    __REQ_fs.readFile(udfjsFilePath, function (err, content) {
        if (err) throw err;
        __REQ_fs.appendFileSync(udfjsFilePath, snippet);
    });
};

exports.renderUdfDoc = function (req, res) {
};