/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ExportPDFItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.Item.call(this, $parent, options);
    }

    ExportPDFItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.Item.prototype);
    ExportPDFItem.prototype.constructor = ExportPDFItem;

    ExportPDFItem.prototype.initOptions = function () {
        this.setOptions(
            {
                "attribute": {
                    "title": Brightics.locale.common.exportPDF,
                    "item-type": "export-pdf"
                },
                "action": {
                    'click': this.handleOnClick
                }
            }
        );
    };

    ExportPDFItem.prototype.handleOnClick = function (event) {
        var browserName = Brightics.VA.Core.Utils.CommonUtils.getUserBrowserName();
        var editor = Studio.getEditorContainer().getActiveModelEditor();

        var param = {
            user: Brightics.VA.Env.Session.userId,
            pid: editor.options.editorInput.getProjectId(),
            mid: editor.options.editorInput.getFileId()
        };
        var params = $.map(param, function (value, key) {
            return key + '=' + value;
        }).join('&');

        if (browserName === 'Chrome' &&
            editor.getModel().report.display['page-type'] !== 'custom') {
            window.open('/pdf?' + params, 'PDF');
        } else if (browserName === 'Chrome') {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Do not support in custom page size')
        } else if (browserName) {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Do not support in ' + browserName)
        } else {
            Brightics.VA.Core.Utils.WidgetUtils.openInformationDialog('Do not support in your browser')
        }
    };

    Brightics.VA.Implementation.Visual.Toolbar.ExportPDFItem = ExportPDFItem;

}).call(this);