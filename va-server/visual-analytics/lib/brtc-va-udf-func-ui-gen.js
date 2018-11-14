var camelize = function (str) {
    var result = str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
    return result.charAt(0).toUpperCase() + result.slice(1);
};

var _gen_createContentsAreaControls = function (fnUnit, properties) {
    var lines = [];

    lines.push('__clazz__Properties.prototype.createContentsAreaControls = function ($parent) {');
    lines.push('    Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createContentsAreaControls.call(this, $parent);')

    lines.push('    this.render = {');
    var i, del;
    for (i = 0; i < properties.length; i++) {
        del = (i < properties.length - 1 && properties.length > 1) ? ',' : '';
        lines.push('        ' + '\'' + properties[i].param + '\': this.render' + camelize(properties[i].param) + 'Control' + del);
    }
    lines.push('    };');

    lines.push('    ');
    lines.push('    this.$elements = {};');
    lines.push('    this.controls = {};');
    lines.push('    ');
    for (i = 0; i < properties.length; i++) {
        lines.push('    this.create' + camelize(properties[i].param) + 'Control();');
    }

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_fillControlValues = function (fnUnit, properties) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.fillControlValues = function () {');

    for (var i = 0; i < properties.length; i++) {
        if (properties[i].control.type === 'ColumnSelector') {
            lines.push('    var _this = this;');
            lines.push('    var columns;');
            if (properties[i].control['ref-table']['set-type'] === 'single') {
                lines.push('    ');
                lines.push('    columns = _this.getColumnsOfInTable(' + properties[i].control['ref-table'].indexes[0] + ', ' + JSON.stringify(properties[i].control['ref-table']['column-type']) + ');');
                lines.push('    _this.controls[\'' + properties[i].param + '\'].setItems(columns);');
            }
        }
        if (properties[i].control.type === 'CodeMirrorInput') {
            lines.push('    this.hintList=[];');
            lines.push('    this.hintList = $.extend(true, this.hintList, CodeMirror.hintWords[\'text/x-scala\']);');
            lines.push('    var columns = [];');
            lines.push('    var funcDef = this.getFunctionDef();');
            lines.push('    var minRow = funcDef[\'in-range\'].min || 1;');
            lines.push('    if (this.dataMap) {');
            lines.push('        for (var i = 0; i < minRow; i++) {');
            lines.push('            if (this.options.fnUnit[\'inData\'][i]) {');
            lines.push('                var aa = this.dataMap[this.options.fnUnit[\'inData\'][i]].columns;');
            lines.push('                columns = columns.concat(aa);');
            lines.push('            }');
            lines.push('        }');
            lines.push('    }');
            lines.push('    for (var i in this.options.fnUnit[\'inData\']) {');
            lines.push('        this.hintList.push(\'inputs(\'+i+\')\');');
            lines.push('    }');
            lines.push('    for (var i in columns) {');
            lines.push('       this.hintList.push(columns[i].name)');
            lines.push('    }');
            lines.push('    this.controls[\'' + properties[i].param + '\'].codeMirror.options.hintOptions.list = [].concat(this.hintList);');
        }
    }

// end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createColumnsControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-columnlist"/>\');');
    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        var opt = ' + JSON.stringify(property.control.options) + ';');
    lines.push('        opt.changed = function (type, data) { ');
    if (!fnUnit.param[property.param]) {
        throw {message: '[' + property.param + '] does not exist in FnUnit Parameters.'};
    }
    if (Array.isArray(fnUnit.param[property.param][0])) {
        lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', [ data.items ]);');
    } else {
        lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', data.items);');
    }
    lines.push('            _this.executeCommand(command)');
    lines.push('        };');
    lines.push('        _this.controls[\'' + property.param + '\'] = _this.createColumnList(_this.$elements[\'' + property.param + '\'], opt);');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createNumericInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-numberinput"/>\');');
    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        var opt = ' + JSON.stringify(property.control.options) + ';');
    lines.push('        _this.controls[\'' + property.param + '\'] = _this.createNumericInput(_this.$elements[\'' + property.param + '\'], opt);');
    lines.push('        _this.controls[\'' + property.param + '\'].onChange(function () {');
    lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', this.getValue());');
    lines.push('            _this.executeCommand(command);');
    lines.push('        });');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')


    // end of function  
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createRadioButtonControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');

    for (var i in property.control.options.items) {
        lines.push('    _this.$elements[\'' + property.param + '.' + property.control.options.items[i].value + '\'] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-radiobutton">' + property.control.options.items[i].label + '</div>\');');
    }

    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push(' ');

    for (var i in property.control.options.items) {
        var itemKey = property.param + '.' + property.control.options.items[i].value;
        lines.push('        $container.append(_this.$elements[\'' + itemKey + '\']);');
        lines.push('        _this.controls[\'' + itemKey + '\'] = _this.createRadioButton(_this.$elements[\'' + itemKey + '\'], {width: \'' + property.control.options.items[i].width + '\', groupName: \'' + property.control.options.groupName + '\'});');
        lines.push('        _this.$elements[\'' + itemKey + '\'].on(\'checked\', function (event) {');
        lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', \'' + property.control.options.items[i].value + '\');');
        lines.push('            _this.executeCommand(command);');
        lines.push('        });');
        lines.push(' ');
    }

    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')


    // end of function  
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createCheckBoxControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox-container"></div>\');');
    lines.push('    var $selectAllButton = $(\'<input type="button" value="Select All" style="width: 100%; float:left; margin-left: 0px;"/>\');');
    lines.push('    var $clearAllButton = $(\'<input type="button" value="Unselect All" style="width: 100%; float:left; margin-left: 2px; margin-bottom: 2px;"/>\');');
    lines.push('    _this.$elements[\'' + property.param + '\'].append($selectAllButton);');
    lines.push('    _this.$elements[\'' + property.param + '\'].append($clearAllButton);');

    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        _this.createButton($selectAllButton, {height: 23}, \'brtc-va-editors-sheet-controls-width-6\');');
    lines.push('        _this.createButton($clearAllButton, {height: 23}, \'brtc-va-editors-sheet-controls-width-6\');');
    lines.push('');
    lines.push('        var items = ' + JSON.stringify(property.control.options.items) + ';');
    lines.push('        var itemKey;');
    lines.push('        var changeHandler = function () {');
    lines.push('            $(window).trigger(\'mousedown\');');
    lines.push('            var checked = [];');
    lines.push('            for (var i in items) {');
    lines.push('                itemKey = \'' + property.param + '.\' + items[i].value;');
    lines.push('                if (_this.$elements[itemKey].val() === true) {');
    lines.push('                    checked.push(_this.$elements[itemKey].data(\'tag\'));');
    lines.push('                }');
    lines.push('            }');
    lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', checked);');
    lines.push('            _this.executeCommand(command);');
    lines.push('        };');
    lines.push('        for (var i in items) {');
    lines.push('            itemKey = \'' + property.param + '.\' + items[i].value;');
    lines.push('            _this.$elements[itemKey] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-checkbox"></div>\');');
    lines.push('            _this.$elements[itemKey].text(items[i].label);');
    lines.push('            _this.$elements[itemKey].data(\'tag\', items[i].value);');
    lines.push('            _this.$elements[\'' + property.param + '\'].append(_this.$elements[itemKey]);');
    lines.push('            _this.controls[itemKey] = _this.createCheckBox(_this.$elements[itemKey], {}, \'brtc-va-editors-sheet-controls-width-12\')');
    lines.push('            _this.$elements[itemKey].on(\'change\', changeHandler);');
    lines.push('        }');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')

    // end of function  
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<input type="text" class="brtc-va-editors-sheet-controls-propertycontrol-input"/>\');');
    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        var opt = ' + JSON.stringify(property.control.options) + ';');
    lines.push('        _this.controls[\'' + property.param + '\'] = _this.createInput(_this.$elements[\'' + property.param + '\'], opt);');
    lines.push('        _this.$elements[\'' + property.param + '\'].on(\'change\', function (event) {');
    lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', $(this).val());');
    lines.push('            _this.executeCommand(command);');
    lines.push('        });');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')

    // end of function  
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createMultiLineInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<div class="brtc-va-editors-sheet-controls-propertycontrol-textareacontrol"/>\');');
    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        var opt = ' + JSON.stringify(property.control.options) + ';');
    lines.push('        _this.controls[\'' + property.param + '\'] = _this.createTextArea(_this.$elements[\'' + property.param + '\'], opt);');
    lines.push('        _this.$elements[\'' + property.param + '\'].on(\'change\', function (event) {');
    lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', $(this).val().split(\'\\n\'));');
    lines.push('            _this.executeCommand(command);');
    lines.push('        });');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});')

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_createCodeMirrorInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.create' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    _this.$elements[\'' + property.param + '\'] = $(\'<textarea class="brtc-va-editors-sheet-controls-sqlcontrol"></textarea>\');');
    lines.push('    _this.addPropertyControl(\'' + property.label + '\', function ($container) {');
    lines.push('        $container.append(_this.$elements[\'' + property.param + '\']);');
    lines.push('        var verifier = new Brightics.VA.Core.Verifier.SqlVerifier();');
    lines.push('        var opt = ' + JSON.stringify(property.control.options) + ';');
    lines.push('        opt.hintOptions ={ list : [] };');
    lines.push('        opt.verifier = verifier;');
    lines.push('        _this.controls[\'' + property.param + '\'] = _this.createTextAreaControl(_this.$elements[\'' + property.param + '\'], opt);');
    lines.push('        _this.$elements[\'' + property.param + '\'].data(\'codeMirror\', _this.controls[\'' + property.param + '\']);');
    lines.push('        $container.find(\'.CodeMirror-sizer\').css({');
    lines.push('            \'height\': \'150px\'');
    lines.push('        });');
    lines.push('        _this.controls[\'' + property.param + '\'].onChange(function (event, changeObj) {');
    lines.push('            var command = _this.createSetUDFParameterValueCommand(\'' + property.param + '\', _this.controls[\'' + property.param + '\'].getValue());');
    lines.push('            _this.executeCommand(command);');
    lines.push('        });');
    lines.push('    }, {mandatory: ' + (property.mandatory || false) + '});');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderColumnsControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    if (Array.isArray(fnUnit.param[property.param][0])) {
        lines.push('    var items = _this.options.fnUnit.param[\'' + property.param + '\'][0];');
    } else {
        lines.push('    var items = _this.options.fnUnit.param[\'' + property.param + '\'];');
    }
    lines.push('    _this.controls[\'' + property.param + '\'].setSelectedItems(items);');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderNumericInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    for(var i in _this.options.fnUnit.param[\'input-variables\'])');
    lines.push('    {');
    lines.push('        if(_this.options.fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\')');
    lines.push('        {');
    lines.push('            var val = _this.options.fnUnit.param[\'input-variables\'][i][2];');
    lines.push('            _this.controls[\'' + property.param + '\'].setValue(val || \'\');');
    lines.push('        }');
    lines.push('     }');
    lines.push('    //var val = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    //_this.controls[\'' + property.param + '\'].setValue(val || \'\');');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderRadioButtonControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    var val = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    var key = \'' + property.param + '.\' + val;');
    lines.push('    if (_this.$elements[key]) {');
    lines.push('        _this.$elements[key].jqxRadioButton(\'check\');');
    lines.push('    }');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderCheckBoxControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    var values = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    var items = ' + JSON.stringify(property.control.options.items) + ';');
    lines.push('    var itemKey;');
    lines.push('    for (var i in items) {');
    lines.push('        itemKey = \'' + property.param + '.\' + items[i].value;');
    lines.push('        if ($.inArray(_this.$elements[itemKey].data(\'tag\'), values) > -1) {');
    lines.push('            _this.$elements[itemKey].jqxCheckBox({checked: true});');
    lines.push('        } else {');
    lines.push('            _this.$elements[itemKey].jqxCheckBox({checked: false});');
    lines.push('        }');
    lines.push('    }');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');
    lines.push('    var _this = this;');
    lines.push('    for(var i in _this.options.fnUnit.param[\'input-variables\'])');
    lines.push('    {');
    lines.push('        if(_this.options.fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\')');
    lines.push('        {');
    lines.push('            var val = _this.options.fnUnit.param[\'input-variables\'][i][2];');
    lines.push('            _this.$elements[\'' + property.param + '\'].val(val || \'\');');
    lines.push('        }');
    lines.push('     }');
    lines.push('    //var val = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    //_this.$elements[\'' + property.param + '\'].val(val || \'\');');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderMultiLineInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');

    lines.push('    var _this = this;');
    lines.push('    for(var i in _this.options.fnUnit.param[\'input-variables\'])');
    lines.push('    {');
    lines.push('        if(_this.options.fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\')');
    lines.push('        {');
    lines.push('            var val = _this.options.fnUnit.param[\'input-variables\'][i][2];');
    lines.push('            var text = val.join(\'\\n\');');
    lines.push('            _this.$elements[\'' + property.param + '\'].val(text || \'\');');
    lines.push('        }');
    lines.push('     }');
    lines.push('    //var val = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    //var text = val.join(\'\\n\');');
    lines.push('    //_this.$elements[\'' + property.param + '\'].val(text || \'\');');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_renderCodeMirrorInputControl = function (fnUnit, property) {
    var lines = [];
    lines.push('__clazz__Properties.prototype.render' + camelize(property.param) + 'Control = function ($parent) {');
    lines.push('    var _this = this;');
    lines.push('    for(var i in _this.options.fnUnit.param[\'input-variables\'])');
    lines.push('    {');
    lines.push('        if(_this.options.fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\')');
    lines.push('        {');
    lines.push('            var val = _this.options.fnUnit.param[\'input-variables\'][i][2];');
    lines.push('            _this.controls[\'' + property.param + '\'].setValue(val || \'\');');
    lines.push('            _this.controls[\'' + property.param + '\'].codeMirror.setSize(\'100%\', \'100%\')');
    lines.push('        }');
    lines.push('     }');
    lines.push('    //var val = _this.options.fnUnit.param[\'' + property.param + '\'];');
    lines.push('    //_this.$elements[\'' + property.param + '\'].setValue(val || \'\');');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};


