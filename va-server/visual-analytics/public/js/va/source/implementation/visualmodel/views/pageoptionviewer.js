/**
 * Created by daewon.park on 2016-10-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    const PAGE_TYPE_LIST = [
        {
            label: 'A4 Portrait',
            value: 'a4-vertical'
        },
        {
            label: 'A4 Landscape',
            value: 'a4-horizontal'
        },
        {
            label: 'Custom',
            value: 'custom'
        }
    ];

    const PAGE_SIZE = {
        'a4-vertical': {
            width: 795,
            height: 1125
        },
        'a4-horizontal': {
            width: 1125,
            height: 795
        }
    };

    function PageOptionViewer(parentId, options) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.call(this, parentId, options);
    }

    PageOptionViewer.prototype = Object.create(Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype);
    PageOptionViewer.prototype.constructor = PageOptionViewer;

    PageOptionViewer.prototype.init = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.init.call(this);
    };

    PageOptionViewer.prototype.createControls = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.createControls.call(this);

        this.$mainControl = $('' +
            '<div class="brtc-va-controls-options-viewer brtc-style-option-viewer brtc-style-s-sidebar-background chart" viewer-type="page">' +
            '   <span class="brtc-style-option-category brtc-style-s-option-category">' +Brightics.locale.common.properties+ '</span>' +
            '   <div class="brtc-va-controls-options-panel"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);

        this.createBackgroundControl(this.$mainControl.find('.brtc-va-controls-options-panel'));
        this.createPageSizeContainer(this.$mainControl.find('.brtc-va-controls-options-panel'));
        // this.createFontStyleControl(this.$mainControl.find('.brtc-va-controls-options-panel'));

        this.$mainControl.find('.brtc-va-controls-options-panel').perfectScrollbar();
    };

    PageOptionViewer.prototype.createBackgroundControl = function ($parent) {
        var report = this.getEditor().getModel().report;
        var editorPage = this.getEditor().getDiagramEditorPage();
        $parent.append($('' +
            '<div class="brtc-style-margin-bottom-5">' + Brightics.locale.visual.pageBackground + '</div>' +
            ''));

        this.optionControl = Brightics.Chart.Adonis.Component.Widgets.Factory.createColorPickerWidget($parent, {
            value: report.display['backgroundColor'] || '#ffffff',
            onChanged: function (changedColor) {
                var color = report.display['backgroundColor'] || '#ffffff';
                if (color !== changedColor) {
                    var command = editorPage.createSetPageDisplayOptionsCommand({backgroundColor: changedColor});
                    editorPage.executeCommand(command);
                }
            }
        });
    };

    PageOptionViewer.prototype.createPageSizeContainer = function ($parent) {

        $parent.append($('<div class="brtc-style-margin-bottom-5">' + Brightics.locale.visual.pageSize + '</div>'));

        var $pageSizeControlContainer = $('<div class="brtc-va-controls-options-viewer-page-size-container"></div>');
        $parent.append($pageSizeControlContainer);

        this._createPageSizeControl($pageSizeControlContainer);
        this._createCustomPageSizeControl($parent);
        var display = this.getEditor().getModel().report.display;
        if (display['page-type'] === 'custom') {
            this._showCustomPageSizeContainer()
        } else {
            this._hideCustomPageSizeContainer()
        }
    };

    PageOptionViewer.prototype._createPageSizeControl = function ($parent) {
        var _this = this;
        var report = this.getEditor().getModel().report;
        var display = report.display;
        var selectedIndex = 0;

        if (display['page-type']) {
            for (var i = 0; i < PAGE_TYPE_LIST.length; i++) {
                if (PAGE_TYPE_LIST[i].value === display['page-type']) {
                    selectedIndex = i;
                    break;
                }
            }
        }

        this._$pageTypeList = $('<div class="brtc-va-controls-options-viewer-page-size-type-list brtc-style-border-box"></div>');
        $parent.append(this._$pageTypeList);
        this._$pageTypeList.jqxDropDownList({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            source: PAGE_TYPE_LIST,
            displayMember: 'label',
            valueMember: 'value',
            selectedIndex: selectedIndex,
            dropDownHeight: 75
        });
        this._$pageTypeList.on('select', function (event) {
            var args = event.args;
            if (args) {
                var value = args.item.value;
                if (value === 'custom') {
                    _this._showCustomPageSizeContainer();
                    _this._changePageSize();

                } else {
                    _this._hideCustomPageSizeContainer();
                    _this._changePageSize();
                }
            }
        });
    };


    PageOptionViewer.prototype._createCustomPageSizeControl = function ($parent) {
        var _this = this;
        var inputOption = {};
        this._$customPageSizeWrapper = $('' +
            '<div class="brtc-va-controls-options-viewer-custom-page-size-wrapper brtc-style-margin-vertical-5">' +
            '   <div class="brtc-va-controls-options-viewer-custom-page-size-wrapper-tooltip" style="display: flex;margin-top: 5px;margin-bottom: 10px;color: rgba(194, 6, 17, .65);">Custom page does not support exporting-PDF.</div>' +
            '   <div class="brtc-va-controls-options-viewer-custom-page-size-width-control-wrapper">' +
            '       <div class="brtc-style-flex-center">' +
            '           <div class="brtc-style-col-3 brtc-style-flex-center">Width :</div>' +
            '           <div class="brtc-va-controls-options-viewer-custom-page-size-width-control"></div>' +
            '           <div class="brtc-style-col-2 brtc-style-flex-center">PX</div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="brtc-va-controls-options-viewer-custom-page-size-height-control-wrapper">' +
            '       <div class="brtc-style-flex-center brtc-style-margin-top-5">' +
            '           <div class="brtc-style-col-3 brtc-style-flex-center">Height :</div>' +
            '           <div class="brtc-va-controls-options-viewer-custom-page-size-height-control"></div>' +
            '           <div class="brtc-style-col-2 brtc-style-flex-center">PX</div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        $parent.append(this._$customPageSizeWrapper);

        this._customWidth = Brightics.VA.Core.Widget.Factory.numericInputControl(this._$customPageSizeWrapper.find('.brtc-va-controls-options-viewer-custom-page-size-width-control'), inputOption);

        var widthControlWrapper = this._$customPageSizeWrapper.find('.brtc-va-controls-options-viewer-custom-page-size-width-control-wrapper');
        this._customWidth.onChange(function (val) {
            if (Number.parseInt(val) < 500) {
                _this._showInvalidSizeMessage(widthControlWrapper, 'Width must be greater than 500px or equal.');
            } else if (Number.parseInt(val) > 10000) {
                _this._showInvalidSizeMessage(widthControlWrapper, 'Width must be less than 10000px or equal.');
            } else {
                _this._removeInvalidSizeMessage(widthControlWrapper);
                if (_this._getPageSize.width !== Number.parseInt(val)) _this._changePageSize();
            }
        });

        var heightControlWrapper = this._$customPageSizeWrapper.find('.brtc-va-controls-options-viewer-custom-page-size-height-control-wrapper');
        this._customHeight = Brightics.VA.Core.Widget.Factory.numericInputControl(this._$customPageSizeWrapper.find('.brtc-va-controls-options-viewer-custom-page-size-height-control'), inputOption);
        this._customHeight.onChange(function (val) {
            if (Number.parseInt(val) < 500) {
                _this._showInvalidSizeMessage(heightControlWrapper, 'Height must be greater than 500px or equal.');
            } else if (Number.parseInt(val) > 10000) {
                _this._showInvalidSizeMessage(heightControlWrapper, 'Height must be less than 10000px or equal.');
            } else {
                _this._removeInvalidSizeMessage(heightControlWrapper);
                if (_this._getPageSize.height !== Number.parseInt(val)) _this._changePageSize();
            }
        });
    };

    PageOptionViewer.prototype._showInvalidSizeMessage = function ($target, message) {
        if($target.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').length > 0){
            $target.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        }
        $target.append('<div class="brtc-va-editors-sheet-panels-validation-tooltip-wrapper">' +
            message +
            '</div>')
    };
    PageOptionViewer.prototype._removeInvalidSizeMessage = function ($target) {
        if ($target) {
            $target.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        } else {
            this.$mainControl.find('.brtc-va-editors-sheet-panels-validation-tooltip-wrapper').remove();
        }
    };


    PageOptionViewer.prototype._showCustomPageSizeContainer = function () {
        this._removeInvalidSizeMessage();
        var size = this._getPageSize();
        this._customWidth.setValue(size.width);
        this._customHeight.setValue(size.height);

        this._$customPageSizeWrapper.show()
    };
    PageOptionViewer.prototype._hideCustomPageSizeContainer = function () {
        this._$customPageSizeWrapper.hide()
    };

    PageOptionViewer.prototype._getPageSize = function () {
        var display = this.getEditor().getModel().report.display;
        if (display['page-type'] === 'custom') {
            return {
                width: this._changePixelToNumber(display.width),
                height: this._changePixelToNumber(display.height)
            }
        } else if (display['page-type']) {
            return PAGE_SIZE[display['page-type']];
        } else {
            return Brightics.VA.Implementation.Visual.CONST.DEFAULT_REPORT_SIZE;
        }
    };

    PageOptionViewer.prototype._changePixelToNumber = function (pixel) {
        return Number.parseInt(('' + pixel).replace('px', ''))

    };


    PageOptionViewer.prototype._changePageSize = function () {
        var editorPage = this.getEditor().getDiagramEditorPage();
        var model = this.getEditor().getModel();
        var width, height;
        var pageType = this._$pageTypeList.jqxDropDownList('getSelectedItem').value;
        if (pageType === 'custom') {
            width = this._customWidth.getValue();
            height = this._customHeight.getValue();
        } else {
            width = PAGE_SIZE[pageType].width;
            height = PAGE_SIZE[pageType].height;
        }
        var opt = {
            display: {
                'page-type': pageType,
                'width': width,
                'height': height
            }
        };

        var command = new Brightics.VA.Core.Editors.Diagram.Commands.ChangePageSizeCommand(model, opt);
        editorPage.executeCommand(command);
    };

    PageOptionViewer.prototype.createFontStyleControl = function ($parent) {
        var _this = this;
        Brightics.Chart.Adonis.Component.Widgets.Factory.createFontStyleWidget($parent, {
            value: [
                'Arial', 11, '#AF2A2A',
                ['bold', 'italic', 'underline']
            ],
            onChanged: [
                function (inputVal) {
                    // _this.legendOption.textStyle.fontFamily = inputVal;
                }, function (inputVal) {
                    // _this.legendOption.textStyle.fontSize = inputVal;
                }, function (inputVal) {
                    // _this.legendOption.textStyle.color = inputVal;
                }, function (selectedVals) {
                    // _this.legendOption.textStyle.fontWeight = ($.inArray('bold', selectedVals) > -1) ? 'bold' : 'normal';
                    // _this.legendOption.textStyle.fontStyle = ($.inArray('italic', selectedVals) > -1) ? 'italic' : 'normal';
                    // _this.legendOption.textStyle.textDecoration = ($.inArray('underline', selectedVals) > -1) ? 'underline' : 'none';
                }
            ]
        });
    };

    PageOptionViewer.prototype.showOption = function (contentUnit) {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.showOption.call(this, contentUnit);

        var report = this.getEditor().getModel().report,
            backgroundColor = report.display['backgroundColor'] || '#ffffff';
        this.optionControl.render(backgroundColor, false);
    };

    PageOptionViewer.prototype.hideOption = function () {
        Brightics.VA.Implementation.Visual.Views.BaseOptionViewer.prototype.hideOption.call(this);
    };

    PageOptionViewer.prototype.destroy = function () {
        if (this.optionControl) this.optionControl.destroy();
        this.$mainControl.remove();
    };

    Brightics.VA.Implementation.Visual.Views.OptionViewer['page'] = PageOptionViewer;

}).call(this);
