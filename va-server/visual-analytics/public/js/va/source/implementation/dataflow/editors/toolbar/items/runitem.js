/**
 * Created by jmk09.jung on 2018-02-13.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function RunItem($parent, options) {
        Brightics.VA.Core.Editors.Toolbar.RunItem.call(this, $parent, options);
    }

    RunItem.prototype = Object.create(Brightics.VA.Core.Editors.Toolbar.RunItem.prototype);
    RunItem.prototype.constructor = RunItem;

    RunItem.prototype.handleOnClick = function (event) {
        var editor = Studio.getEditorContainer().getActiveModelEditor();
        var modelContents = editor.getModel();

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                editor.preProcess().then(function (runnable) {
                    Studio.getJobExecutor().launchModel(modelContents, dialogResult['args'], {runnable: runnable});
                });
            }
        };

        if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true'
            && Object.keys(modelContents.variables).length > 0) {
            new Brightics.VA.Core.Dialogs.RunDataDialog(this.$mainControl, {
                close: closeHandler,
                analyticsModel: modelContents
            });
        } else {
            // Global Variable Show "OFF"인 경우, 전체 실행시 Global Variable의 Default값이
            // 서버로 전송되지 않던 버그 수정
            // 2017. 06. 02
            var defaultArgs = {};
            for (var key in modelContents.variables) {
                var gvDef = modelContents.variables[key];
                var temp;
                if (_.isArray(gvDef.value) && gvDef.value.length === 1) {
                    temp = gvDef.value[0];
                } else {
                    temp = gvDef.value;
                }

                if (!_.isUndefined(temp)) defaultArgs[key] = gvDef.value;
            }
            closeHandler({
                OK: true,
                args: defaultArgs
            });
        }
    };

    Brightics.VA.Implementation.DataFlow.Toolbar.RunItem = RunItem;

}).call(this);