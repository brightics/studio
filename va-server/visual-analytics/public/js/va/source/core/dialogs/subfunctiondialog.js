/**
 * Created by SDS on 2017-08-27.
 */
(function () {
        'use strict';

        var root = this;
        var Brightics = root.Brightics;

        function SubFunctionDialog(parentId, options) {
            this.parentId = parentId;
            this.options = options;
            this.dialogResult = {
                OK: false,
                Cancel: true,
                param: {}
            };

            this.retrieveParent();
            this.createControls();
            this.renderValue();
        }

        SubFunctionDialog.prototype.retrieveParent = function () {
            this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
        };

        SubFunctionDialog.prototype.createControls = function () {
            this.$mainControl = $('' +
                '<div class="brtc-va-dialogs-main">' +
                '   <div class="brtc-va-dialogs-body">' +
                '       <div class="brtc-va-dialogs-contents brtc-va-dialogs-subfunction-contents">' +
                '       </div>' +
                '       <div class="brtc-va-dialogs-buttonbar">' +
                '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
                '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="Cancel" />' +
                '       </div>' +
                '   </div>' +
                '</div>');
            this.$parent.append(this.$mainControl);

            this.$okButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-ok');
            this.$cancelButton = this.$mainControl.find('.brtc-va-dialogs-buttonbar-cancel');

            var _this = this;
            var jqxOpt = {
                theme: Brightics.VA.Env.Theme,
                title: 'Auto Sub Function',
                width: '800',
                height: '800',
                maxWidth: '800',
                maxHeight: '800',
                modal: true,
                resizable: false,
                create: function () {
                    _this.createDialogContentsArea(_this.$mainControl.find('.brtc-va-dialogs-contents'));
                    _this.$okButton.jqxButton({
                        theme: Brightics.VA.Env.Theme
                    });
                    _this.$okButton.click(_this.handleOkClicked.bind(_this));

                    _this.$cancelButton.jqxButton({
                        theme: Brightics.VA.Env.Theme
                    });
                    _this.$cancelButton.click(_this.handleCancelClicked.bind(_this));
                },
                close: function () {
                    if (typeof _this.options.close == 'function') {
                        _this.options.close(_this.dialogResult);
                    }
                }
            };

            this.$mainControl.dialog(jqxOpt);
            $('.ui-dialog-titlebar-close', $(this).parent()).hide();

        };

        SubFunctionDialog.prototype.renderValue = function () {
            for (var i = 0; i < this.options.subFunction.length; i++) {
                var functionName = this.options.subFunction[i];
                this.controlsArray[functionName] = {};
                for (var j = 0; j < this.options.subFunctionParam[functionName].length; j++) {
                    var name = this.options.subFunctionParam[functionName][j].name;
                    var controlType = this.options.subFunctionParam[functionName][j].controltype;
                    var opt = this.options.subFunctionParam[functionName][j].opt;

                    if (controlType === 'dropdown') {
                        let paramValue = this.options.fnUnit.param[functionName][name];

                        this.controlsArray[functionName][name] = [];
                        this.$elements[functionName][name].empty();
                        this.createControlArrRow(true, functionName, name, opt);

                        if (typeof(paramValue) != 'undefined') {
                            for (var k = 0; k < paramValue.length; k++) {
                                if (k >= 1) {
                                    this.createControlArrRow(false, functionName, name, opt);
                                }
                                this.controlsArray[functionName][name][k].val(paramValue[k]);
                            }
                        }
                    } else {
                        let paramValue = '';
                        for (var k in this.options.fnUnit.param[functionName][name]) {
                            paramValue = paramValue + this.options.fnUnit.param[functionName][name][k] + ',';
                        }

                        this.$elements[functionName][name].val(paramValue.substring(0, paramValue.length - 1) || '');
                    }
                }
            }
        }

        SubFunctionDialog.prototype.handleOkClicked = function () {
            this.dialogResult.param = this.getSubFunctionProperty();
            this.dialogResult.OK = true;
            this.dialogResult.Cancel = false;
            this.$mainControl.dialog('close');
        };

        SubFunctionDialog.prototype.handleCancelClicked = function () {
            var _this = this;
            _this.dialogResult.OK = false;
            _this.dialogResult.Cancel = true;
            this.$mainControl.dialog('close');
        };

        SubFunctionDialog.prototype.getSubFunctionProperty = function () {
            var param = {};

            for (var i = 0; i < this.options.subFunction.length; i++) {
                var functionName = this.options.subFunction[i];
                param[functionName] = {};
                for (var j = 0; j < this.options.subFunctionParam[functionName].length; j++) {
                    var name = this.options.subFunctionParam[functionName][j].name;
                    var controlType = this.options.subFunctionParam[functionName][j].controltype;

                    if (controlType === 'dropdown') {
                        for (var k = 0; k < this.controlsArray[functionName][name].length; k++) {
                            if (this.controlsArray[functionName][name][k].val() != '') {
                                param[functionName][name] = [];
                                param[functionName][name].push(this.controlsArray[functionName][name][k].val());
                            }
                        }
                    } else {
                        if (this.$elements[functionName][name].val() != '') {
                            param[functionName][name] = [];
                            var paramArr = this.$elements[functionName][name].val().split(',');
                            for (var k in paramArr) {
                                param[functionName][name].push(paramArr[k].trim());
                            }
                        }
                    }
                }
            }

            return param;
        };

        SubFunctionDialog.prototype.createDialogContentsArea = function ($parent) {
            var _this = this;
            $parent.append('' +
                '<div class="brtc-va-dialogs-subfunction-toolbar-area">' +
                '</div>' +
                '<div class="brtc-va-dialogs-subfunction-properties-area">' +
                '</div>');

            var $toolBarArea = $parent.find('.brtc-va-dialogs-subfunction-toolbar-area');

            for (var i = 0; i < this.options.subFunction.length; i++) {
                var functionName = this.options.subFunction[i];
                $toolBarArea.append('<div class="brtc-va-dialogs-subfunction-toolitem" function-name="' + functionName + '">' + functionName + '</div>');

                $toolBarArea.find('.brtc-va-dialogs-subfunction-toolitem[function-name="' + functionName + '"]').on('click', function () {
                    $parent.find('.brtc-va-dialogs-area').css('display', 'none');
                    $parent.find('.brtc-va-dialogs-area[function-name="' + event.target.innerText + '"]').css('display', 'block');
                });
            }

            $parent.find('.brtc-va-dialogs-subfunction-toolitem').jqxButton({
                theme: Brightics.VA.Env.Theme
            });

            this.$elements = {};
            this.controls = {};
            this.controlsArray = {};

            this.$propertiesArea = $parent.find('.brtc-va-dialogs-subfunction-properties-area');

            for (var i = 0; i < this.options.subFunction.length; i++) {
                _this.createSubFunctionContentsArea(this.$propertiesArea, this.options.subFunction[i]);
            }
        };

        SubFunctionDialog.prototype.createSubFunctionContentsArea = function ($parent, functionName) {
            $parent.append('' +
                '<div class="brtc-va-dialogs-area" function-name="' + functionName + '"/>' +
                '');

            this.$contentsArea = $parent.find('.brtc-va-dialogs-area');
            this.$elements[functionName] = {};
            this.controls[functionName] = {};

            for (var i = 0; i < this.options.subFunctionParam[functionName].length; i++) {
                var label = this.options.subFunctionParam[functionName][i].label,
                    name = this.options.subFunctionParam[functionName][i].name,
                    placeholder = this.options.subFunctionParam[functionName][i].placeholder,
                    controlType = this.options.subFunctionParam[functionName][i].controltype;

                if (controlType === 'dropdown') {
                    this.createDropDownControl(this.$contentsArea, functionName, label, name, {'placeHolder': placeholder});
                } else {
                    this.createInputControl(this.$contentsArea, functionName, label, name, {'placeHolder': placeholder});
                }
            }
            this.$contentsArea.css('display', 'none');
        };

        SubFunctionDialog.prototype.createInputControl = function ($parent, functionName, label, param, opt) {
            var _this = this;
            _this.$elements[functionName][param] = $('<input type="text" class="brtc-va-dialogs-controls-propertycontrol-input"/>');
            _this.addPropertyControl(label, function ($container) {
                $container.append(_this.$elements[functionName][param]);
                _this.controls[functionName][param] = _this.createInput(_this.$elements[functionName][param], opt);
            });
        };

        SubFunctionDialog.prototype.addPropertyControl = function (label, callback) {
            var _this = this,
                $propertyControl = $('' +
                    '<div class="brtc-va-dialogs-controls-propertycontrol">' +
                    '   <div class="brtc-va-dialogs-controls-propertycontrol-label"></div>' +
                    '   <div class="brtc-va-dialogs-controls-propertycontrol-contents">' +
                    '</div>');

            this.$contentsArea.append($propertyControl);

            $propertyControl.jqxExpander(
                {
                    theme: Brightics.VA.Env.Theme,
                    arrowPosition: "left",
                    initContent: function () {
                        if (typeof  callback === 'function') {
                            callback.call(_this, $propertyControl.find(".brtc-va-dialogs-controls-propertycontrol-contents"));
                        }
                    }
                });
            $propertyControl.jqxExpander('setHeaderContent', label);

            return $propertyControl;
        };

        SubFunctionDialog.prototype.createInput = function ($control, jqxOptions) {
            var options = {
                theme: Brightics.VA.Env.Theme,
                height: '25px',
                placeHolder: 'Enter value'
            };
            if (jqxOptions) {
                $.extend(options, jqxOptions);
            }
            $control.jqxInput(options);

            return $control;
        };

        SubFunctionDialog.prototype.createControlArrRow = function (isFirst, functionName, name, opt) {
            var _this = this;
            var $byControlRow = $('<div class="brtc-va-dialogs-property-row-container brtc-va-dialog-property-row-content"></div>');
            var $byControlCombo = $('<div class="brtc-va-dialogs-controls-propertycontrol-combobox"/>');
            var $byControlAddButton = $('<div class="brtc-va-dialogs-property-row-content-add-button"></div>');
            var $byControlRemoveButton = $('<div class="brtc-va-dialogs-property-row-content-remove-button"></div>');
            $byControlRow.append($byControlCombo);
            if (isFirst) {
                $byControlRow.append($byControlAddButton);
            }
            else {
                $byControlRow.append($byControlRemoveButton);
            }


            this.controlsArray[functionName][name].push($byControlCombo);
            this.$elements[functionName][name].append($byControlRow);

            _this.controls[functionName][name] = _this.createDropDownList($byControlCombo, opt, '', {
                'width': '90%',
                'float': 'left'
            });

            $byControlRemoveButton.click(function () {
                var targetRow = $byControlRemoveButton.parents('.brtc-va-dialogs-property-row-content');
                var targetIndex = targetRow.prevAll().length;
                _this.controlsArray[functionName][name].splice(targetIndex, 1);
                targetRow.remove();
            });

            $byControlRemoveButton.hover(function () {
                $(this).css({color: '#86BFA0'});
            }, function () {
                $(this).css({color: ''});
            });

            $byControlAddButton.click(function () {
                _this.createControlArrRow(false, functionName, name, opt);
            });

            $byControlAddButton.hover(function () {
                $(this).css({color: '#429366'});
            }, function () {
                $(this).css({color: ''});
            });
        };

        SubFunctionDialog.prototype.createDropDownControl = function ($parent, functionName, label, param) {
            var _this = this;
            _this.$elements[functionName][param] = $('<div class="brtc-va-dialogs-controls-propertycontrol-combobox"/>');
            _this.addPropertyControl(label, function ($container) {
                $container.append(_this.$elements[functionName][param]);
            });
        };

        SubFunctionDialog.prototype.createDropDownList = function ($control, jqxOptions) {
            var options = {
                theme: Brightics.VA.Env.Theme,
                width: '100%',
                height: '25px'
            };
            if (jqxOptions) {
                $.extend(options, jqxOptions);
            }
            $control.jqxDropDownList(options);
            return $control;
        };

        Brightics.VA.Core.Dialogs.SubFunctionDialog = SubFunctionDialog;

    }
).call(this);