var _gen_renderValidation = function () {
    var lines = [];
    lines.push('__clazz__Properties.prototype.renderValidation = function () {');

    lines.push('    var _this = this;');
    lines.push('    for (var i in _this.problems) {');
    lines.push('        var key = _this.problems[i].param;');
    lines.push('        if (_this.$elements[key]) {');
    lines.push('            _this.createValidationContent(_this.$elements[key], _this.problems[i]);');
    lines.push('        }');
    lines.push('    }');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_EnvClass = function (options) {
    var env = JSON.parse(JSON.stringify(options));
    delete env['properties-layout'];

    var header = [];
    header.push('/**************************************************************************');
    header.push(' *                                 FnUnit                                  ');
    header.push(' *************************************************************************/');

    var func = env.defaultFnUnit.func;
    // var envLine = ('Brightics.VA.Core.Functions.Library.' + func + ' = ' + JSON.stringify(env, null, 4) + ';');
    var envLine = ('Brightics.VA.Implementation.DataFlow.Functions.' + func + ' = ' + JSON.stringify(env, null, 4) + '; \n' +
    'root.Brightics.VA.Core.Functions.Library.addFunction(\'' + func + '\', Brightics.VA.Implementation.DataFlow.Functions[\'' + func + '\']);');
    var body = envLine.split('\n');
    return header.concat(body);
};

var _gen_PropertiesPanelClass = function (env) {
    var func = env.defaultFnUnit.func;
    var fnUnit = env.defaultFnUnit;
    var properties = env['properties-layout'];
    if (!properties) {
        throw {message: '[properties-layout] does not exist. '}
    }

    var header = [];
    header.push('/**************************************************************************');
    header.push(' *                           Properties Panel                              ');
    header.push(' *');
    var comments = JSON.stringify(properties, null, 4).split('\n');
    for (var i in comments) {
        header.push(' * ' + comments[i]);
    }
    header.push(' *************************************************************************/');

    var body = [
        'function __clazz__Properties(parentId, options) {',
        '    Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);',
        '}',
        '',
        '__clazz__Properties.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);',
        '__clazz__Properties.prototype.constructor = __clazz__Properties;',
        '',
        '__clazz__Properties.prototype.createControls = function () {',
        '    Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.createControls.call(this);',
        '',
        '    this.retrieveTableInfo(this.options.fnUnit[\'inData\']);',
        '};',
        ''
    ];

    body = body.concat(_gen_createContentsAreaControls(fnUnit, properties));

    var hasColumnSelector = false;
    var hasCodeMirror = false;
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].control.type === 'ColumnSelector') {
            body = body.concat(_gen_createColumnsControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderColumnsControl(fnUnit, properties[i]));
            hasColumnSelector = true;
        } else if (properties[i].control.type === 'NumericInput') {
            body = body.concat(_gen_createNumericInputControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderNumericInputControl(fnUnit, properties[i]));
        } else if (properties[i].control.type === 'RadioButton') {
            body = body.concat(_gen_createRadioButtonControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderRadioButtonControl(fnUnit, properties[i]));
        } else if (properties[i].control.type === 'CheckBox') {
            body = body.concat(_gen_createCheckBoxControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderCheckBoxControl(fnUnit, properties[i]));
        } else if (properties[i].control.type === 'Input') {
            body = body.concat(_gen_createInputControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderInputControl(fnUnit, properties[i]));
        } else if (properties[i].control.type === 'MultiLineInput') {
            body = body.concat(_gen_createMultiLineInputControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderMultiLineInputControl(fnUnit, properties[i]));
        } else if (properties[i].control.type === 'CodeMirrorInput') {
            body = body.concat(_gen_createCodeMirrorInputControl(fnUnit, properties[i]));
            body = body.concat(_gen_renderCodeMirrorInputControl(fnUnit, properties[i]));
            hasCodeMirror = true;
        }
    }

    body = body.concat(_gen_renderValidation());

    if (hasColumnSelector) {
        body = body.concat(_gen_fillControlValues(fnUnit, properties));
    }
    if (hasCodeMirror) {
        body = body.concat(_gen_fillControlValues(fnUnit, properties));
    }

    body.push('__clazz__Properties.prototype.getPrimaryOperation = function () {');
    body.push('    return \'__func__\';');
    body.push('};');

    var footer = [
        'Brightics.VA.Core.Functions.Library.__func__.propertiesPanel = __clazz__Properties;',
    ];

    return header.concat(body, footer);
};

