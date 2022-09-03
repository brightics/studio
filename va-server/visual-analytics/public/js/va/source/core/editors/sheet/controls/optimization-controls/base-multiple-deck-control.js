/**
 * Created by sds on 2018-03-08.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var _super = Brightics.VA.Core.Editors.Sheet.Controls.Optimization.Base.prototype;
    const METHOD_CONTROL_KEY = 'method',
        SCALING_CONTROL_KEY = 'scaling',
        PARAM_SCALE_TYPE = 'scale-type',
        PARAM_SCALE = 'scale';

    function BaseMultipleDeckControl(caller, options) {
        _super.constructor.call(this, caller, options);
    }

    BaseMultipleDeckControl.prototype = Object.create(_super);
    BaseMultipleDeckControl.prototype.constructor = BaseMultipleDeckControl;

    BaseMultipleDeckControl.prototype.createDeleteButton = function ($deckControl) {
        var $removeButton = $('<div class ="brtc-va-editors-sheet-controls-propertycontrol-deck-remove"></div>');
        $deckControl.append($removeButton);

        var _this = this;
        $removeButton.click(function (event) {
            event.stopPropagation();
            var deleteIdx = $deckControl.index();
            _this.controls[_this.CONTROL_KEY].splice(deleteIdx, 1);
            $deckControl.remove();
            if (_this.options.multiple || (!_this.options.multiple && _this.controls[_this.CONTROL_KEY].length == 0)) {
                _this.$addButton.appendTo(_this.$controlContainer);
            }
            _this.updateSectionScroll();
        });
    };

    BaseMultipleDeckControl.prototype.renderControl = function () {
        var _this = this;
        if (!this.options.value) {
            return;
        }
        var paramSpecList = this.options.params;
        var controlValue = this.options.value.slice();
        this.$addButton.detach();
        if (!this.options.multiple) {
            controlValue = controlValue.splice(0, 1);
        }
        for (var controlIdx = 0; controlIdx < controlValue.length; controlIdx++) {
            this.createDeck();
            paramSpecList.forEach(function (paramObj) {
                if (_this.controls[_this.CONTROL_KEY][controlIdx][paramObj.attr]) {
                    _this.controls[_this.CONTROL_KEY][controlIdx][paramObj.attr].setValue(controlValue[controlIdx][paramObj.attr]);
                }
            });
        }
        if (this.options.multiple || (!this.options.multiple && this.controls[this.CONTROL_KEY].length == 0)) {
            this.$addButton.appendTo(this.$controlContainer);
        }
    };

    BaseMultipleDeckControl.prototype.createAddButton = function () {
        var _this = this;
        this.$addButton = $('<input type="button" class= "brtc-va-editors-sheet-controls-propertycontrol-addbutton" />');
        this.$addButton.val('+ Add ' + this.getLabel());
        this.$controlContainer.append(this.$addButton);
        this.$addButton.jqxButton({
            theme: Brightics.VA.Env.Theme,
            width: '100%',
            height: 25
        });

        this.$addButton.click(function () {
            $(this).detach();
            _this.createDeck();
            _this.updateSectionScroll();
            if (_this.options.multiple) {
                $(this).appendTo(_this.$controlContainer);
            }
        });
    };


    BaseMultipleDeckControl.prototype.getValue = function () {
        var result = [];
        var _this = this;
        var paramSpecList = this.options.params;
        for (var controlIdx = 0; controlIdx < this.controls[this.CONTROL_KEY].length; controlIdx++) {
            result[controlIdx] = {};
            paramSpecList.forEach(function (paramObj) {
                if (_this.controls[_this.CONTROL_KEY][controlIdx][paramObj.attr]) {
                    result[controlIdx][paramObj.attr] = _this.controls[_this.CONTROL_KEY][controlIdx][paramObj.attr].getValue();
                }
            });
        }
        return result;
    };

    BaseMultipleDeckControl.prototype.configureScalingControls = function () {
        var scalingVal = this.getScalingValue();

        if (scalingVal) {
            var $parentDeck;
            for (let controlIndex = 0; controlIndex < this.controls[this.CONTROL_KEY].length; controlIndex++) {
                $parentDeck = $(this.$controlContainer.find('.method')[controlIndex]);
                this._createDeckDetailControls($parentDeck, PARAM_SCALE_TYPE, controlIndex);
                this._createDeckDetailControls($parentDeck, PARAM_SCALE, controlIndex);
            }
        } else {
            for (let controlIndex = 0; controlIndex < this.controls[this.CONTROL_KEY].length; controlIndex++) {
                if(this.$deckElem[controlIndex][PARAM_SCALE_TYPE] && this.$deckElem[controlIndex][PARAM_SCALE]){
                    this.$deckElem[controlIndex][PARAM_SCALE_TYPE].remove();
                    delete this.controls[this.CONTROL_KEY][controlIndex][PARAM_SCALE_TYPE];
                    this.$deckElem[controlIndex][PARAM_SCALE].remove();
                    delete this.controls[this.CONTROL_KEY][controlIndex][PARAM_SCALE];
                }
            }
        }
        this.updateSectionScroll();
    };

    //constraints, objectives control에서 사용함.
    BaseMultipleDeckControl.prototype.getScalingValue = function () {
        if (this.caller.controls[METHOD_CONTROL_KEY][SCALING_CONTROL_KEY]) {
            var controlVal = this.caller.controls[METHOD_CONTROL_KEY][SCALING_CONTROL_KEY].getValue();
            return controlVal && controlVal[SCALING_CONTROL_KEY] == 'true'
        } else {
            return false;
        }
    };

    BaseMultipleDeckControl.prototype.updateSectionScroll = function () {
    };

    BaseMultipleDeckControl.prototype.getLabel = function () {
    };


    Brightics.VA.Core.Editors.Sheet.Controls.Optimization.BaseMultipleDeck = BaseMultipleDeckControl;

}).call(this);