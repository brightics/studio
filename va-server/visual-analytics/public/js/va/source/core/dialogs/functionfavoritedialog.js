(function () {
  'use strict';

  var root = this;
  var Brightics = root.Brightics;
  var Utils = Brightics.VA.Core.Utils;

  function FunctionFavoriteDialog(parentId, options) {
    Brightics.VA.Dialogs.Dialog.call(this, parentId, options);
  }

  FunctionFavoriteDialog.prototype = Object.create(Brightics.VA.Dialogs.Dialog.prototype);
  FunctionFavoriteDialog.prototype.constructor = FunctionFavoriteDialog;

  FunctionFavoriteDialog.prototype._initOptions = function () {
    Brightics.VA.Dialogs.Dialog.prototype._initOptions.call(this);

    this.dialogOptions.width = 760;
    this.dialogOptions.height = 840;
  };

  FunctionFavoriteDialog.prototype.createDialogContentsArea = function ($parent) {
    $parent.addClass('brtc-va-dialogs-FunctionFavoriteDialog-contents');

    $parent.append('' +
      '<div class="brtc-va-views-palette brtc-va-tab-contents brtc-style-tab-content">' +
      '   <div class="brtc-va-views-palette-filter brtc-va-searcharea brtc-style-search-area"></div>' +
      '   <div class="brtc-va-views-palette-navigator-wrapper  brtc-va-contentsarea">' +
      '       <div class="brtc-va-views-palette-navigator" id="functionfavoritedialog-navigator"></div>' +
      '   </div>' +
      '</div>');
      this.$filter = this.$parent.find('.brtc-va-views-palette-filter');
      this.$navigator = this.$parent.find('#functionfavoritedialog-navigator');
      this.createNavigatorControl();
      this.$parent.find('.brtc-va-views-palette').perfectScrollbar();
  };

  FunctionFavoriteDialog.prototype.createNavigatorControl = function () {
    var data = JSON.parse(JSON.stringify(this.options.paletteData));
    if (this.options.additionalGroup) data.push(this.options.additionalGroup);
    data = this.createFunctions(data);
    this.setupNavigator(data);
  };

  FunctionFavoriteDialog.prototype.setupJqxNavigation = function (data) {
    var opt = {
      theme: Brightics.VA.Env.Theme,
      expandMode: 'multiple',
      expandedIndexes: [],
      width: '100%'
    };
    for (var idx in data) {
      opt.expandedIndexes.push(parseInt(idx, 10));
    }
    this.$navigator.jqxNavigationBar(opt);
  };

  FunctionFavoriteDialog.prototype.setupNavigator = function (data) {
      this.setupJqxNavigation(data);

      this.$navigator.on('collapsedItem', function (_event) {
        this.$parent.find('.ps-container').perfectScrollbar('update');
      });
      this.$navigator.on('expandedItem', function (_event) {
        this.$parent.find('.ps-container').perfectScrollbar('update');
      });
      this.$parent.find('.brtc-va-views-palette').perfectScrollbar();
  };

  FunctionFavoriteDialog.prototype.createFunctions = function (funcGroupList) {
    var _this = this;
    var visibleFuncGroupList = [];

    $.each(funcGroupList, function (index, funcGroup) {
      if (funcGroup.visible) {
        _this.appendFunction(funcGroup);
        visibleFuncGroupList.push(funcGroup);
      }
    });
    return visibleFuncGroupList;
  };

  FunctionFavoriteDialog.prototype.appendFunction = function (funcGroup) {
    var _this = this;
    var $functionListControl = $('<div class = "brtc-va-views-palette-fnunit-list"></div>');
    var functions = funcGroup.functions;

    if (funcGroup.key === 'udf') {
      // this._appendUdfFunctions($functionListControl, functions);
    } else {
      $.each(functions, function (_index, funcItem) {
        if (funcItem.visible) {
          var clazz = _this.options.modelType;
          var $item;
          if (funcItem.deletable) {
            var closeCallBack = _this._deleteUdfCallBack.bind(_this, funcItem);
            $item = Utils.WidgetUtils.createPaletteUDFItem($functionListControl, funcItem.func, clazz, closeCallBack);
          } else {
            $item = Utils.WidgetUtils.createPaletteItem($functionListControl, funcItem.func, clazz);
          }

          $item.click(function () {
            if(_this.options.favorites.has(funcItem.func)) {
              _this.switchFunctionFavorite(funcItem.func, 'delete');
              _this.options.favorites.delete(funcItem.func);
            }
            else {
              _this.switchFunctionFavorite(funcItem.func, 'create');
              _this.options.favorites.add(funcItem.func);
            }
            $item.attr('type', _this.options.favorites.has(funcItem.func) ? 'on' : 'off');
          });
          $item.attr('type', _this.options.favorites.has(funcItem.func) ? 'on' : 'off');
        }
      });
    }

    var totalCount = $functionListControl.find('.brtc-va-views-palette-fnunit-content').length;
    var hiddenCount = $functionListControl.find('.brtc-va-views-palette-fnunit.brtc-va-fnunit-category-none').length;

    var $navBar = $('' +
      '<div>' +
      '   <div>' +
      '       <div class="brtc-va-views-palette-fnunit-type">' + Utils.WidgetUtils.convertHTMLSpecialChar(funcGroup.label) + '</div>' +
      '   </div>' +
      '</div>');
    if (funcGroup.key !== 'udf' &&
      totalCount === hiddenCount) {
      $navBar.addClass('brtc-va-palette-display-none');
      $functionListControl.addClass('brtc-va-palette-display-none');
    }

    // add header
    _this.$navigator.append($navBar);
    // add content
    _this.$navigator.append($functionListControl);
  };

  FunctionFavoriteDialog.prototype._appendUdfFunctions = function ($functionListControl, functions) {
    var _this = this;
    functions.forEach(function (funcItem, index) {
        if (funcItem.visible) {
            var clazz = _this.options.modelType;
            var closeCallBack = _this._deleteUdfCallBack.bind(_this, funcItem);
            if (funcItem.deletable)
                Utils.WidgetUtils.createPaletteUDFItem($functionListControl, funcItem.func, clazz, closeCallBack);
            else
                Utils.WidgetUtils.createPaletteItem($functionListControl, funcItem.func, clazz);
        }
    });
  };

  FunctionFavoriteDialog.prototype.switchFunctionFavorite = function (func, type) {
    var option = {
      url: `api/vastudio/v3/functions/favorite/${func}/${type}`,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      blocking: false
    };

    return new Promise(function (resolve, _reject) {
        $.ajax(option).done(function (data) {
        }).fail(function () {
            resolve([])
        });
    });
  };

  FunctionFavoriteDialog.prototype.createDialogButtonBar = function ($parent) {
    Brightics.VA.Dialogs.Dialog.prototype.createDialogButtonBar.call(this, $parent);
    this.$cancelButton.hide();
    this.$okButton.val('Close');
  };

  Brightics.VA.Core.Dialogs.FunctionFavoriteDialog = FunctionFavoriteDialog;

}).call(this);
