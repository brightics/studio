/**
 * Created by sds on 2018-10-26.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    /**************************************************************************
     *                                 FnUnit
     *************************************************************************/
    Brightics.VA.Core.Functions.Library.DialogPanelProperties = {};

}).call(this);
/**************************************************************************
 *                           Properties Panel
 *************************************************************************/
/**
 * Created by sds on 2018-02-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Panels.PropertiesPanel.prototype;

    /**
     * @extends PropertiesPanel
     * @param parentId
     * @param options
     * @constructor
     */
    function DialogPanelProperties(parentId, options) {
        _super.constructor.call(this, parentId, options);
    }

    DialogPanelProperties.prototype = Object.create(_super);
    DialogPanelProperties.prototype.constructor = DialogPanelProperties;

    DialogPanelProperties.prototype.createControls = function () {
        this.columnControlList = [];
        this.problemFactory = new Brightics.VA.Core.Validator.ProblemFactory();

        this.$mainControl = $('<div class="brtc-va-editors-sheet-panels-basepanel"/>');
        this.$parent.append(this.$mainControl);

        this.createContentsArea();

        this.$mainControl.addClass('dialog-properties');
        this.$contentsArea.addClass('dialog-properties');
    };

    DialogPanelProperties.prototype.createContentsAreaControls = function ($parent) {
    };

    DialogPanelProperties.prototype.fillControlValues = function () {
        this.options.fillControlValues();
    };

    DialogPanelProperties.prototype.getColumnData = function (controls) {
        return this.columnData;
    };

    DialogPanelProperties.prototype.registerColumnControl = function (controls) {
        this.columnControlList.push(controls);
    };

    DialogPanelProperties.prototype.renderValues = function () {
        this.options.renderValues();
    };

    DialogPanelProperties.prototype._initializePerfectScroll = function () {
        this.$contentsArea.perfectScrollbar();
    };

    DialogPanelProperties.prototype._updatePerfectScroll = function () {
        this.$contentsArea.perfectScrollbar('update');
    };

    DialogPanelProperties.prototype.renderProperties = function () {
    };



    DialogPanelProperties.prototype._renderDefaultControl = function (paramNm) {
        var _this = this;
        var controlSpec = this.options.controlSpec[paramNm];
        if (controlSpec && controlSpec.params) {
            controlSpec.params.forEach(function (propSpecObj) {
                _this._renderOptControl(_this.controls[paramNm][propSpecObj.attr]);
            });
        }
    };


    DialogPanelProperties.prototype._renderObjectArrayControl = function (paramNm) {
        var _this = this;
        var controlSpec = this.options.controlSpec[paramNm];
        if (controlSpec && controlSpec.params) {
            _this._renderOptControl(_this.controls[paramNm]);
        }
    };

    DialogPanelProperties.prototype._renderOptControl = function (target) {
        if (target) {
            target.renderControl();
        }
    };


    DialogPanelProperties.prototype.getParams = function () {
        var resultParam = {};

    };



    Brightics.VA.Core.Functions.Library.DialogPanelProperties.propertiesPanel = DialogPanelProperties;

}).call(this);
/**************************************************************************
 *                               Validator
 *************************************************************************/
/**
 * Created by sds on 2018-02-20.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function DialogPanelValidator() {
        Brightics.VA.Core.Validator.SingleInputValidator.call(this);
    }

    DialogPanelValidator.prototype = Object.create(Brightics.VA.Core.Validator.SingleInputValidator.prototype);
    DialogPanelValidator.prototype.constructor = DialogPanelValidator;

    Brightics.VA.Core.Functions.Library.DialogPanelProperties.validator = DialogPanelValidator;

}).call(this);