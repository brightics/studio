/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ExpressionBoat($parent, options) {
        Brightics.VA.Core.Editors.Diagram.Boat.call(this, $parent, options);
    }

    ExpressionBoat.prototype = Object.create(Brightics.VA.Core.Editors.Diagram.Boat.prototype);
    ExpressionBoat.prototype.constructor = ExpressionBoat;

    ExpressionBoat.prototype.createContents = function () {
        var $container = $('<div class="brtc-va-dialogs-index-item-container"></div>');
        this.$boat.append($container);

        //data proxy가 optional 하도록..
        var mid = this.options.editor.getModel().mid;
        var propDataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy($container, mid);

        this.innerPropertiesPanel = this.options.editor.getPanelFactory().createPropertiesPanel($container, {
            width: '100%',
            height: '100%',
            fnUnit: this.options.editor.getActiveFnUnit(),
            dataProxy: propDataProxy,
            blockCommandListener: true
        });

        this.innerPropertiesPanel.setHeight(300);
        this.innerPropertiesPanel.setType('inner');
        this.innerPropertiesPanel.hideTopArea();
        this.innerPropertiesPanel.hideBottomArea();
        this.innerPropertiesPanel.hideInTableControl();

        //propertiespanel에 넣기 애매한 것들..
        this.innerPropertiesPanel.$mainControl.find('.brtc-va-editors-sheet-controls-propertycontrol-columnlist').hide();
        $container.find('.brtc-va-progress').hide();

        // this.$boat.perfectScrollbar();
        this.configureStyle();
    };

    ExpressionBoat.prototype.configureStyle = function () {
        this.$boat
            .addClass('brtc-style-height-400px')
            .addClass('brtc-style-border-top-grey')
            .addClass('brtc-style-background-white');
    };

    ExpressionBoat.prototype.getTitle = function () {
        return 'Expression';
    };

    ExpressionBoat.prototype.setPosition = function () {
        this.$boatArea.css('right', '300px');
    };

    Brightics.VA.Core.Editors.Diagram.ExpressionBoat = ExpressionBoat;

}).call(this);