var _gen_InputValidatorClass = function (env) {
    var InputCountLabel = 'Single';
    if (env['in-range'].min > 2) {
        InputCountLabel = 'Multi';
    }
    else if (env['in-range'].min === 2) {
        InputCountLabel = 'Pair';
    }
    var func = env.defaultFnUnit.func;
    var properties = env['properties-layout'];

    var header = [];
    header.push('/**************************************************************************');
    header.push(' *                               Validator                                 ');
    header.push(' *************************************************************************/');

    var body = [
        'function __clazz__Validator() {',
        '    Brightics.VA.Core.Validator.' + InputCountLabel + 'InputValidator.call(this);',
        '}',
        '',
        '__clazz__Validator.prototype = Object.create(Brightics.VA.Core.Validator.' + InputCountLabel + 'InputValidator.prototype);',
        '__clazz__Validator.prototype.constructor = __clazz__Validator;',
        ''
    ];

    body.push('__clazz__Validator.prototype.initRules = function () {');
    body.push('    Brightics.VA.Core.Validator.' + InputCountLabel + 'InputValidator.prototype.initRules.call(this);');
    body.push('');
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].control.type === 'ColumnSelector') {
            body.push('    this.add' + camelize(properties[i].param) + 'Rule();');
        } else if (properties[i].mandatory &&
            (properties[i].control.type === 'NumericInput' || properties[i].control.type === 'Input' || properties[i].control.type === 'MultiLineInput' || properties[i].control.type === 'CodeMirrorInput')) {
            body.push('    this.add' + camelize(properties[i].param) + 'Rule();');
        }
    }
    body.push('    this.addExistFnUnitRule();');
    body.push('};');
    body.push('');

    for (var i = 0; i < properties.length; i++) {
        if (properties[i].control.type === 'ColumnSelector') {
            body = body.concat(_gen_addColumnsRule(properties[i]));
        } else if (properties[i].mandatory && properties[i].control.type === 'NumericInput') {
            body = body.concat(_gen_addNumericInputRule(properties[i]));
        } else if (properties[i].mandatory && properties[i].control.type === 'Input') {
            body = body.concat(_gen_addInputRule(properties[i]));
        } else if (properties[i].mandatory && properties[i].control.type === 'MultiLineInput') {
            body = body.concat(_gen_addMultiLineInputRule(properties[i]));
        } else if (properties[i].mandatory && properties[i].control.type === 'CodeMirrorInput') {
            body = body.concat(_gen_addInputRule(properties[i]));
        }
    }

    body = body.concat(_gen_addExistFnUnitRule());

    var footer = [
        'Brightics.VA.Core.Functions.Library.__func__.validator = __clazz__Validator;'
    ];

    return header.concat(body, footer);
};

