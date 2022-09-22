/**
 * Created by daewon77.park on 2016-03-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NewFileDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    NewFileDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    NewFileDialog.prototype.constructor = NewFileDialog;

    NewFileDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 980;
        this.dialogOptions.height = 670;
    };

    NewFileDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('brtc-va-dialogs-newfile-contents');
        $parent.parent().parent().find('.ui-dialog-titlebar.ui-widget-header').css('margin-left', '26px !important');

        this.createModelTypeListArea($parent);
        this.createModelInfoInputArea($parent);
    };

    NewFileDialog.prototype.createModelTypeListArea = function ($parent) {
        var _this = this;
        var $modelTypeList = $('<div class="brtc-va-dialogs-modeltype-list"></div>');
        var implementation = Brightics.VA.Implementation;
        for (var key in implementation) {
            if (_this.options.fileType === 'Report') {
                if (key !== 'Visual') continue;
            } else {
                if (key === 'Visual') continue;
            }
            const label = implementation[key].Clazz === 'visual' ? Brightics.locale.common.report : Brightics.locale.common.dataFlow;
            $modelTypeList.append('' +
                '   <div class="brtc-va-dialogs-modeltype-list-item" model-type="' + implementation[key].Clazz + '">' +
                '       <div class="brtc-va-dialogs-modeltype-list-item-icon"></div>' +
                '       <div class="brtc-va-dialogs-modeltype-list-item-label" title="' + label + '">' + label + '</div>' +
                '   </div>');
        }

        $parent.append($modelTypeList);

        $parent.find('.brtc-va-dialogs-modeltype-list-item:first').addClass('brtc-va-dialogs-modeltype-list-item-selected');


        $parent.find('.brtc-va-dialogs-modeltype-list-item').click(function () {
            $(this).parent().find('.brtc-va-dialogs-modeltype-list-item-selected').removeClass('brtc-va-dialogs-modeltype-list-item-selected');
            $(this).addClass('brtc-va-dialogs-modeltype-list-item-selected');
            _this.renderModelList($(this).attr('model-type'));
        });
    };

    NewFileDialog.prototype.createModelInfoInputArea = function ($parent) {
        $parent.append('' +
            '<div class="brtc-va-dialogs-newfiledialog-input-area">' +
            '   <div class="brtc-va-dialogs-newfiledialog-label">' +Brightics.locale.common.name + '</div>' +
            '   <input type="text" class="brtc-va-dialogs-newfiledialog-name-input" maxlength="80"/>' +
            '   <div class="brtc-va-dialogs-newfiledialog-label">' +Brightics.locale.common.description + '</div>' +
            '   <div class="brtc-va-dialogs-newfiledialog-description-container"></div>' +
            '   <div class="brtc-va-dialogs-newfiledialog-label">' +Brightics.locale.common.template + '</div>' +
            '   <div class="brtc-va-dialogs-newfiledialog-template-list"></div>' +
            '</div>' +
            '');

        this.$nameControl = $parent.find('.brtc-va-dialogs-newfiledialog-name-input');
        this.$nameControl.jqxInput({
            theme: Brightics.VA.Env.Theme
        });
        this.$nameControl.focus();
        var modelType = $parent.find('.brtc-va-dialogs-modeltype-list-item').attr('model-type');

        this.createDescriptionControl($parent.find('.brtc-va-dialogs-newfiledialog-description-container'));
        this.createTemplate($parent.find('.brtc-va-dialogs-newfiledialog-template-list'), modelType);
    };

    NewFileDialog.prototype.renderModelList = function (modelType) {
        var $container = this.$mainControl.find('.brtc-va-dialogs-newfiledialog-template-list');
        var $parent = $container.parent();
        $container.remove();
        $parent.find('.brtc-va-dialogs-newfiledialog-name-input').focus();
        $parent.append('<div class="brtc-va-dialogs-newfiledialog-template-list"></div>');
        this.createTemplate($parent.find('.brtc-va-dialogs-newfiledialog-template-list'), modelType);
    };

    NewFileDialog.prototype.convertTemplateContents = function (contents) {
        //fix me
        if (contents.type === 'deeplearning' && !_.isEmpty(contents.functions)) {
            var dlLoad;
            var output;

            _.forEach(contents.functions, function (fn) {
                if (fn.func === 'dlLoad') dlLoad = fn;
                if (fn.func === 'output') output = fn;
            });

            output.param['train_data'] = dlLoad.fid;
        } 
        return contents;
    };

    NewFileDialog.prototype.createTemplate = function ($parent, modelType) {
        var _this = this;

        _this.$templateContainer = $('<div class="brtc-va-dialogs-file-thumbnail-container"></div>');
        $parent.append(_this.$templateContainer);

        if (typeof modelType === 'undefined') {
            return;
        }

        const lang = Brightics.VA.SettingStorage.getCurrentLanguage();
        var url = `api/va/v2/studio/templates/${modelType}?lang=${lang}`;
        var opt = {
            url: url,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            blocking: true
        };
        $.ajax(opt).done(function (files) {
            files.sort(function (a, b) {
                if (a.name === 'Default') return -1;
                if (b.name === 'Default') return 1;
                return a.name.localeCompare(b.name);
            });
            files.forEach(function (templateFile, fileIndex) {

                var templateNm = Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(templateFile.name);
                var $template = $('' +
                    '<div class="brtc-va-dialogs-file-thumbnail-unit">' +
                    '   <div class="brtc-va-dialogs-file-thumbnail name">' + templateNm + '</div>' +
                    '   <div class="brtc-va-dialogs-file-thumbnail image"/>' +
                    '   <div class="brtc-va-dialogs-file-thumbnail overlay">' + templateFile.description + '</div>' +
                    '</div>'
                );

                if (templateNm !== 'Default') {
                    // $template.find('.brtc-va-dialogs-file-thumbnail.overlay')
                    //     .css({top: (215 * Math.floor(fileIndex / 2) + 33) + 'px'});
                    $template.mouseover(function () {
                        $template.find('.brtc-va-dialogs-file-thumbnail.overlay')
                            .css({opacity: .6});
                    }).mouseout(function () {
                        $template.find('.brtc-va-dialogs-file-thumbnail.overlay')
                            .css({opacity: 0});
                    });
                }

                if (templateFile.thumbnail) $template.find('.brtc-va-dialogs-file-thumbnail.image').append($('<img src="' + templateFile.thumbnail + '" />'));

                if (fileIndex == 0) {
                    $template.addClass('brtc-va-dialogs-file-thumbnail-selected');
                }
                _this.$templateContainer.append($template);
                $template.data('contents', templateFile.contents);

            });

            _this.$templateContainer.find('.brtc-va-dialogs-file-thumbnail-unit').click(function (event) {
                _this.$templateContainer.find('.brtc-va-dialogs-file-thumbnail-selected').removeClass('brtc-va-dialogs-file-thumbnail-selected');
                $(this).addClass('brtc-va-dialogs-file-thumbnail-selected');
                _this.noteControl.setValue(_this.$templateContainer.find('.brtc-va-dialogs-file-thumbnail-selected .overlay').html());
            });
        }).fail(function (error) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
        });

        $parent.perfectScrollbar();
    };

    NewFileDialog.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            focus: false,
            height: 120,
            description: '',
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height() - 110);
        });
    };

    NewFileDialog.prototype.createFileContents = function (mid, label, description) {
        var $item = this.$templateContainer.find('.brtc-va-dialogs-file-thumbnail-selected');
        if ($item.length == 0) {
            $item = this.$templateContainer.find('.brtc-va-dialogs-file-thumbnail:nth-child(1)');
        }
        return this.convertTemplateContents(Brightics.VA.Core.Utils.ModelUtils
            .createFileContents($item.data('contents'), mid, label, description));
    };

    NewFileDialog.prototype.handleOkClicked = function () {
        var _this = this;

        var $fileName = this.$mainControl.find('.brtc-va-dialogs-newfiledialog-name-input');
        if ($fileName.val().trim() === '') {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please enter name.', function () {
                _this.$nameControl.focus();
            });
            return;
        }

        if ($(_this.noteControl.getCode()).text().length > 2000) {
            Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Description should be less than or equal to 2000 characters.');
            return;
        }

        var fileId = Brightics.VA.Core.Utils.IDGenerator.model.id();
        var description = _this.noteControl.getCode() === '' ? '' : _this.noteControl.getCode();
        
        var fileInfo = new Brightics.VA.Vo.File();
        fileInfo.setFileId(fileId);
        fileInfo.setProjectId(this.options.project.getProjectId());
        fileInfo.setLabel($fileName.val());
        fileInfo.setContents(_this.createFileContents(fileId, $fileName.val()));
        fileInfo.setDescription(description);
        fileInfo.setCreator(Brightics.VA.Env.Session.userId);

        Studio.getResourceManager().addFile(this.options.project.getProjectId(), fileInfo)
            .then(function (file) {
                _this.dialogResult = {
                    OK: true,
                    Cancel: false,
                    selectedFile: file
                };
                _this.$mainControl.dialog('close');
            })
            .catch(function (error) {
                console.error(error);
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(error);
            });
    };

    Brightics.VA.Core.Dialogs.NewFileDialog = NewFileDialog;

}).call(this);