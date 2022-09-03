/**
 * Created by sds on 2017-10-27.
 */

/* global Studio */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ClipboardManager() {
        this.clipboardCache = [];
        this.visualCache = {};
    }

    ClipboardManager.prototype.addFunctionToClipboard = function (functionTemplate) {
        functionTemplate.uid = Date.now();
        this.clipboardCache.push(functionTemplate);
        this.openClipboardDialog(false);
    };

    ClipboardManager.prototype.addVisualObjects = function (vos) {
        var activeEditor = Studio.getActiveEditor();
        activeEditor.handleOnCopy();
        _.extend(this.visualCache, vos);
    };

    ClipboardManager.prototype.getVisualObjects = function (modelId) {
        return this.visualCache[modelId];
    };

    ClipboardManager.prototype.getParent = function () {
        var activeEditor = Studio.getActiveEditor();

        return activeEditor.getMainArea();
    };

    ClipboardManager.prototype.openClipboardDialog = function (_reopen) {
        var reopen = _.isUndefined(_reopen) ? true : _reopen;
        var $parent = this.getParent();

        if (!this.clipboardDialog) {
            this.clipboardDialog = new Brightics.VA.Core.Dialogs.ClipboardDialog($parent, {
                functionList: this.clipboardCache
            });
            return;
        }
        if (reopen) {
            this.clipboardDialog.close();
            this.clipboardDialog = new Brightics.VA.Core.Dialogs.ClipboardDialog($parent, {
                functionList: this.clipboardCache
            });
        } else {
            if (this.clipboardDialog.isAlive()) {
                this.clipboardDialog.updateFunctionList(this.clipboardCache);
            } else {
                this.clipboardDialog = new Brightics.VA.Core.Dialogs.ClipboardDialog($parent, {
                    functionList: this.clipboardCache
                });
            }
        }
    };

    ClipboardManager.prototype.setEditorType = function (type) {
        if (this.clipboardDialog && this.clipboardDialog.isAlive()) {
            this.clipboardDialog.setEnable(Brightics.VA.Core.Interface.Clipboard[type])
        }
    };


    Brightics.VA.Core.Tools.Manager.ClipboardManager = ClipboardManager;

}).call(this);
