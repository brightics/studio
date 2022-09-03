/**
 * Created by jmk09.jung on 2016-01-26.
 */
(function () {
    'use strict';

    var root = this;

    var Brightics = root.Brightics;

    var FnUnitUtils = brtc_require('FnUnitUtils');

    const PANEL_TYPE_IN = 'in';
    const PANEL_TYPE_OUT = 'out';

    function FnUnitViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.retrieveParent();
        this.createControls();
    }

    FnUnitViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    FnUnitViewer.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-editors-sheet-fnunitviewer"></div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.createLayout();
    };

    FnUnitViewer.prototype.createLayout = function () {
        this.$mainControl.append('' +
            '<div class="brtc-va-editors-sheet-fnunitviewer-panel brtc-va-editors-sheet-fnunitviewer-flex-width brtc-va-editors-sheet-fnunitviewer-indata-fncenter" datapaneltype="in"></div>' +
            '<div class="brtc-va-editors-sheet-fnunitviewer-panel brtc-va-editors-sheet-fnunitviewer-fixed-width brtc-va-editors-sheet-fnunitviewer-fn-fncenter"></div>' +
            '<div class="brtc-va-editors-sheet-fnunitviewer-panel brtc-va-editors-sheet-fnunitviewer-flex-width brtc-va-editors-sheet-fnunitviewer-outdata-fncenter" datapaneltype="out"></div>' +
            '');
    };

    FnUnitViewer.prototype.destroy = function () {
        if (this.inPanel) {
            this.inPanel.destroy();
        }
        if (this.propertiesPanel) {
            this.propertiesPanel.destroy();
        }
        if (this.outPanel) {
            this.outPanel.destroy();
        }
        if (this.inViewerTab) {
            this.inViewerTab.destroy();
        }
        if (this.outViewerTab) {
            this.outViewerTab.destroy();
        }

        this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter').off('sizeChange');
        this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter').off('sizeChange');

        this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter').empty();
        this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-fn-fncenter').empty();
        this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter').empty();

        this._status = 'destroyed';
    };

    FnUnitViewer.prototype._alreadyRendered = function (fnUnit) {
        return (this.fnUnit && this.fnUnit.fid === fnUnit.fid && this._status === 'rendered');
    };

    FnUnitViewer.prototype.movePanel = function (index) {
        this.outViewerTab.select(index);
    };

    FnUnitViewer.prototype.getDataTypes = function (fnUnit, panelType) {
        return FnUnitUtils.getTypes(fnUnit, panelType);
    };

    FnUnitViewer.prototype.createOutPages = function (options) {
        var _this = this;

        var pages = [];
        var dataTypes = this.getDataTypes(options.fnUnit, PANEL_TYPE_OUT);
        dataTypes = _.isEmpty(dataTypes) ? ['table', 'model', 'image'] : dataTypes;

        for (var i in dataTypes) {
            var type = dataTypes[i];
            var page = {
                label: type,
                type: type,
                renderer: function ($page, type) {
                    $page.empty();
                    $page.attr('datapaneltype', 'out');
                    options.type = type;
                    options.panelType = 'out';
                    var panelControl = _this.options.panelFactory.create($page, options)
                    $page.data('panelControl_ref', panelControl);
                },
                destroy: function ($page) {
                    var panelControl = $page.data('panelControl_ref');
                    if (panelControl && typeof panelControl.destroy === 'function') {
                        panelControl.destroy();
                    }
                }
            };

            pages.push(page);
        }

        return pages;
    };

    FnUnitViewer.prototype.createInPages = function (options) {
        var _this = this;

        var pages = [];
        var dataTypes = this.getDataTypes(options.fnUnit, PANEL_TYPE_IN);
        dataTypes = _.isEmpty(dataTypes) ? ['table', 'model', 'image'] : dataTypes;

        for (var i in dataTypes) {
            var type = dataTypes[i];
            var page = {
                label: type,
                type: type,
                renderer: function ($page, type) {
                    $page.empty();
                    $page.attr('datapaneltype', 'in');
                    options.type = type;
                    options.panelType = 'in';
                    var panelControl = _this.options.panelFactory.create($page, options)
                    $page.data('panelControl_ref', panelControl);
                },
                destroy: function ($page) {
                    var panelControl = $page.data('panelControl_ref');
                    if (panelControl && typeof panelControl.destroy === 'function') {
                        panelControl.destroy();
                    }
                }
            };

            pages.push(page);
        }

        return pages;
    };

    FnUnitViewer.prototype.createInPanel = function ($parent, options) {
        var $in = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter');
        if (FnUnitUtils.hasInput(options.fnUnit)) {
            $parent.show();
            var pages = this.createInPages(options);

            options.pages = pages;

            this.inViewerTab = new Brightics.VA.Core.Tools.Tab($in, options);
        } else {
            if (FnUnitUtils.isBluffNode(options.fnUnit)) {
                $parent.show();
                this.inPanel = new Brightics.VA.Core.Editors.Sheet.Panels.BluffPanel($in, {label: 'No Inputs'});
            } else {
                $parent.hide();
            }
        }
    };

    FnUnitViewer.prototype.createOutPanel = function ($parent, options) {
        var $out = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');

        if (FnUnitUtils.hasOutput(options.fnUnit)) {
            $parent.show();
            var pages = this.createOutPages(options);

            options.pages = pages;

            this.outViewerTab = new Brightics.VA.Core.Tools.Tab($out, options);
        } else {
            if (FnUnitUtils.isBluffNode(options.fnUnit)) {
                $parent.show();
                this.outPanel = new Brightics.VA.Core.Editors.Sheet.Panels.BluffPanel($out, {label: 'No Outputs'});
            } else {
                $parent.hide();
            }
        }
    };

    FnUnitViewer.prototype.render = function (fnUnit) {
        if (this._alreadyRendered(fnUnit)) return;
        var _this = this;

        this.destroy();

        this.fnUnit = fnUnit;
        var mid = fnUnit.parent().mid;
        var $propContainer = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-fn-fncenter');
        var $inContainer = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter');
        var $outContainer = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');

        let propDataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy($propContainer, mid);
        let inDataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy($inContainer, mid);
        let outDataProxy = new Brightics.VA.Core.Editors.Sheet.DataProxy($outContainer, mid);

        propDataProxy.reset();
        inDataProxy.reset();
        outDataProxy.reset();

        this.propertiesPanel = this.options.panelFactory.createPropertiesPanel($propContainer, {
            width: '100%',
            height: '100%',
            fnUnit: fnUnit,
            dataProxy: propDataProxy
        });

        var inOptions = {
            width: '100%',
            height: '100%',
            fnUnit: fnUnit,
            resizable: true,
            dataProxy: inDataProxy
        };

        var outOptions = {
            width: '100%',
            height: '100%',
            fnUnit: fnUnit,
            resizable: true,
            dataProxy: outDataProxy
        };

        this.propertiesPanel.$mainControl.bind('callFunction', function (event, eventData) {
            var fid = eventData;
            if (fid && fid !== _this.propertiesPanel.options.fnUnit.fid) return;

            if (_this.outPanel) {
                _this.outPanel.destroy();
                _this.outPanel = null;
            }
            else if (_this.outViewerTab) {
                _this.outViewerTab.destroy();
                _this.outViewerTab = null;
            }
            var $outContainer = _this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');
            $outContainer.empty();
            _this.createOutPanel($outContainer, outOptions);
        });

        this.createInPanel($inContainer, inOptions);
        this.createOutPanel($outContainer, outOptions);

        this.bindEventHandlers();
        this.updatePanelWidth();

        this._status = 'rendered';
    };

    FnUnitViewer.prototype.bindEventHandlers = function () {
        var _this = this;
        var $inDataPanel = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-indata-fncenter'),
            $outDataPanel = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-outdata-fncenter');

        $inDataPanel.on('sizeChange', function () {
            if ($outDataPanel.css('display') === 'none') $outDataPanel.show();
            else $outDataPanel.hide();

            _this.updatePanelWidth();
        });
        $outDataPanel.on('sizeChange', function (panelType) {
            if ($inDataPanel.css('display') === 'none') $inDataPanel.show();
            else $inDataPanel.hide();

            _this.updatePanelWidth();
        });
    };

    FnUnitViewer.prototype.updatePanelWidth = function () {
        var fixedWidth = 0;
        var $fixedPanels = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-fixed-width');
        $fixedPanels.each(function () {
            if ($(this).css('display') !== 'none') {
                fixedWidth += $(this).width();
            }
        });

        var flexPanelCount = 0;
        var $flexPanels = this.$mainControl.children('.brtc-va-editors-sheet-fnunitviewer-flex-width');
        $flexPanels.each(function () {
            if ($(this).css('display') !== 'none') {
                flexPanelCount++;
            }
        });
        $flexPanels.each(function () {
            if ($(this).css('display') !== 'none') {
                $(this).css('width', 'calc((100% - ' + (fixedWidth + 2) + 'px) / ' + flexPanelCount + ')');
            }
        });

        if (flexPanelCount == 2) {
            if (this.inPanel) this.inPanel.adjustMaximize(false);
            if (this.outPanel) this.outPanel.adjustMaximize(false);
        }

        this.adjustHeader($flexPanels);
        // if (this.inPanel) this.inPanel.adjustHeader();
        // if (this.outPanel) this.outPanel.adjustHeader();

        $(window).trigger('resize');
    };

    FnUnitViewer.prototype.adjustHeader = function ($panels) {
        $panels.each(function () {
            var $panel = $(this);
            if ($panel.children().length === 0) return;

            //임시....Toolbar의 위치를 보고 판단할 수 밖에 없음...
            var $toolBar = $panel.find('.brtc-va-editors-sheet-panels-datapanel-toolbar');
            if ($toolBar.length === 0) return;
            var $workSheetSelector = $panel.find('.brtc-va-editors-sheet-worksheet-selector');
            var $context = $panel.find('.brtc-va-editors-sheet-panels-basepanel-header-context-menu-open');
            var $title = $panel.find('.brtc-va-editors-sheet-panels-basepanel-header-title');

            var toolBarPosition = $toolBar.position();
            
            // top이 0 이면 접히지 않았을 경우
            var width = (toolBarPosition.top === 0) ?
                $panel.width() - ($workSheetSelector.width() + $toolBar.width()) :
                $panel.width() - ($workSheetSelector.width() + $context.width());;

            $title.width(width);
        });
    };

    FnUnitViewer.prototype.refresh = function () {
        if (this.propertiesPanel) {
            this.propertiesPanel.refresh();
        }
    };

    FnUnitViewer.prototype.getPreviousFnUnit = function (fnUnit) {
        var fnUnits = [];
        var model = fnUnit.parent();
        var fids = model.getPrevious(fnUnit.fid);

        _.forEach(fids, function (fid) {
            fnUnits.push(model.getFnUnitById(fid));
        });
        return fnUnits;
    };

    Brightics.VA.Core.Editors.Sheet.FnUnitViewer = FnUnitViewer;

    function DataProxy(parentId, mid) {
        this.parentId = parentId;
        this.mid = mid;
        this.requested = {};
        this.retrieveParent();
        this.createControls();
    }

    DataProxy.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    DataProxy.prototype.createControls = function () {
        this.createProgress();
    };

    DataProxy.prototype.createProgress = function () {
        this.$parent.prepend($('' +
            '<div class="brtc-va-progress">' +
            '   <div>' +
            '       <span class="brtc-va-progress-loading"></span>' +
            '       <p class="brtc-va-progress-loading-label">Fetching rows ...</p>' +
            '   </div>' +
            '</div>'
        ));
    };

    DataProxy.prototype.requestPageData = function (table, doneCallback, failCallback, pageNum, pageSize, columnOptions) {
        var _this = this;
        if (!this.requested[table]) this.requested[table] = [];
        this.requested[table].push({
            doneCallback: doneCallback,
            failCallback: failCallback
        });
        this._showProgress();
        var offset = (pageNum - 1) * pageSize;
        var limit = pageSize;
        Brightics.VA.Core.DataQueryTemplate.queryData(_this.mid, table, offset, limit, function (data, tableId) {
            if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(data, tableId);

            _this._done(tableId);
        }, function (data, tableId, err) {
            if (failCallback) {
                if (_this.requested[tableId]) _this.requested[tableId].shift().failCallback(data);
            }
            _this._done(tableId);
        }, columnOptions);
    };

    DataProxy.prototype.requestData = function (table, doneCallback, failCallback, length, force) {
        var _this = this;
        if (!this.requested[table]) this.requested[table] = [];
        this.requested[table].push({
            doneCallback: doneCallback,
            failCallback: failCallback
        });

        this._showProgress();
        if (length) {
            Brightics.VA.Core.DataQueryTemplate.fetchMore(_this.mid, table, length, function (data, tableId) {
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(data);

                _this._done(tableId);
            }, function (data, tableId, err) {
                if (failCallback) {
                    if (_this.requested[tableId]) _this.requested[tableId].shift().failCallback(data);
                }
                _this._done(tableId);
            });
        } else {
            Brightics.VA.Core.DataQueryTemplate.queryTable(_this.mid, table, function (data, tableId) {
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(data);

                _this._done(tableId);
            }, function (data, tableId, err) {
                if (failCallback) {
                    if (_this.requested[tableId]) _this.requested[tableId].shift().failCallback(data);
                }
                _this._done(tableId);
            }, force);
        }
    };

    //kill me
    DataProxy.prototype.requestDataForEDA = function (table, doneCallback, failCallback, length, force) {
        var _this = this;
        if (!this.requested[table]) this.requested[table] = [];
        this.requested[table].push({
            doneCallback: doneCallback,
            failCallback: failCallback
        });

        this._showProgress();
        if (length) {
            Brightics.VA.Core.DataQueryTemplate.fetchMore(_this.mid, table, length, function (data, tableId) {
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(data);

                _this._done(tableId);
            }, function (data, tableId, err) {
                var rt = {
                    "type": "table",
                    "data": [],
                    "bytes": 1,
                    "count": 0,
                    "columns": [{
                        "name": "continuous_feature_idx",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "continuous_feature_num",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "category_feature_idx",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "category_feature_num",
                        "type": "number",
                        "internalType": "Integer"
                    }, {"name": "label_idx", "type": "number", "internalType": "Integer"}]
                }
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(rt);
                _this._done(tableId);
            });
        } else {
            Brightics.VA.Core.DataQueryTemplate.queryTable(_this.mid, table, function (data, tableId) {
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(data);

                _this._done(tableId);
            }, function (data, tableId, err) {
                var rt = {
                    "type": "table",
                    "data": [],
                    "bytes": 1,
                    "count": 0,
                    "columns": [{
                        "name": "continuous_feature_idx",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "continuous_feature_num",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "category_feature_idx",
                        "type": "number",
                        "internalType": "Integer"
                    }, {
                        "name": "category_feature_num",
                        "type": "number",
                        "internalType": "Integer"
                    }, {"name": "label_idx", "type": "number", "internalType": "Integer"}]
                }
                if (_this.requested[tableId]) _this.requested[tableId].shift().doneCallback(rt);
                _this._done(tableId);
            }, force);
        }
    };

    DataProxy.prototype.requestSchema = function (table, doneCallback, failCallback) {
        var _this = this;

        Brightics.VA.Core.DataQueryTemplate.querySchema(_this.mid, table, doneCallback, failCallback);
    };

    DataProxy.prototype.requestFetchMore = function (table, length, doneCallback, failCallback) {
        this.requestData(table, doneCallback, failCallback, length);
    };

    DataProxy.prototype.requestDataForce = function (table, doneCallback, failCallback) {
        this.requestData(table, doneCallback, failCallback, false, true);
    };

    DataProxy.prototype._done = function (table) {
        if (!this.requested[table] || this.requested[table].length === 0) delete this.requested[table];
        if (Object.keys(this.requested).length === 0) this._hideProgress();
    };

    DataProxy.prototype.reset = function () {
        this._hideProgress();
        this.requested = {};
    };

    DataProxy.prototype._hideProgress = function () {
        this.$parent.find('.brtc-va-progress').hide();
    };

    DataProxy.prototype._showProgress = function () {
        if (this.$parent.find('.brtc-va-progress').length === 0) {
            this.createProgress();
        }
        this.$parent.find('.brtc-va-progress').show();
    };

    DataProxy.prototype.failCallBackHandler = function (failCallback, data, tableId, err) {
        if (failCallback) {
            if (this.requested[tableId]) this.requested[tableId].shift().failCallback(data);
        }
        this._done(tableId);
    };

    DataProxy.prototype.doneCallBackHandler = function (data, tableId) {
        if (this.requested[tableId]) this.requested[tableId].shift().doneCallback(data, tableId);

        this._done(tableId);
    };
    
    Brightics.VA.Core.Editors.Sheet.DataProxy = DataProxy;

}).call(this);