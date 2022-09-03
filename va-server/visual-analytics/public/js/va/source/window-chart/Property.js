/**
 * Created by sds on 2017-07-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Property(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.retrieveParent();

        this._init();
        this.createLayout();
        this.createControls();
    };

    Property.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Property.prototype._init = function () {
        this.options.propOpt = {
            error: []
        };
    };

    Property.prototype._getPropertyType = function () {
    };

    Property.prototype.createLayout = function () {
        this.$mainControl = $('' +
            '<div class="brtc-mc-property" type="' + this._getPropertyType() + '">' +
            '   <div class="brtc-mc-title"></div>' +
            '   <div class="brtc-mc-container"></div>' +
            '</div>');
        this.$parent.append(this.$mainControl);
    };

    Property.prototype.createControls = function () {
        this.createHeader();
        this.createBody(this.$mainControl.find('.brtc-mc-container'));
    };

    Property.prototype.createHeader = function () {
        this.$mainControl.find('.brtc-mc-title').text(this.getTitle());
    };

    Property.prototype.getTitle = function () {
    };

    Property.prototype.createBody = function ($container) {
    };

    Property.prototype.getPropertyOption = function () {
        return this.options.propOpt;
    };

    root.Brightics.VA.Window.Property = Property;

}).call(this);