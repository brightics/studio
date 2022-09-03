/**
 * Created by SDS on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function CheckpointBrowserDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    CheckpointBrowserDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    CheckpointBrowserDialog.prototype.constructor = CheckpointBrowserDialog;

    CheckpointBrowserDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 600;
        this.dialogOptions.height = 250;
    };

    CheckpointBrowserDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-row-flex-layout" style="flex-direction: column;">' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-checkpoint-group"></div>' +
            '   <div class="brtc-va-dialogs-contents-label brtc-va-dialogs-checkpoint-file"></div>' +
            '</div>');

        this.createCheckpointGroupControl($parent.find('.brtc-va-dialogs-checkpoint-group'));
        this.createCheckpointControl($parent.find('.brtc-va-dialogs-checkpoint-file'));

        this.init();
    };

    CheckpointBrowserDialog.prototype.init = function () {
        this.isRendered = false;

        this.splitedCheckpointPath = this.splitCheckpointFullPath(this.options.checkpointPath);

        this.getCheckPointGroupList();
    };

    CheckpointBrowserDialog.prototype.createCheckpointGroupControl = function ($parent) {
        var _this = this;

        var $checkpointGroupWrapper = $('' +
            '<div class="brtc-va-dialogs-checkpoint-group-wrapper" style="width:100%; margin-top: 10px;">' +
            '   <div class="brtc-va-dialogs-checkpoint-group-label" style="width:120px; float: left; font-weight: bold;">Checkpoint Group</div>' +
            '   <div class="brtc-va-dialogs-checkpoint-group-dropdownlist"></div>' +
            '</div>');

        $parent.append($checkpointGroupWrapper);

        this.$checkpointGroup = $checkpointGroupWrapper.find('.brtc-va-dialogs-checkpoint-group-dropdownlist');

        this.$checkpointGroup.jqxDropDownList({
            placeHolder: 'please choose',
            displayMember: 'name',
            valueMember: 'path',
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 125px)',
            height: '25px',
            openDelay: 0
        });

        _this.$checkpointGroup.on('change', function () {
            var selectedItem = _this.$checkpointGroup.jqxDropDownList('getSelectedItem');
            _this.dialogResult.checkpointPath = '';

            _this.getCheckPointList(selectedItem.label);
        });
    };

    CheckpointBrowserDialog.prototype.createCheckpointControl = function ($parent) {
        var _this = this;

        var $checkpointFileWrapper = $('' +
            '<div class="brtc-va-dialogs-checkpoint-file-wrapper" style="width:100%; margin-top: 10px;">' +
            '   <div class="brtc-va-dialogs-checkpoint-file-label" style="width:120px; float: left; font-weight: bold;">Checkpoint</div>' +
            '   <div class="brtc-va-dialogs-checkpoint-file-dropdownlist"></div>' +
            '</div>');

        $parent.append($checkpointFileWrapper);

        this.$checkpoint = $checkpointFileWrapper.find('.brtc-va-dialogs-checkpoint-file-dropdownlist');

        this.$checkpoint.jqxDropDownList({
            placeHolder: 'please choose',
            displayMember: 'name',
            valueMember: 'path',
            theme: Brightics.VA.Env.Theme,
            width: 'calc(100% - 125px)',
            height: '25px',
            openDelay: 0
        });

        _this.$checkpoint.on('change', function () {
            _this.dialogResult.checkpointPath = $(this).val();
        });
    };

    CheckpointBrowserDialog.prototype.getCheckPointGroupList = function (callback) {
        var _this = this;

        var userId = Brightics.VA.Env.Session.userId;
        var url = 'api/va/v2/dl/browse?path=/checkpoint/' + userId ;
        var opt = {
            url: url,
            type: 'GET',
            blocking: true,
            contentType: 'application/json; charset=utf-8'
        };
        $.ajax(opt).done(function(checkpointGroupData){
            var prefix = _this.splitedCheckpointPath.prefix,
                splitKey = _this.splitedCheckpointPath.splitKey,
                checkpointGroup = _this.splitedCheckpointPath.checkpointGroup;

            _this.$checkpointGroup.jqxDropDownList({source: checkpointGroupData});
            if (!_this.isRendered) _this.$checkpointGroup.val(prefix + splitKey + checkpointGroup);
        });
};

    CheckpointBrowserDialog.prototype.getCheckPointList = function (dirName) {
        var _this = this;

        var userId = Brightics.VA.Env.Session.userId;
        var url = 'api/va/v2/dl/browse?path=/checkpoint/' + userId  + '/' + dirName;
        var opt = {
            url: url,
            type: 'GET',
            blocking: false,
            contentType: 'application/json; charset=utf-8'
        };

        $.ajax(opt).done(function(data){
            _this.$checkpoint.jqxDropDownList('clear');
            _this.$checkpoint.jqxDropDownList({source: data});

            if (!_this.isRendered) {
                var prefix = _this.splitedCheckpointPath.prefix,
                    splitKey = _this.splitedCheckpointPath.splitKey,
                    checkpointGroup = _this.splitedCheckpointPath.checkpointGroup,
                    checkpoint = _this.splitedCheckpointPath.checkpoint;

                _this.$checkpoint.val(prefix + splitKey + checkpointGroup + '/' + checkpoint);

                _this.isRendered = true;
            }
        })
    };

    CheckpointBrowserDialog.prototype.splitCheckpointFullPath = function (fullPath) {
        var userId = Brightics.VA.Env.Session.userId,
            splitKey = userId + '/';

        var prefix = '', checkpointPathArr = [];

        if (fullPath) {
            var fullPathArr = fullPath.split(userId + '/');
            prefix = fullPathArr[0];
            checkpointPathArr = (fullPathArr[1]).split('/');
        }

        return {
            prefix: prefix,
            splitKey: splitKey,
            checkpointGroup: checkpointPathArr[0],
            checkpoint: checkpointPathArr[1]
        };
    };

    Brightics.VA.Core.Dialogs.CheckpointBrowserDialog = CheckpointBrowserDialog;

}).call(this);