var _gen_addColumnsRule = function (property) {
    var lines = [];
    lines.push('__clazz__Validator.prototype.add' + camelize(property.param) + 'Rule = function () {');
    lines.push('    var _this = this;');

    if (property.mandatory) {
        lines.push('    this.addRule(function (fnUnit) {');
        lines.push('        return _this.checkColumnIsEmpty(fnUnit, \'' + property.param + '\', fnUnit.param[\'' + property.param + '\'], \'' + property.label + '\');');
        lines.push('    });');
    }

    lines.push('    this.addRule(function (fnUnit) {');
    lines.push('        return _this.checkColumnExists(fnUnit, \'' + property.param + '\', fnUnit.param[\'' + property.param + '\']);');
    lines.push('    });');

    if (property.control['ref-table']['column-type'] && property.control['ref-table']['column-type'].length > 0) {
        lines.push('    this.addRule(function (fnUnit) {');
        lines.push('        return _this.checkColumnType(fnUnit, \'' + property.param + '\', fnUnit.param[\'' + property.param + '\'], ' + JSON.stringify(property.control['ref-table']['column-type']) + ');');
        lines.push('    });');
    }

    // end of function  
    lines.push('};');
    lines.push(' ');
    return lines;
};

var _gen_addNumericInputRule = function (property) {
    var lines = [];
    lines.push('__clazz__Validator.prototype.add' + camelize(property.param) + 'Rule = function () {');
    lines.push('    var _this = this;');

    lines.push('    this.addRule(function (fnUnit) {');
    lines.push('        var msg = {');
    lines.push('            errorCode: \'EE001\',');
    lines.push('            param: \'' + property.param + '\',');
    lines.push('            messageParam: [\'' + property.label + '\']');
    lines.push('        };');
    lines.push('        for(var i in fnUnit.param[\'input-variables\'])');
    lines.push('        {');
    lines.push('              if(fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\'){');
    lines.push('                return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param[\'input-variables\'][i][2]);');
    lines.push('              }');
    lines.push('        }');
    lines.push('        //return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param[\'' + property.param + '\']);');
    lines.push('    });');

    // end of function  
    lines.push('};')
    lines.push(' ');
    return lines;
};

