/**
 * Created by sds on 2017-07-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SideBarManager(editor) {
        this.editor = editor;

        this.retrieveParent();
        this.init();
        this.createSideBarArea();
        this.createControls();
    }

    SideBarManager.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.editor.getMainArea());
    };

    SideBarManager.prototype.init = function () {
        this.configureLayout();
        this.attachTabBarWrapperToLayout();
        this.sideBar = {};
    };

    SideBarManager.prototype.configureLayout = function () {
    };

    SideBarManager.prototype.attachTabBarWrapperToLayout = function (params) {
        var _this = this;
        this.$leftTabBarWrapper = this.editor.getLeftTabBarArea();
        this.$rightTabBarWrapper = this.editor.getRightTabBarArea();
        _.forIn(this.layout, function (lo) {
            _.assign(lo, {
                $tabBarWrapper: lo.position == 'left' ?
                    _this.$leftTabBarWrapper : _this.$rightTabBarWrapper
            });
        });
    };

    SideBarManager.prototype.createSideBarArea = function () {
        for (var sideBar in this.layout) {
            var $sideBar = $('' +
                '<div class="brtc-va-studio-sidebar" name="' + sideBar + '">' +
                '   <div class="brtc-va-studio-sidebar-area" name="' + sideBar + '" style="display: none"></div>' +
                '</div>');
            $sideBar.find('.brtc-va-studio-sidebar-area').addClass(this.layout[sideBar].position);

            this.$parent.append($sideBar);
        }
    };

    SideBarManager.prototype.createControls = function () {
    };

    SideBarManager.prototype.expandStatusChange = function (sideBarName, isShow) {
        if (isShow) {
            this.sideBar[sideBarName].show();
        } else {
            this.sideBar[sideBarName].hide();
        }

        var showSideBar = this.sideBar[sideBarName];
        var position = showSideBar.getLayout().position;
        _.forIn(this.sideBar, function (sb) {
            if (sb.getLayout().position === position && sb !== showSideBar) {
                sb.hide();
            }
        });
        showSideBar.show();

        this.fireExpandStatusChanged();
    };

    SideBarManager.prototype.fireExpandStatusChanged = function (sideBarName, isShow) {
        if (isShow) {
            // sidebar를 open할 때 다른 sidebar는 close하는 로직
            for (var key in this.sideBar) {
                var target = this.sideBar[key];
                var isVisible = target.options.visible;
                var isSamePosition = false;
                if (this.sideBar[sideBarName]) {
                    isSamePosition = (this.sideBar[sideBarName].options.position === target.options.position)
                }
                if (key !== sideBarName && isVisible && isSamePosition) {
                    target.hide();
                }
            }
        }
        this.editor.getModelLayoutManager().handleExpandStatusChanged();
    };

    SideBarManager.prototype.onActivated = function () {
        if (this.sideBar) {
            _.forIn(this.sideBar, function (sb) {
                if (sb.onActivated && typeof sb.onActivated === 'function') {
                    sb.onActivated();
                }
            });
        }
    };

    SideBarManager.prototype.onFnUnitSelect = function (fnUnit) {
        if (this.sideBar) {
            _.forIn(this.sideBar, function (sb) {
                sb.onFnUnitSelect(fnUnit);
            });
        }
    };

    SideBarManager.prototype.onModelChange = function (command) {
        if (this.sideBar) {
            _.forIn(this.sideBar, function (sb) {
                sb.onModelChange(command);
            });
        }
    };

    SideBarManager.prototype.destroy = function () {
        if (this.sideBar) {
            _.forIn(this.sideBar, function (sb) {
                sb.destroy();
            });
        }
    };

    SideBarManager.prototype.openAll = function () {
        if (this.sideBar) {
            for (var key in this.sideBar) {
                this.expandStatusChange(key, true);
                this.sideBar[key].onModelChange();
            }
        }
    };

    SideBarManager.prototype.closeAll = function () {
        if (this.sideBar) {
            for (var key in this.sideBar) {
                this.expandStatusChange(key, false);
                this.sideBar[key].onModelChange();
            }
        }
    };

    SideBarManager.prototype.getSideBars = function () {
        return this.sideBar;
    };

    SideBarManager.prototype.getEditor = function () {
        return this.editor;
    };

    SideBarManager.prototype.getLeftSideBarWidth = function () {
        for (var key in this.sideBar) {
            var sidebar = this.sideBar[key];
            var options = sidebar.options;
            if (options.visible === true && options.position === 'left') {                
                if (sidebar.parentId.find('.brtc-va-studio-sidebar-area')) {
                    return sidebar.parentId.find('.brtc-va-studio-sidebar-area').width();
                }
                return options.width;
            }
        }

        return this.editor.getLeftTabBarArea().height();
        // return 0;
    };

    SideBarManager.prototype.getRightSideBarWidth = function () {
        for (var key in this.sideBar) {
            var sidebar = this.sideBar[key];
            var options = sidebar.options;
            if (options.visible === true && options.position === 'right') {           
                if (sidebar.parentId.find('.brtc-va-studio-sidebar-area')) {
                    return sidebar.parentId.find('.brtc-va-studio-sidebar-area').width();
                }
                return options.width;
            }
        }

        return this.editor.getRightTabBarArea().height();
        // return 0;
    };

    SideBarManager.prototype.isOpen = function (position) {
        for (var key in this.sideBar) {
            var options = this.sideBar[key].options;
            if (options.visible === true && options.position == position) return true;
        }

        return false;
    };

    SideBarManager.prototype.refresh = function () {
    };

    SideBarManager.prototype.updateStatus = function () {
    };

    Brightics.VA.Core.Tools.Manager.SideBarManager = SideBarManager;
}).call(this);
