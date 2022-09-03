/**
 * Created by SDS on 2016-08-19.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DBReaderSqlEditorDialog(parentId, options) {
        Brightics.VA.Core.Dialogs.ScriptEditorDialog.call(this, parentId, options);
    }

    DBReaderSqlEditorDialog.prototype = Object.create(Brightics.VA.Core.Dialogs.ScriptEditorDialog.prototype);
    DBReaderSqlEditorDialog.prototype.constructor = DBReaderSqlEditorDialog;

    DBReaderSqlEditorDialog.prototype.renderInfoArea = function () {

    };

    DBReaderSqlEditorDialog.prototype.setEditorStatement = function (statement) {
        this.codeMirror.setValue(statement);
        this.codeMirror.clearHistory();
        this.selectMarker = this.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 7}, {
            readOnly: true,
            inclusiveLeft: true,
            atomic: true
        });
    };

    Brightics.VA.Core.Dialogs.DBReaderSqlEditorDialog = DBReaderSqlEditorDialog;

}).call(this);