var _gen_addInputRule = function (property) {
    var lines = [];
    lines.push('__clazz__Validator.prototype.add' + camelize(property.param) + 'Rule = function () {');
    lines.push('    var _this = this;');

    lines.push('    this.addRule(function (fnUnit) {');
    lines.push('        var msg = {');
    lines.push('            errorCode: \'EE001\',');
    lines.push('            param: \'' + property.param + '\',');
    lines.push('            messageParam: [\'' + property.label + '\']');
    lines.push('        };');
    lines.push('        for(var i in fnUnit.param[\'input-variables\'])');
    lines.push('        {');
    lines.push('              if(fnUnit.param[\'input-variables\'][i][0]===\'' + property.param + '\'){');
    lines.push('                return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param[\'input-variables\'][i][2]);');
    lines.push('              }');
    lines.push('        }');
    lines.push('        //return _this._checkStringIsEmpty(msg, fnUnit, fnUnit.param[\'' + property.param + '\']);');
    lines.push('    });');

    // end of function
    lines.push('};')
    lines.push(' ');
    return lines;
};

var _gen_addMultiLineInputRule = function (property) {
    var lines = [];
    lines.push('__clazz__Validator.prototype.add' + camelize(property.param) + 'Rule = function () {');
    lines.push('    var _this = this;');

    lines.push('    this.addRule(function (fnUnit) {');
    lines.push('        var msg = {');
    lines.push('            errorCode: \'EE001\',');
    lines.push('            param: \'' + property.param + '\',');
    lines.push('            messageParam: [\'' + property.label + '\']');
    lines.push('        };');
    lines.push('        return _this._checkArrayIsEmpty(msg, fnUnit, fnUnit.param[\'' + property.param + '\']);');
    lines.push('    });');

    // end of function
    lines.push('};')
    lines.push(' ');
    return lines;
};

