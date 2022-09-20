(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    var CONST = {};
    CONST.MSG_PANEL_EMPTY = 'Select configuration element in the tree to edit its settings';
    CONST.MSG_MENU_EMPTY = 'Nothing to show';

    const settingKeyList = Object.keys(Brightics.VA.Setting.Registry);

    function SettingDialog(parentId, options) {
        Brightics.VA.SettingStorage.TEMP = {};
        this.settingPanelList = [];
        Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
    }

    SettingDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
    SettingDialog.prototype.constructor = SettingDialog;

    SettingDialog.prototype._initOptions = function () {
        Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

        this.dialogOptions.width = 780;
        this.dialogOptions.height = 500;
    };

    SettingDialog.prototype.createDialogContentsArea = function ($parent) {
        $parent.addClass('setting');
        var $content = $('' +
            '<div class="brtc-va-dialogs-menu setting"/>' +
            '<div class="brtc-va-dialogs-content setting"/>'
        );
        $parent.append($content);

        this.createSplitter($parent);
        this.createMenuArea($parent.find('.brtc-va-dialogs-menu'));
        this.createContentArea($parent.find('.brtc-va-dialogs-content'));
    };

    SettingDialog.prototype.createSplitter = function ($parent) {
        $parent.jqxSplitter({
            width: null,
            height: null,
            resizable: false,
            splitBarSize: 3,
            panels: [{size: 200, min: 200}, {min: 300}]
        });
    };

    SettingDialog.prototype.createMenuArea = function ($parent) {
        var $menuContents = $('' +
            '<div class ="brtc-va-dialogs-menu-filter"/>' +
            '<div class ="brtc-va-dialogs-menu-tree"/>'
        );
        $parent.append($menuContents);
        this.createFilterControl($parent.find('.brtc-va-dialogs-menu-filter'));
        this.createTreeControl($parent.find('.brtc-va-dialogs-menu-tree'));

    };

    SettingDialog.prototype.createTreeControl = function ($treeContents) {
        var _this = this;
        var hasRegistry = this._generateJSONObject();

        if (hasRegistry && hasRegistry.length > 0) {
            hasRegistry[0].selected = true;
            $treeContents.removeClass('brtc-va-dialogs-center');
            this.settingMenu = $treeContents.jqxTree({
                theme: Brightics.VA.Env.Theme,
                width: 200,
                source: hasRegistry
            });
        } else {
            // $treeContents.jqxTree('clear');
            this.settingMenu = null;
            $treeContents.addClass('brtc-va-dialogs-center');
            $treeContents.jqxTree({
                theme: Brightics.VA.Env.Theme,
                source: [{
                    label: CONST.MSG_MENU_EMPTY,
                    disabled: true
                }]
            })
        }
    };

    SettingDialog.prototype.createFilterControl = function ($parent) {
        var _this = this;

        var $filterInput = $('<input type="search" class="brtc-va-views-palette-filter-input searchinput"/>');
        $parent.append($filterInput);

        $filterInput.jqxInput({
            height: 29,
            theme: Brightics.VA.Env.Theme,
            placeHolder: 'Search Item'
        });
        var applyFilter = function (event) {
            var filterValue = event.target.value.toLowerCase();

            _this.filterArray = _this.getMatchedList(filterValue.trim());
            _this.filterSelectItem = true;


            _this.createTreeControl(_this.$mainControl.find('.brtc-va-dialogs-menu-tree'));
            if (_this.settingMenu) {
                //initialize selected item in tree
                _this.settingMenu.jqxTree('selectItem', null);
            }
            _this.createContentArea(_this.$mainControl.find('.brtc-va-dialogs-content'));

            //TODO: update scrollbar
            // _this.$mainControl.find('. {class_name}').perfectScrollbar('update');
        };
        $filterInput.keyup(function (event) {
            applyFilter(event);
        });

        $filterInput.on('search', function (event) {
            applyFilter(event);
        });
    };

    SettingDialog.prototype.getMatchedList = function (searchStr) {
        if (searchStr) {
            return $.grep(settingKeyList, function (settingObjKey) {
                return Brightics.VA.Setting.Registry[settingObjKey].Label.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
            });
        } else {
            return null;
        }
    };

    SettingDialog.prototype._generateJSONObject = function (parentKey) {
        var _this = this;

        var contentsHTML = [], labelExists = false;
        var currentKeyList = settingKeyList.filter(function (optionKey) {
            if (parentKey) {
                return optionKey.startsWith(parentKey + Brightics.VA.Setting.CONST.KEY_DELIMITER)
                    && !(optionKey.replace(parentKey + '.', '').includes('.')); //filter 1 depth child
            } else {
                return !optionKey.includes(Brightics.VA.Setting.CONST.KEY_DELIMITER);
            }
        });
        if (currentKeyList.length > 0) {
            var tempObj = {};
            currentKeyList.forEach(function (settingObj) {
                var optionList = Brightics.VA.Setting.Registry;
                var settingLabel = optionList[settingObj].Label;
                var settingKey = optionList[settingObj].Key;

                if (settingLabel && settingKey) {
                    tempObj = {
                        id: settingKey,
                        label: settingLabel,
                        items: _this._generateJSONObject(settingKey)
                    };
                    if (_this.filterArray) {
                        if (($.inArray(settingKey, _this.filterArray) > -1) || tempObj.items.length > 0) {
                            if (_this.filterSelectItem) {
                                tempObj.selected = true;
                                _this.filterSelectItem = false;
                            }
                            tempObj.expanded = true;
                            contentsHTML.push(tempObj);
                        }
                    } else {
                        contentsHTML.push(tempObj);
                    }
                }
            });
        }
        return contentsHTML;
    };


    SettingDialog.prototype.createContentArea = function ($parent) {
        var $contentsWrapper = $('' +
            '<div class = "brtc-va-dialogs-content-info setting"></div>' +
            '<div class = "brtc-va-dialogs-content-panel setting"></div>'
        );

        var _emptyContentArea = function () {
            $parent.addClass('brtc-va-dialogs-center');
            $parent.text(CONST.MSG_PANEL_EMPTY);
            $contentsWrapper.remove();
        };
        var _appendContentArea = function () {
            $parent.removeClass('brtc-va-dialogs-center');
            $parent.text('');
            $parent.append($contentsWrapper);
        };

        if (this.settingMenu) {
            var _this = this;
            var item = _this.settingMenu.jqxTree('getSelectedItem');
            if (!item) {
                _emptyContentArea();
            } else {
                _appendContentArea();
                _this._attachSettingPanel($parent, item);
            }

            this.settingMenu.on('select', function (event) {
                if (_this.settingMenu) {
                    if ($parent.text().length > 0) {
                        _appendContentArea();
                    }
                    var args = event.args;
                    var item = _this.settingMenu.jqxTree('getItem', args.element);
                    _this._attachSettingPanel($parent, item);
                }
            });
        } else {
            _emptyContentArea();
        }
    };

    SettingDialog.prototype._attachSettingPanel = function ($parent, selectedItem) {
        var findSettingInstance = this._getTreeParent(selectedItem, Brightics.VA.Setting.Registry);
        $parent.find('.brtc-va-dialogs-content-info').text(findSettingInstance.label);

        var $contentsPanel = $parent.find('.brtc-va-dialogs-content-panel');
        $contentsPanel.empty();

        var settingPanel = new Brightics.VA.Setting.Registry[selectedItem.id]($contentsPanel);
        $contentsPanel.perfectScrollbar();
        this.settingPanelList.push(settingPanel);
    };

    SettingDialog.prototype._getTreeParent = function (item, ref) {
        var resultStr = {label: item.label, objStr: item.id};
        var _this = this;
        if (item.parentElement) {
            var parentObj = _this._getTreeParent(_this.settingMenu.jqxTree('getItem', item.parentElement));
            resultStr.label = parentObj.label + ' > ' + resultStr.label;
        }
        return resultStr;
    };

    SettingDialog.prototype.handleOkClicked = function () {
        for (var i in this.settingPanelList) {
            this.settingPanelList[i].save();
        }
        Studio.getPreference().preferenceChanged(Object.keys(Brightics.VA.SettingStorage.TEMP || {}));
        Brightics.VA.Dialogs.Dialog.prototype.handleOkClicked.call(this);

        const settingLocale = Brightics.VA.SettingStorage.TEMP.tmpLocale === '한국어' ? 'ko' : 'en';
        const currentLang = Brightics.VA.SettingStorage.getCurrentLanguage();

        const closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                $(window).unbind('beforeunload');
                Brightics.VA.SettingStorage.setLanguage(settingLocale);
                window.location.href = window.location.href;
            }
        };
        if(settingLocale !== currentLang) {
            Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(Brightics.locale.sentence.S0006, closeHandler);
        }
    };

    SettingDialog.prototype.destroy = function () {
        this.$mainControl.find('.brtc-va-dialogs-menu-tree').jqxTree('destroy');
        this.$mainControl.dialog('destroy');
        this.$mainControl = undefined;
    };

    Brightics.VA.Core.Dialogs.SettingDialog = SettingDialog;

}).call(this);