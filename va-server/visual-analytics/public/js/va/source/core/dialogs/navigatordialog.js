/* -----------------------------------------------------
 *  navigatordialog.js
 *  Created by hyunseok.oh@samsung.com on 2018-05-23.
 * ---------------------------------------------------- */

(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function NavigatorDialog(parentId, options) {
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);

        this.addListener();
    }

    NavigatorDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    NavigatorDialog.prototype.constructor = NavigatorDialog;

    NavigatorDialog.prototype.addListener = function () {
        var _this = this;
        this.activeModelChangeListener = function () {
            _this.options.getNavigatorData();
            _this.refresh();
        };

        this.options.editor.addActiveModelChangeListener(this.activeModelChangeListener);
    };

    NavigatorDialog.prototype.removeListener = function () {
        this.options.editor.removeActiveModelChangeListener(this.activeModelChangeListener);
    };

    NavigatorDialog.prototype.getTitle = function () {
        return 'Navigator';
    };

    NavigatorDialog.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-main-navigator">' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents" style="padding-right: 20px;padding-left: 20px;">' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '       </div>' +
            '   </div>' +
            '</div>');

        var opts = this._configureDialogOption({
            theme: Brightics.VA.Env.Theme,
            title: this.getTitle(),
            position: {
                my: "left top",
                at: "left bottom",
                of: this.$parent.find('.brtc-va-editors-modelinfo-toolbar-dotdotdot')
            },
            width: 400,
            height: 600,
            maxWidth: 400,
            maxHeight: 600,
            modal: false,
            resizable: false,
        });
        this.$mainControl.dialog(opts);
        this.$mainControl.parent().draggable("option", "containment", this.$parent);
        $('.ui-dialog-titlebar.ui-widget-header', $(this).parent()).css('width', 'calc(100% - 60px) !important');
    };

    NavigatorDialog.prototype.createDialogContentsArea = function ($parent) {
        var $container = $('<div class="brtc-va-dialogs-navigator-item-container"></div>');
        $parent.append($container);

        this.refresh();
        $parent.perfectScrollbar();
    };

    NavigatorDialog.prototype.createNavigatorItems = function ($container) {
        var _this = this;
        this.fnUnits = {};
        var data = this.options.getNavigatorData();
        if (data.length === 0) {
            this.close();
        }
        $container.empty();
        $container.append(data.map(function (el) {
            var fn = el.fnUnit;
            var fid = fn.fid;
            _this.fnUnits[fid] = el.fnUnit;
            var mid = el.mid;
            var clazz = 'data';
            var funcDef = Brightics.VA.Core.Interface.Functions[clazz][fn.func];

            var $item = $('' +
                '<div class="brtc-va-dialogs-index-item">' +
                '   <div class="brtc-va-dialogs-index-item-label"></div>' +
                '   <div class="brtc-va-dialogs-index-item-func"></div>' +
                '</div>');
            $item.attr('fid', fid);
            $item.attr('mid', mid);
            $item.addClass('brtc-va-fnunit-category-' + funcDef.category);
            $item.find('.brtc-va-dialogs-index-item-label').attr('title', fn.display.label);
            $item.find('.brtc-va-dialogs-index-item-label').text(fn.display.label);
            $item.find('.brtc-va-dialogs-index-item-func').text(funcDef.defaultFnUnit.display.label);
            return $item;
        }));

        $container.find('.brtc-va-dialogs-index-item').click(function () {
            /* eslint-disable no-invalid-this */
            var fid = $(this).attr('fid');
            var mid = $(this).attr('mid');
            var fnUnit = _this.fnUnits[fid];
            _this.options.navigate(mid, fnUnit);
            /* eslint-enable no-invalid-this */
        });
    };

    NavigatorDialog.prototype.createDialogButtonBar = function ($parent) {
        // do no create buttons
    };

    NavigatorDialog.prototype.destroy = function () {
        this.removeListener();

        Brightics.VA.Dialogs.Dialog.prototype.destroy.call(this);
    };

    NavigatorDialog.prototype.refresh = function () {
        var $container = this.$mainControl.find('.brtc-va-dialogs-navigator-item-container');
        $container.empty();
        this.createNavigatorItems($container);
        if (this.$mainControl) {
            var $contents = this.$mainControl.find('brtc-va-dialogs-contents');
            $contents.perfectScrollbar('update');
        }
    };

    Brightics.VA.Core.Dialogs.NavigatorDialog = NavigatorDialog;

}).call(this);