var _gen_addExistFnUnitRule = function () {
    var lines = [];
    lines.push('__clazz__Validator.prototype.addExistFnUnitRule = function () {');
    lines.push('    var _this = this;');

    lines.push('    this.addRule(function (fnUnit) {');
    lines.push('        var messageInfo = {');
    lines.push('            errorCode: \'EF001\',');
    lines.push('            messageParam: [fnUnit.func]');
    lines.push('        };');
    lines.push('        var udfs = Brightics.VA.Core.Utils.WidgetUtils.getUdfRef($(document.body));');
    lines.push('        if (typeof udfs === \'undefined\') return _this.problemFactory.createProblem(messageInfo, fnUnit);');
    lines.push('        var udfNames = $.map(udfs, function (udf) {');
    lines.push('             return udf.func');
    lines.push('        });');
    lines.push('        if ($.inArray(fnUnit.func, udfNames) == -1)return _this.problemFactory.createProblem(messageInfo, fnUnit);');
    lines.push('    });');

    // end of function
    lines.push('};');
    lines.push(' ');
    return lines;
};

var generateSnippet = function (options) {

    var header = [
        '(function () {',
        '    \'use strict\';',
        '',
        '    var root = this;',
        '    var Brightics = root.Brightics;',
        ''
    ];

    options.defaultFnUnit.display.diagram = {
        position: {'x': 20, 'y': 10}
    };
    options.defaultFnUnit.display.sheet = {
        'in': {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]},
        'out': {'partial': [{'panel': [], 'layout': {}}], 'full': [{'panel': [], 'layout': {}}]}
    };

    var body = _gen_EnvClass(options);
    body.push('');

    body = body.concat(_gen_PropertiesPanelClass(options));
    body.push('');

    body = body.concat(_gen_InputValidatorClass(options));

    body.push('');

    for (var i in body) {
        body[i] = '    ' + body[i];
    }

    var footer = [
        '}).call(this);'
    ];

    var func = options.defaultFnUnit.func;
    var clazz = camelize(func);
    return header.concat(body, footer).join('\n').replace(/__clazz__/g, clazz).replace(/__func__/g, func);

};

exports.generateSnippet = generateSnippet;