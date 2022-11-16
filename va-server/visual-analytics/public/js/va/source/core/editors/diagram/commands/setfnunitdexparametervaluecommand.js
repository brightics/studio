/**
 * Created by ty_tree.kim on 2016-02-11.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SetFnUnitDexParameterValueCommand(eventSource, options) {
        Brightics.VA.Core.Command.call(this, eventSource, options);
        this.options.label = this.options.label || 'Change FnUnit Properties';
    }

    SetFnUnitDexParameterValueCommand.prototype = Object.create(Brightics.VA.Core.Command.prototype);
    SetFnUnitDexParameterValueCommand.prototype.constructor = SetFnUnitDexParameterValueCommand;

    SetFnUnitDexParameterValueCommand.prototype.execute = function () {
        this.old['dex-param'] = $.extend(true, {}, this.options.fnUnit['dex-param']);
        for (var key in this.options.ref['dex-param']) this.copy(this.options.fnUnit['dex-param'], this.options.ref['dex-param'], key);
        this._buildQuery();
    };

    SetFnUnitDexParameterValueCommand.prototype.copy = function (to, from, key) {
        if (from[key].constructor == Array) to[key] = $.extend(true, [], from[key]);
        else if (from[key].constructor == Object) to[key] = $.extend(true, {}, from[key]);
        else to[key] = from[key];
    };

    SetFnUnitDexParameterValueCommand.prototype.undo = function () {
        for (var key in this.options.fnUnit['dex-param']) delete this.options.fnUnit['dex-param'][key];
        $.extend(true, this.options.fnUnit['dex-param'], this.old['dex-param']);
        this._buildQuery();
    };

    SetFnUnitDexParameterValueCommand.prototype.getId = function () {
        return 'brightics.va.editors.diagram.commands.setfnunitparametervaluecommand';
    };

    SetFnUnitDexParameterValueCommand.prototype._buildQuery = function () {
        var sql = Brightics.VA.Core.Functions.Library[this.options.fnUnit.func]['base-sql'];
        for (var key in this.options.fnUnit['dex-param']) {
            var value = this.options.fnUnit['dex-param'][key];
            var pattern = key.replace('$', '\\$').replace('{', '\\{').replace('}', '\\}');
            if (typeof value === 'string') {
                // 문자열은 single quotation 으로 감싸서 치환
                sql = sql.replace(new RegExp(pattern, 'gi'), '\'' + value + '\'');
            } else if (typeof value === 'number') {
                // 숫자 치환
                sql = sql.replace(new RegExp(pattern, 'gi'), value);
            } else if (!$.isArray(value)) {
                sql = sql.replace(new RegExp(pattern, 'gi'), '\'\'');
            }
        }
        this.options.fnUnit.param.sql = sql;
    };

    Brightics.VA.Core.Editors.Diagram.Commands.SetFnUnitDexParameterValueCommand = SetFnUnitDexParameterValueCommand;

}).call(this);