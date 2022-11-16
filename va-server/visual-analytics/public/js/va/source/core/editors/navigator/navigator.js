/**
 * Created by sds on 2017-07-17.
 */

/* global _ */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;
    var CLICKABLE = 'brtc-style-emphasis';
    var MAX_ITEM = 2;

    function Navigator($parent, options) {
        this.options = options;
        this.editorInput = this.options.editor.options.editorInput;
        this.editor = this.options.editor;
        this.activityList = [];
        this.path = [];

        this.retrieveParent($parent);
        this.createControls();
        this.init();
    }

    Navigator.prototype.retrieveParent = function ($parent) {
        this.$parent = $parent;
    };
    
    Navigator.prototype.createControls = function () {
        var $container = $('' +
        '<div class="brtc-va-editors-model-info-toolbar brtc-style-editor-model-info brtc-style-padding-0 brtc-va-editors-toolbar-navigator">' +
        '   <div class="brtc-va-editors-model-info-toolbar-title brtc-style-editors-model-info-toolitem brtc-style-cursor-default">'+Brightics.locale.common.home+
        '   </div>' +
        '</div>');

        this.$parent.append($container);

        ///// fix me
        this.$mainControl = $container.find('.brtc-va-editors-model-info-toolbar-title.brtc-style-editors-model-info-toolitem');
    };

    Navigator.prototype.init = function () {
        this.$mainControl.html(Brightics.locale.common.home);
        this.addProject();
        this.addFile();
    };

    Navigator.prototype._getConditionType = function (condition, conditions) {
        if (conditions[0] === condition) return 'if';
        if (conditions[conditions.length - 1] === condition) return 'else';
        return 'else if';
    };

    Navigator.prototype.dfs = function (model, targetMid, targetFid) {
        if (_.isUndefined(model)) return false;
        if (model.mid === targetMid) return true;
        var _this = this;
        var getLabel = function (fn) {
            return fn.display.label;
        };
        for (var i = 0; i < model.functions.length; ++i) {
            var fn = model.functions[i];
            if (!targetMid && fn.fid === targetFid) {
                _this.path.push({
                    fnUnit: fn,
                    label: getLabel(fn)
                });
                return true;
            }
            if (fn.func === 'if') {
                var conditions = _this.getConditions(fn);
                for (var j = 0; j < conditions.length; ++j) {
                    var condition = conditions[j];
                    _this.path.push({
                        mid: condition.mid,
                        fnUnit: fn,
                        label: getLabel(fn) +
                            '(' + this._getConditionType(condition, conditions) + ')'
                    });
                    if (_this.dfs(_this._getModelByMid(condition.mid), targetMid, targetFid)) {
                        return true;
                    }
                    _this.path.pop();
                }
            } else if (fn.func === 'forLoop' ||
                    fn.func === 'whileLoop') {
                _this.path.push({
                    mid: fn.param.mid,
                    fnUnit: fn,
                    label: getLabel(fn)
                });
                if (_this.dfs(_this._getModelByMid(fn.param.mid), targetMid, targetFid)) {
                    return true;
                }
                _this.path.pop();
            }
        }
        return false;
    };

    Navigator.prototype.getConditions = function (fn) {
        var ret = [];
        ret.push(fn.param.if);
        ret = ret.concat(fn.param.elseif);
        ret.push(fn.param.else);
        return ret;
    };

    Navigator.prototype.buildNavigator = function (mid, fid) {
        var _this = this;
        this.init();
        this.path = [];
        this.activityList = [];
        if (this.dfs(this.options.editor.getModel(), mid, fid)) {
            if (this.path.length > MAX_ITEM) {
                _this.addDotDotDot();
            }
            _.forEach(_.dropRight(_.takeRight(this.path, MAX_ITEM)),
                _.partial(_this.addActivity, _, true),
                _this);
            if (!_.isEmpty(this.path)) {
                _this.addActivity(_.last(this.path));
                _this.$fileUnit.addClass(CLICKABLE);
            } else {
                _this.$fileUnit.removeClass(CLICKABLE);
            }
        }
    };

    Navigator.prototype.addProject = function () {
        var projectId = this.editorInput.getProjectId();
        var project = Studio.getResourceManager().getProject(projectId);
        var projectLabel = project.getLabel();

        var $unit = this.createUnit(projectId);

        var $projectArea = $('<div class="brtc-va-editors-modelinfo-toolbar-project-label"></div>');
        $projectArea.text(projectLabel).attr('title', projectLabel);

        $unit.append($projectArea);
    };

    Navigator.prototype.addFile = function () {
        var _this = this;
        
        var $unit = this.createUnit(this.editorInput.getFileId());
        
        var fileLabel = this.editorInput.getLabel();
        var $fileArea = $('<div class="brtc-va-editors-modelinfo-toolbar-file-label"></div>');
        $fileArea.text(fileLabel).attr('title', fileLabel);               
        $unit.append($fileArea);

        this.$fileUnit = $unit;

        $fileArea.click(function () {
            if (_this.isClickable($unit)) {
                var modelLayoutManager = _this.editor.modelLayoutManager;
                if (modelLayoutManager) {
                    if (modelLayoutManager.openActivity &&
                        typeof modelLayoutManager.openActivity === 'function') {
                        modelLayoutManager.openActivity(_this.editorInput.getFileId());
                    }
                }
            }
        });
    };

    Navigator.prototype.addDotDotDot = function () {
        var _this = this;
        var modelLayoutManager = this.options.editor.modelLayoutManager;
        var $unit = this.createUnit('---');
        var $activityArea = $('<div class="brtc-va-editors-modelinfo-toolbar-activity-label"></div>');
        var activityLabel = '...';
        $activityArea.text(activityLabel).attr('title', activityLabel);
        this.addEmphasis($unit);
        $unit.append($activityArea);
        $activityArea.addClass('brtc-va-editors-modelinfo-toolbar-dotdotdot');
        $activityArea.click(function (event) {
            var anchorOffset = $(event.target).offset();
            var pos = {
                x: anchorOffset.left - 402 + 26,
                y: anchorOffset.top - 10 + 40
            };
            _this.openNavigatorDialog(pos, _.dropRight(_this.path, MAX_ITEM), {
                getNavigatorData: function () {
                    return _.dropRight(_this.path, MAX_ITEM);
                },
                navigate: function (mid, fid) {
                    modelLayoutManager.openActivity(mid, fid);
                }
            });
        });
    };

    Navigator.prototype.addActivity = function (opt, clickable) {
        var _this = this;
        var activityId = opt.mid || opt.fnUnit.fid;
        var $unit = this.createUnit(activityId);
        var activityLabel = opt.label;
        var $activityArea = $('<div class="brtc-va-editors-modelinfo-toolbar-activity-label"></div>');
        $activityArea.text(activityLabel).attr('title', activityLabel);
        $unit.append($activityArea);
        if (clickable) {
            this.addEmphasis($unit);
            $activityArea.click(function () {
                _this.handleActivitySelected(activityId);
            });
        }

        this.addToActivityList({ id: activityId, view: $unit, fnUnit: opt.fnUnit });
        return $activityArea;
    };

    Navigator.prototype.addToActivityList = function (activityObj) {
        this.activityList.push(activityObj);
    };

    Navigator.prototype.createUnit = function (id) {
        this.activityList.push(id);
        
        var $unit = $('<div class="brtc-va-editors-modelinfo-toolbar-unit brtc-style-flex-center"></div>');
        $unit.attr('id', id);
        this.addArrow($unit);
        this.$mainControl.append($unit);

        return $unit;
    };

    Navigator.prototype.addArrow = function ($parent) {
        var $arrow = $('<div class="brtc-style-editors-model-info-arrow brtc-style-cursor-default" ></div>');
        $parent.append($arrow);
    };

    Navigator.prototype.getActivity = function (id) {
        for (var i in this.activityList) {
            if (this.activityList[i].id === id) {
                this.activityList[i].index = i;

                return this.activityList[i];
            }
        }
        return {};
    };

    Navigator.prototype.handleActivitySelected = function (id) {
        var selectedActivity = this.getActivity(id);

        var modelLayoutManager = this.options.editor.modelLayoutManager;
        if (modelLayoutManager) {
            if (modelLayoutManager.openActivity &&
                typeof modelLayoutManager.openActivity === 'function') {
                modelLayoutManager.openActivity(selectedActivity.id, selectedActivity.fnUnit);
            }
        }
    };

    Navigator.prototype._getModelByMid = function (mid) {
        return this.editor.getModelByMid(mid);
    };

    Navigator.prototype._getFunctionByFid = function (fid) {
        return this.editor.getFunctionByFid(fid);
    };

    Navigator.prototype.addEmphasis = function ($unit) {
        $unit.addClass(CLICKABLE);
    };
    
    Navigator.prototype.removeEmphasis = function ($unit) {
        $unit.removeClass(CLICKABLE);
    };

    Navigator.prototype.isClickable = function ($unit) {
        return $unit.hasClass(CLICKABLE);
    };

    Navigator.prototype.registerOpenNavigatorDialog = function (open) {
        this.openNavigatorDialog = open;
    };

    Navigator.prototype.getPath = function () {
        return this.path;
    };

    Brightics.VA.Core.Editors.Navigator = Navigator;

/* eslint-disable no-invalid-this */
}).call(this);
