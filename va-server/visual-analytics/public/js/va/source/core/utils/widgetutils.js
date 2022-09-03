/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;
    const Brightics = root.Brightics;

    root.Brightics.VA.Core.Utils.WidgetUtils = {
        ALPHABET: '23456789abcdefghijkmnpqrstuvwxyz',
        ID_LENGTH: 8,

        retrieveWidget: function (id) {
            return typeof (id) === 'string' ? $(id) : id;
        },
        putWorkspaceRef: function ($el, ref) {
            this.putData($el, 'brtc-va-workspace-body-area-ref', ref);
        },
        getWorkspaceRef: function ($el) {
            var $workspace = $el.closest('.brtc-va-workspace-body-area');
            return this.getData($workspace, 'brtc-va-workspace-body-area-ref');
        },
        putStudioRef: function ($el, ref) {
            this.putData($el, 'brtc-studio-ref', ref);
        },
        getStudioRef: function ($el) {
            var $studio = $('.brtc-va-studio');
            return this.getData($studio, 'brtc-studio-ref');
        },
        putUdfRef: function ($el, ref) {
            this.removeUdfRefData($el);
            this.putData($el, 'brtc-udf-ref', ref);
        },
        getUdfRef: function ($el) {
            return this.getData($el, 'brtc-udf-ref');
        },
        /**
         * @deprecated sungjin1.kim use putEditorRef
         */
        putModelEditorRef: function ($el, ref) {
            // this.putData($el, 'brtc-modeleditor-ref', ref);
            this.putEditorRef($el, ref);
        },
        /**
         * @deprecated sungjin1.kim use getEditorRef
         */
        getModelEditorRef: function ($el) {
            // var $editor = $el.closest('.brtc-va-editors-modeleditor');
            // return this.getData($editor, 'brtc-modeleditor-ref');
            return this.getEditorRef($el, 'brtc-va-editors-modeleditor');
        },
        /**
         * @deprecated sungjin1.kim use closestEditor
         */
        closestModelEditor: function ($el) {
            // return $el.closest('.brtc-va-editors-modeleditor');
            return this.closestEditor($el, 'brtc-va-editors-modeleditor');
        },
        putEditorRef: function ($el, ref) {
            this.putData($el, 'brtc-va-editor-ref', ref);
        },
        getEditorRef: function ($el, className) {
            var clazz = className || 'brtc-va-editor';
            var $editor = this.closestEditor($el, clazz);
            return this.getData($editor, 'brtc-va-editor-ref');
        },
        closestEditor: function ($el, className) {
            return $el.closest('.' + className);
        },
        putData: function ($el, key, value) {
            $el.data(key, value);
        },
        getData: function ($el, key) {
            return $el.data(key);
        },
        removeUdfRefData: function ($el) {
            $el.removeData('brtc-udf-ref');
        },
        isRightClick: function (event) {
            var evt = event || window.event;
            var rightClick;
            if (evt.which) {
                rightClick = (evt.which == 3);
            }
            else if (evt.button) {
                rightClick = (evt.button == 2);
            }
            return rightClick || $.jqx.mobile.isTouchDevice();
        },
        getRightClick: function (event) {
            if (Brightics.VA.Core.Utils.WidgetUtils.isRightClick(event)) {
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                return {
                    x: parseInt(event.clientX) + scrollLeft,
                    y: parseInt(event.clientY) + scrollTop
                };
            }
        },
        createPaletteItem: function ($parent, func, clazz) {

            var $paletteContent = $('<div class="brtc-va-views-palette-fnunit-content">');
            var $fnUnitControl = $('' +
                '<div class="brtc-va-views-palette-fnunit brtc-style-views-palette-fnunit brtc-va-studio-dm-draggable">' +
                '   <div class="brtc-va-views-palette-fnunit-icon brtc-style-views-palette-fnunit-icon"></div>' +
                '   <div class="brtc-va-views-palette-fnunit-label brtc-style-views-palette-fnunit-label"></div>' +
                '</div>');
            $paletteContent.append($fnUnitControl);

            var label, category;
            var deprecated = false;
            var impleWidgetUtils = Brightics.VA.Core.Interface.WidgetUtils[clazz];
            if (impleWidgetUtils && impleWidgetUtils.createPaletteItem) {
                var paletteItem = impleWidgetUtils.createPaletteItem(func);
                label = paletteItem.label;
                category = paletteItem.category;
            } else {
                var displayLabel = '';
                var displayCategory = '';
                var context = 'scala';
                if (typeof Brightics.VA.Core.Interface.Functions[clazz][func] === 'undefined') {
                    displayLabel = 'none';
                    displayCategory = 'none';
                } else {
                    displayLabel = Brightics.VA.Core.Interface.Functions[clazz][func].defaultFnUnit.display.label;
                    displayCategory = Brightics.VA.Core.Interface.Functions[clazz][func].category;
                    deprecated = deprecated || Brightics.VA.Core.Interface.Functions[clazz][func].deprecated;
                    context = Brightics.VA.Core.Interface.Functions[clazz][func].defaultFnUnit.context || context;
                }
                // label = Brightics.VA.Core.Interface.Functions[clazz][func].defaultFnUnit.display.label;
                // category = 'brtc-va-fnunit-category-' +Brightics.VA.Core.Interface.Functions[clazz][func].category ;
                label = displayLabel;
                category = 'brtc-va-fnunit-category-' + displayCategory;

            }

            $fnUnitControl.attr('title', label);
            if (displayCategory !== 'udf') {
                $fnUnitControl.attr('context', context)
                                .attr('category', displayCategory);
            }
            $fnUnitControl.find('.brtc-va-views-palette-fnunit-label').text(label);
            if (deprecated) {
                label += '\nDeprecated: ' + Brightics.VA.Core.Interface
                    .Functions[clazz][func]['deprecated-message'];
            }
            $fnUnitControl.attr('title', label);

            if (deprecated) $fnUnitControl.addClass('deprecated');
            $fnUnitControl.addClass(category);

            $parent.append($paletteContent);
            this.putData($fnUnitControl, 'func', func);

            return $fnUnitControl;
        },
        createPaletteUDFItem: function ($parent, func, clazz, closeHandler) {

            var $paletteContent = $('<div class="brtc-va-views-palette-fnunit-content">');
            var $fnUnitControl = $('' +
                '<div class="brtc-va-views-palette-fnunit brtc-style-views-palette-fnunit brtc-va-studio-dm-draggable">' +
                '   <div class="brtc-va-views-palette-fnunit-icon brtc-style-views-palette-fnunit-icon"></div>' +
                '   <div class="brtc-va-views-palette-fnunit-label brtc-style-views-palette-fnunit-label"></div>' +
                '   <div class="brtc-va-views-palette-fnunit-remove-icon brtc-style-views-palette-fnunit-remove-icon" title="Delete"></div>' +
                '</div>');
            $paletteContent.append($fnUnitControl);

            var label, category;
            var deprecated = false;
            var impleWidgetUtils = Brightics.VA.Core.Interface.WidgetUtils[clazz];
            if (impleWidgetUtils && impleWidgetUtils.createPaletteItem) {
                var paletteItem = impleWidgetUtils.createPaletteItem(func);
                label = paletteItem.label;
                category = paletteItem.category;
            } else {
                var displayLabel = '';
                var displayCategory = '';
                var context = 'scala';
                if (typeof Brightics.VA.Core.Interface.Functions[clazz][func] === 'undefined') {
                    displayLabel = 'none';
                    displayCategory = 'none';
                } else {
                    displayLabel = Brightics.VA.Core.Interface.Functions[clazz][func].defaultFnUnit.display.label;
                    displayCategory = Brightics.VA.Core.Interface.Functions[clazz][func].category;
                    deprecated = deprecated || Brightics.VA.Core.Interface.Functions[clazz][func].deprecated;
                    context = Brightics.VA.Core.Interface.Functions[clazz][func].defaultFnUnit.context;
                }
                label = displayLabel;
                category = 'brtc-va-fnunit-category-' + displayCategory;
            }
            $fnUnitControl.attr('title', label);
            if (displayCategory !== 'udf') $fnUnitControl.attr('context', context);
            $fnUnitControl.find('.brtc-va-views-palette-fnunit-label').text(label);
            if (deprecated) {
                label += '\nDeprecated: ' + Brightics.VA.Core.Interface
                    .Functions[clazz][func]['deprecated-message'];
            }
            $fnUnitControl.attr('title', label);

            $fnUnitControl.find('.brtc-va-views-palette-fnunit-remove-icon').on('click', function (e) {
                e.stopPropagation();
                var options = {
                    contentText: 'These items will be permanently deleted and cannot be recovered. Are you sure?',
                    close: closeHandler,
                    isCancel: true
                };
                Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog($parent, options);

            });

            $fnUnitControl.find('.brtc-va-views-palette-fnunit-remove-icon').hide();
            $fnUnitControl.mouseover(function (event) {
                if (false && Brightics.VA.Env.Session.userId !== creator) {
                    $(this).find('.brtc-va-views-palette-fnunit-remove-icon').hide();
                } else {
                    $(this).find('.brtc-va-views-palette-fnunit-remove-icon').show();
                }
            });
            $fnUnitControl.mouseout(function (event) {
                $(this).find('.brtc-va-views-palette-fnunit-remove-icon').hide();
            });

            if (deprecated) $fnUnitControl.addClass('deprecated');
            $fnUnitControl.addClass(category);

            $parent.append($paletteContent);
            this.putData($fnUnitControl, 'func', func);

            return $fnUnitControl;
        },
        createPaletteBox: function (options) {
            var $paletteContent = $('<div class="brtc-va-views-palette-fnunit-content">');
            var $fnUnitControl = $('' +
                '<div class="brtc-va-views-palette-box-fnunit brtc-va-studio-dm-draggable">' +
                '   <div class="brtc-va-views-palette-fnunit-icon brtc-style-views-palette-fnunit-icon"></div>' +
                '   <div class="brtc-va-views-palette-fnunit-label brtc-style-views-palette-fnunit-label"></div>' +
                '</div>');
            $paletteContent.append($fnUnitControl);

            var category;
            var impleWidgetUtils = Brightics.VA.Core.Interface.WidgetUtils['data'];
            if (impleWidgetUtils && impleWidgetUtils.createPaletteItem) {
                var paletteItem = impleWidgetUtils.createPaletteItem(options.func);
                category = paletteItem.category;
            } else {
                var displayCategory = '';
                var context = 'scala';
                if (typeof Brightics.VA.Core.Interface.Functions['data'][options.func] === 'undefined') {
                    displayCategory = 'none';
                } else {
                    displayCategory = Brightics.VA.Core.Interface.Functions['data'][options.func].category;
                    context = Brightics.VA.Core.Interface.Functions['data'][options.func].defaultFnUnit.context;
                }
                category = 'brtc-va-fnunit-category-' + displayCategory;
            }

            $fnUnitControl.attr('title', options.label);
            
            $fnUnitControl.find('.brtc-va-views-palette-fnunit-icon').attr('context', context || 'scala');
            $fnUnitControl.find('.brtc-va-views-palette-fnunit-label').text(options.label);

            $fnUnitControl.addClass(category);
            this.putData($fnUnitControl, 'func', options.func);

            return $fnUnitControl;
        },
        createTableItem: function ($parent, options) {
            var $content = $('<div class="brtc-va-views-table-content">');
            var $tableControl = $('' +
                '<div class="brtc-style-views-table brtc-va-studio-dm-draggable">' +
                '   <div class="brtc-style-views-table-icon">' + (options.type).substring(0, 1) + '</div>' +
                '   <div class="brtc-style-views-table-label"></div>' +
                '</div>');
            $content.append($tableControl);

            $tableControl.attr('title', options.label);
            $tableControl.find('.brtc-style-views-table-label').text(options.label);

            $parent.append($content);

            return $tableControl;
        },
        createKeyItem: function (options) {
            var faClasses = {
                table: 'fa fa-table',
                model: 'fa fa-table',
                image: 'fa fa-table'
            }

            var $content = $('<div class="brtc-va-views-key-content">');
            var $key = $('' +
                '<div class="brtc-style-views-key">' +
                '   <div class="brtc-style-views-key-icon"><i></i></div>' +
                '   <div class="brtc-style-views-key-label"></div>' +
                '</div>');
            $content.append($key);

            $key.attr('title', options.label);
            $key.find('.brtc-style-views-key-icon').attr(options.type);
            $key.find('.brtc-style-views-key-label').text(options.label);
            $key.find('i').addClass(faClasses[options.type]);

            return $content;
        },
        createDialogContentsArea: function ($parent, option) {
            var content = $('' +
                '<div class="brtc-va-dialogs-body-content">' +
                '    <span class="brtc-va-dialogs-body-content-icon"></span>' +
                '    <div class="brtc-va-dialogs-body-content-content-text"><span></span></div>' +
                '</div>');
            $parent.append(content);

            content.find('.brtc-va-dialogs-body-content-icon').attr('alert', option.type);
            content.find('.brtc-va-dialogs-body-content-content-text span').text(option.contentText);
            // content.find('.brtc-va-dialogs-body-content-content-text').parent().parent().css('padding-bottom', '10px');
            // content.find('.brtc-va-dialogs-body-content-content-text').parent().parent().css('padding-right', '0');

            content.find('.brtc-va-dialogs-body-content-content-text').attr('title', option.contentText);
            if (content.find('.brtc-va-dialogs-body-content-content-text').innerHeight() > 30) {
                content.find('.brtc-va-dialogs-body-content-content-text').css('line-height', '15px');
            }
        },
        openConfirmDialog: function (message, closeCallback) {
            this.createCommonConfirmDialog($('body'), {
                type: 'info',
                isCancel: true,
                contentText: message,
                close: closeCallback
            });
        },
        openConfirmWithOptionDialog: function (title, message, optionMessage, closeCallback) {
            this.createCommonConfirmWithOptionDialog($('body'), {
                title: title,
                type: 'info',
                isCancel: true,
                contentText: message,
                optionText: optionMessage,
                close: closeCallback
            });
        },
        checkAgentStatus: function () {
            var option = {
                url: 'api/va/v2/analytics/agentuser/status',
                blocking: false,
                type: 'GET'
            };
            return $.ajax(option);
        },
        createProgressDialog: function ($parent, options) {
            var dialogResult = {
                OK: false,
                Cancel: true
            };

            var mainControl = $('' +
                '<div class="brtc-va-dialogs-main">' +
                '   <div class="brtc-va-dialogs-body">' +
                '       <div class="brtc-va-progress">' +
                '           <div style="padding-left: 120px;"><span class="brtc-va-progress-loading"></span></div>' +
                '       </div>' +
                '       <div class="brtc-va-dialogs-contents">' +
                '           <span class="brtc-va-dialogs-body-content-icon" alert="info"></span>' +
                '           <div class="brtc-va-dialogs-body-content-content-text">Please try again later.</div>' +
                '       </div>' +
                '       <div class="brtc-va-dialogs-buttonbar">' +
                '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
                '       </div>' +
                '   </div>' +
                '</div>');
            $parent.append(mainControl);

            mainControl.find('.brtc-va-dialogs-body-content-content-text').css('display', 'none');
            mainControl.find('.brtc-va-dialogs-body-content-icon').css('display', 'none');

            var okButton;
            okButton = mainControl.find('.brtc-va-dialogs-buttonbar-ok');
            okButton.css('display', 'none');
            var jqxOpt = {
                theme: Brightics.VA.Env.Theme,
                width: 400,
                height: 280,
                title: options.title,
                modal: true,
                resizable: false,
                showCloseButton: false,
                open: function () {
                    okButton.jqxButton({
                        theme: Brightics.VA.Env.Theme
                    });
                    okButton.click(function () {
                        dialogResult = {
                            OK: true,
                            Cancel: false
                        };
                        mainControl.dialog('close');
                    });
                },
                close: function () {
                    mainControl.dialog('destroy');
                    mainControl.remove();

                    if (typeof options.close == 'function') {
                        options.close(dialogResult);
                    }
                },
                focus: function () {
                },
                keyboardCloseKey: ''
            };
            mainControl.dialog(jqxOpt);
            mainControl.attr('name', jqxOpt.title);
            return mainControl;
        },
        getBadRequestErrorMessage: function (err) {
            if (err.status == 400) {
                var responseJSON = err.responseJSON;
                if (!responseJSON) {
                    try {
                        responseJSON = JSON.parse(err.responseText);
                    } catch (ex) {
                        console.error(ex);
                    }
                }
                if (responseJSON && (responseJSON.errors[0].code === 'BR-3203')) {
                    return 'Sorry! The workspace is not available. Please contact administrator.';
                }
            }
        },
        openBadRequestErrorDialog: function (err, closeCallback) {
            if (err.status !== 400) {
                if (typeof closeCallback === 'function') {
                    closeCallback({
                        OK: false,
                        Cancel: true
                    });
                }
                return;
            }

            var responseJSON = err.responseJSON;
            if (!responseJSON) {
                try {
                    var messageJSON = JSON.parse(err.responseText);
                    responseJSON = messageJSON;
                } catch (err) {
                    responseJSON = {
                        'errors': [
                            {
                                'message': 'Sorry! An unexpected error occurred. Please contact administrator.',
                                'code': 400,
                                'detailMessage': err.responseText,
                                'detailContentType': 'application/json'
                            }
                        ]
                    };
                }
            }
            if (responseJSON && responseJSON.errors[0].code === 'BR-3203') {
                var _this = this;
                var progressBar = this.createProgressDialog($('body'), {
                    title: 'Preparing workspace...',
                    close: closeCallback
                });

                var clock = 0;
                var checkTimer = function () {
                    var showTryAgainMessage = function () {
                        progressBar.find('.brtc-va-progress').css('display', 'none');
                        progressBar.find('.brtc-va-dialogs-body-content-content-text').css('display', 'block');
                        progressBar.find('.brtc-va-dialogs-body-content-icon').css('display', 'block');
                        progressBar.find('.brtc-va-dialogs-buttonbar-ok').css('display', 'block');
                    };

                    clock++;
                    _this.checkAgentStatus().done(function (status) {
                        if (status === 'STOP') {
                            if (clock > 30) { // 60초
                                clearTimeout(_this.timer);
                                showTryAgainMessage();
                            } else {
                                clearTimeout(_this.timer);
                                _this.timer = setTimeout(checkTimer, 2000);
                            }
                        } else {
                            clearTimeout(_this.timer);
                            showTryAgainMessage();
                        }
                    }).fail(function (err) {
                        clearTimeout(_this.timer);
                        showTryAgainMessage();
                    });
                };
                clearTimeout(_this.timer);
                _this.timer = setTimeout(checkTimer, 2000);
            } else if (responseJSON && responseJSON.errors) {
                this.openErrorDialog(responseJSON, closeCallback);
            } else {
                this.openErrorDialog('Sorry! An unexpected error occurred. Please contact administrator.', closeCallback);
            }
        },
        openErrorDialog: function (err, closeCallback) {
            var message, detailMessage, detailContentType;
            if (typeof err === 'string') message = this.codeToMessage(err);
            else if (err.errors && Array.isArray(err.errors)) {
                message = err.errors[0].message;
                if (!message) {
                    message = 'Sorry! An unexpected error occurred. Please contact administrator.';
                }
                if (message.indexOf('SparkException:') == 0 ||
                    message.indexOf('NoClassDefFoundError:') == 0) {
                    message = 'Sorry! An unexpected error occurred. Please contact administrator.';
                } else if (message.indexOf('Exception:') == 0) {
                    message = message.substring(10, msg.length).trim();
                } else if (message.indexOf('AnalysisException:') == 0) {
                    message = message.substring(18, msg.length).trim();
                } else if (message.indexOf('InvalidInputException:') == 0) {
                    message = 'Input path does not exist.';
                }
                if (message.indexOf('Not allowed condition') > -1) {
                    message = 'Can not update. Check schedule status.';
                }

                if (err.errors[0].detailMessage) detailMessage = err.errors[0].detailMessage;
                if (err.errors[0].contentType) detailContentType = err.errors[0].contentType;
            }

            var _this = this;
            clearTimeout(this.openError);
            this.openError = setTimeout(function () {
                _this.createCommonConfirmDialog($('body'), {
                    type: 'error',
                    isCancel: false,
                    contentText: message,
                    close: closeCallback,
                    detailText: detailMessage,
                    detailContentType: detailContentType
                });
            }, 500);
        },
        openInformationDialog: function (message, closeCallback) {
            this.createCommonConfirmDialog($('body'), {
                type: 'info',
                isCancel: false,
                contentText: message,
                close: closeCallback
            });
        },
        openQuestionDialog: function (message, closeCallback) {
            this.createCommonConfirmDialog($('body'), {
                type: 'info',
                okLabel: 'Yes',
                cancelLabel: 'No',
                isCancel: true,
                contentText: message,
                close: closeCallback
            });
        },
        openWarningDialog: function (message, closeCallback) {
            var _this = this;
            clearTimeout(this.openWarning);
            this.openWarning = setTimeout(function () {
                _this.createCommonConfirmDialog($('body'), {
                    type: 'warn',
                    isCancel: false,
                    contentText: message,
                    close: closeCallback
                });
            }, 500);
        },
        createCommonConfirmDialog: function ($parent, options) {
            var dialogResult = {
                OK: false,
                Cancel: true
            };
            var mainControl = $('' +
                '<div class="brtc-va-dialogs-main">' +
                '   <div class="brtc-va-dialogs-body">' +
                '       <div class="brtc-va-dialogs-contents" style="padding-right: 0 !important; padding-bottom: 10px !important;">' +
                '       </div>' +
                '       <div class="brtc-va-dialogs-buttonbar">' +
                '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="'+ Brightics.locale.common.ok +'" />' +
                '       </div>' +
                '   </div>' +
                '</div>');

            $parent.append(mainControl);
            var okButton, cancelButton, detailButton;
            okButton = mainControl.find('.brtc-va-dialogs-buttonbar-ok');
            if (options.okLabel) {
                okButton.val(options.okLabel);
            }

            if (options.isCancel) {
                cancelButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="'+ Brightics.locale.common.cancel +'" />');
                mainControl.find('.brtc-va-dialogs-buttonbar').append(cancelButton);

                if (options.cancelLabel) {
                    cancelButton.val(options.cancelLabel);
                }
            }

            if (options.detailText) {
                detailButton = $('<input type="button" class="brtc-va-dialogs-buttonbar-detail" value="'+ Brightics.locale.common.detail +'" />');
                mainControl.find('.brtc-va-dialogs-buttonbar').append(detailButton);
            }

            var _this = this;
            var jqxOpt = {
                theme: Brightics.VA.Env.Theme,
                width: 400,
                height: 210,
                modal: true,
                resizable: false,
                cancelButton: cancelButton,
                open: function () {
                    mainControl.parent().find('.ui-dialog-titlebar.ui-widget-header').attr('style', 'border-bottom: none !important;');
                    mainControl.parent().find('button.ui-dialog-titlebar-close').css('top', '30px !important');

                    _this.createDialogContentsArea(mainControl.find('.brtc-va-dialogs-contents'), options);
                    okButton.jqxButton({
                        theme: Brightics.VA.Env.Theme
                    });
                    okButton.click(function () {
                        dialogResult = {
                            OK: true,
                            Cancel: false
                        };
                        mainControl.dialog('close');
                    });
                    if (options.isCancel) {
                        cancelButton.jqxButton({
                            theme: Brightics.VA.Env.Theme
                        });
                        cancelButton.click(function () {
                            dialogResult = {
                                OK: false,
                                Cancel: true
                            };
                            mainControl.dialog('close');
                        });
                    }

                    if (options.detailText) {
                        detailButton.jqxButton({
                            theme: Brightics.VA.Env.Theme
                        });
                        detailButton.click(function () {
                            if (options.detailContentType && options.detailContentType.startsWith('text/html')) {
                                var params = [
                                    'width=800',
                                    'height=600',
                                    'menubar=no',
                                    'status=no',
                                    'toolbar=no',
                                    'location=no'
                                ];
                                var w = window.open('/detail-popup', 'Detail Information', params.join(','));
                                w.document.write(options.detailText);
                            } else {
                                new Brightics.VA.Core.Dialogs.DetailDialog(mainControl, {
                                    title: 'Detail Information',
                                    detailText: options.detailText
                                });
                            }
                        });
                    }
                },
                close: function () {
                    mainControl.dialog('destroy');
                    mainControl.remove();

                    if (typeof options.close == 'function') {
                        options.close(dialogResult);
                    }
                },
                focus: function () {
                    mainControl.focus();
                }
            };

            mainControl.dialog(jqxOpt);
            mainControl.find('.brtc-va-dialogs-main').css('padding-left', '5px');
            mainControl.attr('name', jqxOpt.title);

            return mainControl;
        },
        createCommonConfirmWithOptionDialog: function ($parent, options) {
            new Brightics.VA.Core.Dialogs.ConfirmWithOptionDialog($parent, options);
        },
        codeToMessage: function (err) {
            /*
             * {
             *   "errors" = [ {
             *       "message": "This is first error message.",
             *       "code": 401
             *     }, {
             *       "message": "This is second error message.",
             *       "code": 402
             *     } ]
             * }
             */
            var msg;
            if (err && Array.isArray(err.errors)) {
                var message = '';
                for (var i in err.errors) {
                    msg = err.errors[i].message;
                    if (!msg) {
                        msg = 'Sorry! An unexpected error occurred. Please contact administrator.';
                    }
                    if (msg.indexOf('SparkException:') == 0 ||
                        msg.indexOf('NoClassDefFoundError:') == 0) {
                        msg = 'Sorry! An unexpected error occurred. Please contact administrator.';
                    } else if (msg.indexOf('Exception:') == 0) {
                        msg = msg.substring(10, msg.length).trim();
                    } else if (msg.indexOf('AnalysisException:') == 0) {
                        msg = msg.substring(18, msg.length).trim();
                    } else if (msg.indexOf('InvalidInputException:') == 0) {
                        msg = 'Input path does not exist.';
                    }
                    if (msg.indexOf('Not allowed condition') > -1) {
                        msg = 'Can not update. Check schedule status.';
                    }

                    message += msg + '\n';
                }
                return message;
            } else if (typeof err === 'string') {
                msg = err;
                if (msg.indexOf('SparkException:') == 0 ||
                    msg.indexOf('NoClassDefFoundError:') == 0) {
                    msg = 'Sorry! An unexpected error occurred. Please contact administrator.';
                } else if (msg.indexOf('Exception:') == 0) {
                    msg = msg.substring(10, msg.length).trim();
                } else if (msg.indexOf('AnalysisException:') == 0) {
                    msg = msg.substring(18, msg.length).trim();
                } else if (msg.indexOf('InvalidInputException:') == 0) {
                    msg = 'Input path does not exist.';
                }
                return msg;
            } else {
                return err;
            }
        },
        convertHTMLSpecialChar: function (str) {
            if (str) {
                str = str.replace(/&/g, '&amp;');
                str = str.replace(/</g, '&lt;');
                str = str.replace(/>/g, '&gt;');
                str = str.replace(/"/g, '&quot;');
                str = str.replace(/\s/g, '&nbsp;');
                return str;
            }
            return str;
        },
        adjustCodeMirrorEsc: function (codeMirror) {
            // CodeMirror Hint가 close 될 때, "endCompletion" Event가 CodeMirror로 signal된다.
            // Esc Key로 close되는 경우에는 StopPropagation 하여 Dialog가 함께 close 되는 것 방지.
            codeMirror.on('endCompletion', function (cm) {
                if ((window.event instanceof KeyboardEvent) && (window.event.type == 'keydown') && (window.event.key == 'Escape')) {
                    window.event.stopPropagation();
                }
            });
        },
        setValidatorToCodeMirror: function (options) {
            var validator = {};
            validator.type = (typeof options === 'undefined') ? '' : options['valid-type'];
            validator.isValid = function (inputString) {
                var isValid;
                if (validator.type) {
                    isValid = Brightics.VA.Core.Utils.InputValidator.isValid[validator.type](inputString);
                } else {
                    isValid = true;
                }
                return isValid;
            };
            return validator;
        },
        changeCodeMirrorLineToSingle: function (codeMirror, additionalOption) {
            var widgetUtil = this;
            var validator = widgetUtil.setValidatorToCodeMirror(additionalOption);

            codeMirror.on('beforeChange', function (instance, changeObj) {
                var newtext = changeObj.text.join("").replace(/\n/g, ""); // remove ALL \n !
                changeObj.update(changeObj.from, changeObj.to, [newtext]);

                var typedNewLine = changeObj.origin == '+input' && typeof changeObj.text == "object" && changeObj.text.join(" ") == "";
                var typedNewString = (changeObj.origin === 'setValue' || changeObj.origin === '+delete') ? undefined : changeObj.text.join("") || '';
                var isValid = validator.isValid(typedNewString);
                if (!isValid) {
                    typedNewString = (typedNewString.length > 10) ? typedNewString.substring(0, 9) + '...' : typedNewString;
                    typedNewString = typedNewString === '\t' ? 'Tab' : typedNewString === '' ? 'Enter' : typedNewString;
                    var message = '※ This character( ' + typedNewString + ' ) is NOT allowed.';
                    Brightics.VA.Core.Widget.Factory.createFadeOutMessage($(instance.display.lineDiv).closest('.CodeMirror'), {
                        message: message,
                        position: additionalOption['valid-message-position']
                    });
                }
                if (typedNewLine || !isValid) {
                    instance.doc.setCursor(instance.getCursor());
                    return changeObj.cancel();
                }
                // var typedNewLine = changeObj.origin == '+input' && typeof changeObj.text == "object" && changeObj.text.join("") == "";
                // if (typedNewLine) return changeObj.cancel();

                var pastedNewLine = changeObj.origin == 'paste' && typeof changeObj.text == "object" && changeObj.text.length > 1;
                if (pastedNewLine) {
                    var newText = changeObj.text.join(" ");
                    return changeObj.update(null, null, [newText]);
                }
                return null;
            });
            codeMirror.setSize('100%', '27px');
        },
        setCodeMirrorMaxLength: function (codeMirror) {
            codeMirror.on('beforeChange', function (cm, change) {
                    var maxLength = cm.getOption('maxLength');
                    if (maxLength && change.update) {
                        var str = change.text.join('\n');
                        var delta = str.length - (cm.indexFromPos(change.to) - cm.indexFromPos(change.from));
                        if (delta <= 0) {
                            $(cm.getTextArea()).trigger('hideOverflow');
                            return true;
                        }

                        delta = cm.getValue().length + delta - maxLength;
                        if (delta > 0) {
                            $(cm.getTextArea()).trigger('showOverflow');
                            str = str.substr(0, str.length - delta);
                            change.update(change.from, change.to, str.split('\n'));
                        }
                    }
                    return true;
                }
            );
        },
        createUDFItem: function ($parent, udf, clazz, closeHandler, openDialogHandler) {
            var _this = this;

            // var $paletteContent = $('<div class="brtc-va-views-udf-fnunit-content">');
            var $paletteContent = $('<div class="brtc-va-views-udf-fnunit-content ' + 'brtc-va-views-udf-type-' + udf.type + '">');
            var $fnUnitControl = $('' +
                '<div class="brtc-va-views-udf-fnunit brtc-style-views-udf-fnunit brtc-va-studio-dm-draggable">' +
                '   <div class="brtc-va-views-udf-fnunit-icon"></div>' +
                '   <div class="brtc-va-views-udf-fnunit-label"></div>' +
                '   <div class="brtc-va-views-udf-fnunit-version"></div>' +
                // '   <div class="brtc-va-views-udf-fnunit-open-icon brtc-style-udf-fnunit-open-icon" title="Update"></div>' +
                '   <div class="brtc-va-views-udf-fnunit-remove-icon brtc-style-udf-fnunit-remove-icon" title="Delete"></div>' +
                '</div>');
            $paletteContent.append($fnUnitControl);

            var label, category;
            var impleWidgetUtils = Brightics.VA.Core.Interface.WidgetUtils[clazz];
            if (impleWidgetUtils && impleWidgetUtils.createPaletteItem) {
                var paletteItem = impleWidgetUtils.createPaletteItem(udf.id);
                label = paletteItem.label;
                category = paletteItem.category;
            } else {

                var displayLabel = '';
                var displayCategory = '';
                var displayVersion = '';
                if (typeof Brightics.VA.Core.Interface.Functions[clazz][udf.id] === 'undefined' || true) {
                    displayLabel = udf.label ;
                    displayVersion = ' ver' + udf.version;
                    displayCategory = 'udf';
                } else {
                    displayLabel = Brightics.VA.Core.Interface.Functions[clazz][udf.id].defaultFnUnit.display.label;
                    displayCategory = Brightics.VA.Core.Interface.Functions[clazz][udf.id].category;
                }
                label = displayLabel;
                category = 'brtc-va-fnunit-category-' + displayCategory;
            }

            $fnUnitControl.find('.brtc-va-views-udf-fnunit-open-icon').hide();
            $fnUnitControl.find('.brtc-va-views-udf-fnunit-remove-icon').hide();

            $fnUnitControl.attr('title', label);
            $fnUnitControl.find('.brtc-va-views-udf-fnunit-label').text(label);
            $fnUnitControl.find('.brtc-va-views-udf-fnunit-version').text(displayVersion);

            $fnUnitControl.find('.brtc-va-views-udf-fnunit-open-icon').on('click', function () {
                openDialogHandler();
            });

            $fnUnitControl.mouseover(function (event) {
                $(this).find('.brtc-va-views-udf-fnunit-open-icon').show();
                if (false && Brightics.VA.Env.Session.userId !== udf.creator) {
                    $(this).find('.brtc-va-views-udf-fnunit-remove-icon').hide();
                } else {
                    $(this).find('.brtc-va-views-udf-fnunit-remove-icon').show();
                }
            });
            $fnUnitControl.mouseout(function (event) {
                $(this).find('.brtc-va-views-udf-fnunit-open-icon').hide();
                $(this).find('.brtc-va-views-udf-fnunit-remove-icon').hide();
            });

            $fnUnitControl.find('.brtc-va-views-udf-fnunit-remove-icon').on('click', function () {
                var options = {
                    contentText: 'These items will be permanently deleted and cannot be recovered. Are you sure?',
                    close: closeHandler,
                    isCancel: true
                };
                Brightics.VA.Core.Utils.WidgetUtils.createCommonConfirmDialog($parent, options);
            });


            $fnUnitControl.addClass(category);

            $parent.append($paletteContent);
            this.putData($fnUnitControl, 'udf', udf);

            return $fnUnitControl;
        },
        getFunctionLibrary: function (clazz, func) {
            if (typeof Brightics.VA.Core.Interface.Functions[clazz][func] === 'undefined') {
                return Brightics.VA.Core.Interface.Functions[clazz].unknownFunction;
            } else {
                return Brightics.VA.Core.Interface.Functions[clazz][func];
            }
        },
        createPrivatePolicy: function ($parent) {
            var $privatePolicy = $('' +
                '<div class="brtc-va-widget-utils-private-policy-division">' +
                '   <span class="brtc-va-widget-utils-private-policy-span">Private Policy</span>' +
                '</div>');
            $parent.append($privatePolicy);

            $privatePolicy.click(function () {
                window.open('/private-policy', 'Brightics Private Policy');
            });

            var $projectList = $parent.find('.brtc-va-workspace-project-list');
            if ($projectList && $projectList.length) $projectList.css('height', 'calc(100% - 98px)');  //private policy text 공간을 위해
        },
        updateGridSource: function ($grid, source) {
            var adapter = new $.jqx.dataAdapter(source);
            $grid.jqxGrid('source', adapter);
            $grid.jqxGrid('clearfilters');
            $grid.jqxGrid('clearselection');

            this.updatePageButton($grid);
        },
        updatePageButton: function ($grid) {
            var paginginformation = $grid.jqxGrid('getpaginginformation');

            var $first = $grid.find('.jqx-grid-pager div[type=button][title=first]'),
                $previous = $grid.find('.jqx-grid-pager div[type=button][title=previous]'),
                $last = $grid.find('.jqx-grid-pager div[type=button][title=last]'),
                $next = $grid.find('.jqx-grid-pager div[type=button][title=next]');

            if (paginginformation.pagenum === 0) {
                $first.css('opacity', '.3').jqxButton({disabled: true});
                $previous.css('opacity', '.3').jqxButton({disabled: true});
            } else {
                $first.css('opacity', '1').jqxButton({disabled: false});
                $previous.css('opacity', '1').jqxButton({disabled: false});
            }

            if (paginginformation.pagescount === 0 || paginginformation.pagenum === paginginformation.pagescount - 1) {
                $last.css('opacity', '.3').jqxButton({disabled: true});
                $next.css('opacity', '.3').jqxButton({disabled: true});
            } else {
                $last.css('opacity', '1').jqxButton({disabled: false});
                $next.css('opacity', '1').jqxButton({disabled: false});
            }
        },
        debounce: function (fn, ms) {
            return _.debounce(fn, ms, {maxWait: ms});
        },
        setTrimInputControlOnFocusout: function ($control) {
            $control.focusout(function (e) {
                var inputString = $control.val();
                var isValid = Brightics.VA.Core.Utils.InputValidator.isValid;
                if (isValid.startWithSpace(inputString) || isValid.endWithSpace(inputString)) {
                    $control.val(inputString.trim());
                    Brightics.VA.Core.Widget.Factory.createFadeOutMessage($control, {
                        message: 'This input value is trimmed.',
                        position: 'bottom'
                    });
                }
            });

        },
        convertInequalitySign: function (str) {
            if (str) {
                str = str.replace(/<=/g, '\u2264');
                str = str.replace(/>=/g, '\u2265');
                return str;
            }
            return str;
        },
        destroyJqxControl: function ($target) {
            var $jqxElements = $target.find('.jqx-widget');
            $jqxElements.each(function () {
                var elementData = $(this).data();
                if (elementData.jqxWidget) {
                    var jqxWidgetName = elementData.jqxWidget.widgetName;
                    if (typeof $(this)[jqxWidgetName] === 'function') {
                        $(this)[jqxWidgetName]('destroy');
                    }
                }
            });
        }
    };


}).call(this);
