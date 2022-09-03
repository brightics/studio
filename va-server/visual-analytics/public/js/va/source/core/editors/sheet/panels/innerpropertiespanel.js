/**
 * Created by jhoon80.park on 2016-01-27.
 */

/* global IN_DATA, OUT_DATA, TARGET_FID */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InnerPropertiesPanel(parentId, options) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.call(this, parentId, options);
        
        this.innerType = '';
    }

    InnerPropertiesPanel.prototype = Object.create(Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype);
    InnerPropertiesPanel.prototype.constructor = InnerPropertiesPanel;

    InnerPropertiesPanel.prototype.handleOperationCommand = function (command) {
        Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype.handleOperationCommand.call(this, command);

        Studio.getInstance().doValidate(this.getModel());
    };

    InnerPropertiesPanel.prototype.createControls = function () {
        var _this = this;
        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-basepanel"/>');
        this.$parent.append(this.$mainControl);

        this.createTopArea();
        this.createStepArea();
        this.createContentsArea();
        this.createBottomArea();

        this.$contentsArea.perfectScrollbar('update');

        if (this.$topArea) {
            this.createTopAreaControls(this.$topArea);
        }
        if (this.$bottomArea) {
            this.createBottomAreaControls(this.$bottomArea);
        }
        if (this.$contentsArea) {
            this.createContentsAreaControls(this.$contentsArea);
            if (this.$contentsArea.hasClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area')) {
                this.$contentsArea.perfectScrollbar();
            }
        }

        var $persistButton = this.$topArea.find('.brtc-va-editors-sheet-panels-basepanel-header-tooltip');
        $persistButton.click(function () {
            if ($persistButton.attr('persist-mode') === 'auto') {
                $persistButton.attr('persist-mode', 'true');
                _this.options.fnUnit["persist-mode"] = 'true';
            } else if ($persistButton.attr('persist-mode') === 'true') {
                $persistButton.attr('persist-mode', 'false');
                _this.options.fnUnit["persist-mode"] = 'false';
            } else {
                $persistButton.attr('persist-mode', 'auto');
                _this.options.fnUnit["persist-mode"] = 'auto';
            }
            var properties = {
                'persist-mode': _this.options.fnUnit["persist-mode"]
            };
            var command = _this.createSetFnUnitCommand(properties);
            _this.executeCommand(command);
        });

    };

    InnerPropertiesPanel.prototype.createContentsArea = function () {
        Brightics.VA.Core.Editors.Sheet.Panels.BasePanel.prototype.createContentsArea.call(this);
        this.$contentsArea.addClass('brtc-va-editors-sheet-panels-propertiespanel-contents-area');
        this.$contentsArea.addClass('inner');
    };

    InnerPropertiesPanel.prototype.createStepArea = function () {
        this.$stepArea = $('<div class="brtc-va-editors-sheet-panels-basepanel-step-area"></div>');
        this.$mainControl.append(this.$stepArea);

        this.$stepArea.addClass('brtc-style-padding-left-20').addClass('brtc-style-padding-right-20');

        this.createStepIntoControl();
        this.createStepOutControl();
    };

    InnerPropertiesPanel.prototype.createStepIntoControl = function () {
        var _this = this;

        this.$stepIntoControl = $('<div class="brtc-va-editors-sheet-controls-property-step-control in"></div>');
        this.$stepArea.append(this.$stepIntoControl);

        this.$stepIntoButton = $('' +
            '<button type="button" class="brtc-va-editors-sheet-panels-propertiespanel-button">' +
            'Step Into' +
            '</button>');
        this.$stepIntoControl.append(this.$stepIntoButton);

        this.$stepIntoButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '30px'
        });

        this.$stepIntoButton.click(function () {
            _this.stepInto();
        });
    };

    InnerPropertiesPanel.prototype.createStepOutControl = function () {
        var _this = this;

        this.$stepOutControl = $('<div class="brtc-va-editors-sheet-controls-property-step-control out"></div>');
        this.$stepArea.append(this.$stepOutControl);

        this.$stepOutButton = $('' +
            '<button type="button" class="brtc-va-editors-sheet-panels-propertiespanel-button">' +
            'Step Out' +
            '</button>');
        this.$stepOutControl.append(this.$stepOutButton);

        this.$stepOutButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: '30px'
        });

        this.$stepOutButton.click(function () {
            _this.stepOut();
        });
    };

    InnerPropertiesPanel.prototype.stepInto = function () {
        var $diagram = this.options.modelEditor.getDiagramEditorPageArea();
        $diagram.trigger('fnUnit:dbclick', [[this.options.fnUnit.fid]]);
    };

    InnerPropertiesPanel.prototype.stepOut = function () {
        var modelLayoutManager = this.options.modelEditor.getModelLayoutManager();
        var editorInput = this.options.modelEditor.getEditorInput();
        var navigator = this.options.modelEditor.getToolbar().navigator;
        var path = navigator.getPath();
        var beforePath = (path.length === 1)? {mid:editorInput.getFileId()} : path[path.length -2];

        modelLayoutManager.openActivity(beforePath.mid, beforePath.fnUnit);
    };

    InnerPropertiesPanel.prototype.setType = function (type) {
        this.$mainControl.find('.brtc-va-editors-sheet-controls-property-step-control').addClass(type);
    };

    InnerPropertiesPanel.prototype.setHeight = function (height) {
        this.$contentsArea.height(height);
    };

    Brightics.VA.Core.Editors.Sheet.Panels.InnerPropertiesPanel = InnerPropertiesPanel;

}).call(this);