/**
 * Created by jmk09.jung on 2016-01-26.
 */
(function () {
    'use strict';

    var root = this;

    var Brightics = root.Brightics;

    function FnUnitNavigator(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    FnUnitNavigator.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    FnUnitNavigator.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-editors-sheet-fnunitnavigator"></div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.createLayout();
        this.createNavigator();
    };

    FnUnitNavigator.prototype.createLayout = function () {
        var $newNavigator = $('<div class="brtc-va-editors-sheet-fnunitnavigator-navigator"></div>');
        this.$mainControl.append($newNavigator);

        var $newMode = $('<div class="brtc-va-editors-sheet-fnunitnavigator-mode"></div>');
        this.$mainControl.append($newMode);

        this.$navigator = $newNavigator;
        this.$mode = $newMode;
    };

    FnUnitNavigator.prototype.createNavigator = function () {
        var fnUnitList = this.options.analyticsModel.getFnUnitListBySheetId(this.options.sheetId);
        for (var i in fnUnitList) {
            this.createNavigatorElement(this.$navigator, fnUnitList[i]);
        }

        this.$navigator.append('<div class="brtc-va-editors-sheet-fnunitnavigator-navigator-addfn"><i class="fa fa-plus-circle"></i></div>');
    };

    FnUnitNavigator.prototype.createNavigatorElement = function ($parent, fnUnit) {
        var clazz = fnUnit.parent().type;
        var category = 'brtc-va-fnunit-category-'+ Brightics.VA.Core.Utils.WidgetUtils.getFunctionLibrary(clazz, fnUnit.func).category;
        var _this = this;
        var $main = $('' +
            '<div class="brtc-va-editors-sheet-fnunitnavigator-navigator-main">' +
            '   <div class="brtc-va-editors-sheet-fnunitnavigator-navigator-element ' + category + '">' +
            '       <div class="brtc-va-editors-sheet-fnunitnavigator-navigator-element-title">' + Brightics.VA.Core.Utils.WidgetUtils.convertHTMLSpecialChar(fnUnit.display.label) + '</div>' +
            '   </div>' +
            '</div>');
        $main.attr('fnunitid', fnUnit.id);
        $parent.append($main);

        $main.on('click', function () {
            var fnUnitId = $(this).attr('fnunitid');
            _this.select(fnUnitId, true);
        });
    };

    FnUnitNavigator.prototype.select = function (fnUnitId, trigger) {
        this.$navigator.find('.brtc-va-editors-sheet-fnunitnavigator-navigator-element').removeClass('brtc-va-editors-sheet-fnunitnavigator-navigator-element-selected');

        var $choose = this.$navigator.children('.brtc-va-editors-sheet-fnunitnavigator-navigator-main[fnunitid="' + fnUnitId + '"]');
        $choose.children('.brtc-va-editors-sheet-fnunitnavigator-navigator-element').addClass('brtc-va-editors-sheet-fnunitnavigator-navigator-element-selected');

        var $addButton = this.$navigator.children('.brtc-va-editors-sheet-fnunitnavigator-navigator-addfn');
        $addButton.detach();
        $choose.after($addButton);

        if (trigger) {
            this.$parent.trigger('select', [{ fnUnitId: fnUnitId }]);
        }
    };

    FnUnitNavigator.prototype.setFocusElement = function (clazz) {
        var _this = this;
        var $target = $('.' + clazz);

        //1. addFn
        var $addFn = this.$navigator.find('.brtc-va-editors-sheet-fnunitnavigator-navigator-addfn');
        if ($addFn.length > 0) {
            $target.after($addFn);

        } else {
            $addFn = this.createAddFn();
            this.$navigator.append($addFn);
        }

        //2.color
        var navArr = $target.parent().children();
        for (var i = 0; i < navArr.length; i++) {
            $(navArr[i]).children().removeClass('brtc-va-editors-sheet-fnunitnavigator-navigator-element-selected');
        }

        $target.children().addClass('brtc-va-editors-sheet-fnunitnavigator-navigator-element-selected');
    };

    FnUnitNavigator.prototype.createAddFn = function () {
        //addFn
        var $addFn = $('' +
            '<div class="brtc-va-editors-sheet-fnunitnavigator-navigator-addfn">' +
            '   <i class="fa fa-plus-circle"></i>' +
            '</div>'
        );

        return $addFn;
    };

    FnUnitNavigator.prototype.createMode = function () {
        //test
        var source = [
            '2',
            '3'
        ];
        // Create a jqxDropDownList
        $(this.$mode).jqxDropDownList({
            source: source,
            theme: 'office',
            autoOpen: false,
            itemHeight: 30,
            width: '48px',
            height: '90%',
            selectedIndex: 1,
            autoDropDownHeight: true
        });
    };

    Brightics.VA.Core.Editors.Sheet.FnUnitNavigator = FnUnitNavigator;

}).call(this);
