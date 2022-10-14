/**
 * Created by gy84.bae on 2016-04-11.
 */

/* global Studio, _, FUNCTION_NAME */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    let modelTypeLabel = {
        data: Brightics.locale.common.dataFlow,
        visual: Brightics.locale.common.report,
    };

    function ProjectViewer(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.chartContentAddedReport = {};

        this.retrieveParent();
        this.createControls();
        this.fillProjectList();
    }

    ProjectViewer.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ProjectViewer.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-workspace-project-container">' +
            '   <div class="brtc-va-workspace-project-container-contents"></div>' +
            '   <div class="brtc-va-workspace-project-container-ctxmenu">' +
            '       <ul>' +
            '           <li action="edit">' + Brightics.locale.common.edit + '</li>' +
            '           <li action="delete">' + Brightics.locale.common.delete + '</li>' +
            '           <li action="duplicate">' + Brightics.locale.common.duplicate + '</li>' +
            '           <li type="separator"></li>' +
            '           <li action="export">' + Brightics.locale.common.export + '</li>' +
            '           <li action="exportAsRunnable">' + Brightics.locale.common.exportasRunnable + '</li>' +
            '           <li action="deploy">' + Brightics.locale.common.deploy + '</li>' +
            '           <li type="separator"></li>' +
            '           <li action="members">' + Brightics.locale.common.memberManagement + '</li>' +
            '           <li action="version">' + Brightics.locale.common.versionManagement + '</li>' +
            '       </ul>' +
            '   </div>' +
            '</div>');

        this.$parent.append(this.$mainControl);
        this.$contentsContainer = this.$mainControl.find('.brtc-va-workspace-project-container-contents');
        this.createContentsContainer(this.$contentsContainer);

        this.$ctxMenu = this.$mainControl.find('.brtc-va-workspace-project-container-ctxmenu').jqxMenu({
            theme: Brightics.VA.Env.Theme,
            width: '200px',
            height: '180px',
            autoOpenPopup: false,
            mode: 'popup',
            animationHideDuration: 0,
            animationShowDuration: 0
        });

        var _this = this;
        this.$ctxMenu.on('itemclick', _.debounce(function (event) {
            var $el = $(event.args);
            var menuType = $el.closest('.brtc-va-workspace-project-container-ctxmenu').attr('menu-type');
            var projectId = $el.closest('.brtc-va-workspace-project-container-ctxmenu').attr('project-id');
            var fileId = $el.closest('.brtc-va-workspace-project-container-ctxmenu').attr('file-id');
            if (menuType == 'file-edit') {
                if ($el.attr('action') == 'edit') {
                    _this.editFile(projectId, fileId);
                }
                if ($el.attr('action') == 'delete') {
                    _this.openDeleteConfirmDialog(projectId, fileId);
                }
                if ($el.attr('action') == 'duplicate') {
                    _this.openDuplicateModelDialog(projectId, fileId);
                }
                if ($el.attr('action') == 'export') {
                    _this.exportFile(projectId, fileId);
                }
                if ($el.attr('action') == 'deploy') {
                    /*
                     TODO: deploy 다이어그램이 먼저 뜨고 버젼을 고를 수 있는 다이얼로그를 띄운다.
                     드롭다운 리스트로 하면 편하겠지만 보여지는 정보가 제한되므로 다이얼로그 형태가 좋아보임.
                     */
                    _this.deployFile(projectId, fileId);
                }
                if ($el.attr('action') == 'exportAsRunnable') {
                    _this.exportRunnableFile(projectId, fileId);
                }
                if ($el.attr('action') == 'sendTo') {
                    _this.openSelectUserDialog(projectId, fileId);
                }
                if ($el.attr('action') === 'version') {
                    _this.openVersionManagementDialog(projectId, fileId);
                }
            } else if (menuType == 'bulk-edit') {
                var type = _this.getSelectedTabType();
                var selected = _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .brtc-va-workspace-model-list-item-select.jqx-checkbox-checked');

                if (!selected || selected.length == 0) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('Please select a ' + type + '.');
                    return;
                }

                var files = [];
                selected.each(function (index) {
                    files.push($(this).attr('id'));
                });

                if ($el.attr('action') == 'delete') {
                    _this.deleteFiles(projectId, files);
                }
                if ($el.attr('action') == 'duplicate') {
                    _this.duplicateFiles(projectId, files);
                }
                if ($el.attr('action') == 'export') {
                    _this.exportFiles(projectId, files);
                }
            } else if (menuType == 'project-edit') {
                if ($el.attr('action') == 'edit') {
                    _this.openEditProjectDialog(projectId);
                }
                if ($el.attr('action') == 'delete') {
                    _this.deleteProject(projectId);
                }
                if ($el.attr('action') == 'members') {
                    _this.openMemberManagementDialog(projectId);
                }
                if ($el.attr('action') == 'export') {
                    _this.exportProject(projectId);
                }
            }
        }, 300, {leading: true, trailing: false}));

        this.ctxMenuCloseHandler = function () {
            _this.$ctxMenu.jqxMenu('close');
        };

        this.$ctxMenu.on('closed', function () {
            $('.brtc-va-workspace-model-list-area').off('scroll', _this.ctxMenuCloseHandler);
            $(window).off('resize', _this.ctxMenuCloseHandler);
        });
    };

    ProjectViewer.prototype.openSelectUserDialog = function (projectId, fileId) {
        new Brightics.VA.Core.Dialogs.SelectUserDialog(this.$mainControl, {
            projectId: projectId,
            fileId: fileId,
            fileListByProject: Studio.getResourceManager().getFiles(projectId)
        });
    };


    ProjectViewer.prototype.openVersionManagementDialog = function (projectId, fileId) {
        new Brightics.VA.Core.Dialogs.VersionManagementDialog(this.$mainControl, {
            projectId: projectId,
            fileId: fileId,
            position: {my: 'center top', at: 'center top+15%', of: window}
        });
    };

    ProjectViewer.prototype.openDeleteConfirmDialog = function (projectId, fileId) {
        var _this = this;
        var file = Studio.getResourceManager().getFile(projectId, fileId);

        if (file.getType() === Brightics.VA.Implementation.DataFlow.Clazz) {
            var flows = this.getFlowUsingTargetDataFlow(projectId, fileId);
            if (flows.length > 0) {
                var labels = flows.map(function (f) {
                    return f.getLabel();
                });
                Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog('This data flow is used for other flows. ' + JSON.stringify(labels));
                return;
            }
        }

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                Studio.getResourceManager().deleteFile(projectId, fileId).then(function () {
                    _this.deleteAlluxioFile([fileId]);
                    _this.fillProjectList(file.getProjectId(), file.getContents().type);
                }).catch(function (err) {
                });
            }
        };
        var message = 'Are you sure you want to delete "' + file.getLabel() + '"?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, closeHandler);
    };


    ProjectViewer.prototype.getControlFlowUsingTargetDataFlow = function (projectId, fileId) {
        var results = [];
        var controlFlows = Studio.getResourceManager().getFiles(projectId, 'control');
        for (var i in controlFlows) {
            var hasDataFlow = _hasDataFlow(controlFlows[i].getContents().functions);
            if (hasDataFlow) results.push(controlFlows[i]);
        }
        return results;

        function _hasDataFlow(functions) {
            var hasFlag = false;
            for (var j in functions) {
                if (functions[j].func === 'dataFlow' && functions[j].param.mid === fileId) {
                    hasFlag = true;
                } else {
                    hasFlag = _hasDataFlow(functions[j].param.functions);
                }
                if (hasFlag) break;
            }
            return hasFlag;
        }
    };

    ProjectViewer.prototype.getDataFlowUsingTargetDataFlow = function (projectId, fileId) {
        return Studio.getResourceManager().getFiles(projectId)
            .filter(function (file) {
                return file.getFileId() !== fileId &&
                    file.getType() === Brightics.VA.Implementation.DataFlow.Clazz;
            })
            .filter(function (file) {
                var model = file.getContents();
                var innerModels = _.toArray(model.getInnerModels());
                return _.any(innerModels.concat(model), function (m) {
                    return _.any(m.functions, function (fn) {
                        return fn[FUNCTION_NAME] === 'Flow' &&
                            fn.param.mid === fileId;
                    });
                });
            });
    };

    ProjectViewer.prototype.getFlowUsingTargetDataFlow = function (projectId, fileId) {
        return this.getControlFlowUsingTargetDataFlow(projectId, fileId)
            .concat(this.getDataFlowUsingTargetDataFlow(projectId, fileId));
    };

    ProjectViewer.prototype.openDuplicateModelDialog = function (projectId, fileId) {
        var _this = this,
            file = Studio.getResourceManager().getFile(projectId, fileId);

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                _this.fillProjectList(dialogResult.projectId, _this.getSelectedTabType() == 'model' ? 'model' : 'visual');
            }
        };
        var title = this.getSelectedTabType() === 'model' ? Brightics.locale.common.duplicateModel : Brightics.locale.common.duplicateReport;
        new Brightics.VA.Core.Dialogs.DuplicateModelDialog($('body'), {
            files: [file],
            title: title,
            resourceManager: Studio.getResourceManager(),
            close: closeHandler,
            width: 600,
            height: 300,
            minWidth: 600,
            minHeight: 300,
            maxWidth: 800,
            maxHeight: 400,
            resizable: false
        });
    };

    ProjectViewer.prototype.editFile = function (projectId, fileId) {
        var _this = this;
        var file = Studio.getResourceManager().getFile(projectId, fileId);
        _this.openEditFileDialog(file);
    };

    ProjectViewer.prototype.openEditFileDialog = function (file) {
        var _this = this;
        var title = this.getSelectedTabType() === 'model' ? Brightics.locale.common.editModel : Brightics.locale.common.editReport;
        var dlg = new Brightics.VA.Core.Dialogs.EditResourceDialog(this.$mainControl, {
            title: title,
            label: file.getLabel(),
            description: file.getDescription(),
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    if (file.getLabel() == dialogResult.label && file.getDescription() == dialogResult.description) return;
                    file.setLabel(dialogResult.label);
                    file.setDescription(dialogResult.description);
                    _this.doEditFile(file).catch(function (err) {
                        if (err.status === 400) {
                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                        } else if (!err.status) {
                            console.error(err);
                            throw err;
                        }
                        file.setLabel(dlg.options.label);
                        file.setDescription(dlg.options.description);
                        _this.fillProjectList(file.getProjectId(), file.getContents().type);
                    });
                }
            }
        });
    };

    ProjectViewer.prototype.doEditFile = function (file) {
        var _this = this;
        file.setUpdater(Brightics.VA.Env.Session.userId);

        return Studio.getResourceManager().updateFile(file.getProjectId(), file)
            .then(function ([err]) {
                if (!err) _this.fillProjectList(file.getProjectId(), file.getContents().type);
            });
    };

    ProjectViewer.prototype._exportObjectFile = function (file) {
        file.getContents().problemList = [];
        Brightics.VA.Core.Utils.CommonUtils.downloadJsonFile(JSON.stringify(file.getContents()), file.getLabel());
    };

    // ProjectViewer.prototype._modelTreeToArrayFile = function (dataflowTree, file, projectId) {
    //     var flowList = Brightics.VA.Core.Utils.ModelUtils.flattenModelTree(dataflowTree, projectId);
    //     flowList.push(file.contents);
    //     Brightics.VA.Core.Utils.CommonUtils
    //         .downloadJsonFile(JSON.stringify(flowList), file.label);
    // };

    ProjectViewer.prototype._exportArrayFile = function (projectId, file) {
        Brightics.VA.Core.Utils.ModelUtils.createModelTree(projectId, file.getContents())
            .then(function (modelTree) {
                var modelArray = Brightics.VA.Core.Utils.ModelUtils
                    .getModelArrayByTree(modelTree, file, projectId);
                return Brightics.VA.Core.Utils.CommonUtils
                    .downloadJsonFile(JSON.stringify(modelArray), file.getLabel());
            })
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
    };

    ProjectViewer.prototype.exportFile = function (projectId, fileId) {
        this.exportFiles(projectId, [fileId], true);
    };

    ProjectViewer.prototype.searchDataFlowFile = function (projectId, functions, flowList) {
        var _this = this;

        for (var i in functions) {
            if (functions[i].param.functions) {
                _this.searchDataFlowFile(projectId, functions[i].param.functions, flowList);
            }

            var isDuplicateFlag = false;
            if (functions[i][FUNCTION_NAME] === 'DataFlow') {
                for (var j in flowList) {
                    if (functions[i].param.mid === flowList[j].mid) {
                        isDuplicateFlag = true;
                    }
                }
                if (!isDuplicateFlag) {
                    var dataFlowFile = Studio.getResourceManager().getFile(projectId, functions[i].param.mid);
                    // Dataflow 삭제된 경우
                    if (dataFlowFile == undefined) {
                        return '"' + functions[i].display.label + '" dataflow was deleted or format is invalid in selected control flow';
                    } else {
                        flowList.push(dataFlowFile.getContents());
                    }
                }
            }
        }
    };

    ProjectViewer.prototype.exportRunnableFile = function (projectId, fileId) {
        var file = Studio.getResourceManager().getFile(projectId, fileId);
        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                var getRunnable = function (file) {
                    return Brightics.VA.Core.Utils.RunnableFactory
                        .createForFlow(file.getContents(),
                            undefined,
                            undefined,
                            dialogResult.args,
                            {});
                };

                getRunnable(file)
                    .then(function (runnableFile) {
                        var data = JSON.stringify(runnableFile);
                        var fileName = file.getLabel();
                        Brightics.VA.Core.Utils.CommonUtils.downloadJsonFile(data, fileName);
                    })
                    .catch(console.error);
            }
        };

        if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' && file.getContents().type == 'control' && file.getContents().variables.length > 0) {
            new Brightics.VA.Core.Dialogs.RunControlDialog(this.$parent, {
                close: closeHandler,
                analyticsModel: file.getContents()
            });
        } else if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' && file.getContents().type == 'realtime') {
            new Brightics.VA.Core.Dialogs.RunRealTimeDialog(this.$parent, {
                close: closeHandler,
                analyticsModel: file.getContents()
            });
        } else if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' && file.getContents().type == 'data' && Object.keys(file.getContents().variables).length > 0) {
            new Brightics.VA.Core.Dialogs.RunDataDialog(this.$parent, {
                close: closeHandler,
                analyticsModel: file.getContents()
            });
        } else {
            closeHandler({OK: true});
        }
    };

    ProjectViewer.prototype.createDescriptionControl = function ($control) {
        var _this = this;
        var noteOption = {
            height: 230,
            description: this.options.description,
            okButton: this.$okButton,
            maxLength: 2000,
            toolbar: this.options.toolbar
        };

        this.noteControl = Brightics.VA.Core.Widget.Factory.noteControl($control, noteOption);

        this.$mainControl.on('resizing', function (event) {
            _this.noteControl.setHeight(_this.$mainControl.find('.brtc-va-dialogs-contents').height());
        });
    };

    // deployFile
    ProjectViewer.prototype.deployFile = function (projectId, fileId) {
        var projectName = $('.brtc-va-workspace-model-list-title').text();
        var variableflag = 'N';
        var args = {};
        var file = Studio.getResourceManager().getFile(projectId, fileId);
        var _this = this;

        if (Brightics.VA.SettingStorage.getValue('editor.variable.visible') === 'true' &&
            file.getContents().type === 'data' && _.keys(file.getContents().variables).length > 0) {
            variableflag = 'Y';
            var variables = file.getContents().variables;
            _.forIn(variables, function (v) {
                args[v.name] = v.value;
            });
        }

        return Brightics.VA.Core.Utils.RunnableFactory
            .createForFlow(file.getContents(), args, {})
            .then(function (runnable) {
                var fileContents = file.getContents();
                var runnableContents = runnable;
                return _this.openDeployModelDialog(
                    projectName,
                    file,
                    fileContents,
                    runnableContents,
                    variableflag);
            })
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
    };

    ProjectViewer.prototype.openDeployModelDialog = function (projectName, file, fileContents, runnableContents, variableFlag) {
        var _this = this;
        var title = Brightics.locale.common.deployToServer;
        var userId = Brightics.VA.Env.Session.userId;
        var $dialog = new Brightics.VA.Core.Dialogs.DeployModelDialog(this.$mainControl, {
            title: title,
            projectId: file.getProjectId(),
            fileId: file.getFileId(),
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var deployInfo =
                        {
                            server: dialogResult.server,
                            projectId: file.getProjectId(),
                            modelId: file.getFileId(),
                            registerUserId: userId,
                            projectName: projectName,
                            modelName: file.getLabel(),
                            title: dialogResult.name,
                            description: dialogResult.description,
                            contents: JSON.stringify(fileContents),
                            runnableContents: JSON.stringify(runnableContents),
                            gvFlag: variableFlag
                        };

                    // deploy action 수행
                    _this.deployAction(deployInfo);
                }
            }
        });
    };

    // 실제 deploy 수행
    ProjectViewer.prototype.deployAction = function (deployInfo) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: 'api/va/v2/ws/deploy',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(deployInfo),
            blocking: true
        }).done(function (data) {
            // deploy management 화면으로 이동
            var callback = function () {
                setTimeout(function () {
                    var w = window.open('/ng1123/deploy', 'Brightics Management');
                    w.blur();
                }, 1000);
            };

            _this.doCreateSuccessPopup(data, deployInfo.server, callback);
        }).fail(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
        return true;
    };

    ProjectViewer.prototype.createContentsContainer = function ($parent) {
        var _this = this;

        $parent.append('' +
            '<div class="brtc-va-workspace-model-list-popup-header">' +
            '   <div class="brtc-va-workspace-model-list-popup-header-title">'+Brightics.locale.common.openModelReport+'</div>' +
            '   <div class="brtc-va-workspace-model-list-popup-header-close"></div>' +
            '</div>');
        $parent.find('.brtc-va-workspace-model-list-popup-header-close').click(function () {
            _this.result = {
                selectedProject: undefined,
                selectedFiles: undefined
            };
            _this.performFinish();
        });

        var $projectListArea = $('<div class="brtc-va-workspace-project-list-area">' +
            '   <div class="brtc-va-workspace-project-filter brtc-va-searcharea brtc-style-search-area"></div>' +
            '   <div class="brtc-va-workspace-project-groups"></div>' +
            '</div>');
        $parent.append($projectListArea);

        var $filterInput = $('<input type="search" class="brtc-va-views-workspace-project-input searchinput"/>');
        $projectListArea.find('.brtc-va-workspace-project-filter').append($filterInput);

        $filterInput.jqxInput({
            placeHolder: Brightics.locale.common.searchProject,
            theme: Brightics.VA.Env.Theme
        });

        var applyFilter = function (event) {
            var filterValue = event.target.value.toLowerCase();

            var projectListItems = _this.$mainControl.find('.brtc-va-workspace-project-list-item');
            $.each(projectListItems, function (index, item) {
                var $projectElement = $(item);
                $projectElement.css('display', $(item).find('.brtc-va-workspace-project-list-item-label').text().toLowerCase().indexOf(filterValue) > -1 ? 'block' : 'none');
            });

            _this.renderProjectListContainer();
        };
        $filterInput.keyup(function (event) {
            applyFilter(event);
        });

        $filterInput.on('search', function () {
            applyFilter(event);
        });


        Brightics.VA.Core.Utils.WidgetUtils.createPrivatePolicy($parent.find('.brtc-va-workspace-project-list-area'));
        $parent.append('<div class="brtc-va-workspace-model-list-area"></div>');
    };

    ProjectViewer.prototype._clearProjectList = function () {
        this.$mainControl.find('.brtc-va-workspace-project-groups').empty();
        this.$mainControl.find('.brtc-va-views-workspace-project-input').val('');
    };

    ProjectViewer.prototype.renderProjectListContainer = function () {
        var myProjectGroup = this.$mainControl.find('.brtc-va-workspace-project-group-area.my');
        var sharedProjectGroup = this.$mainControl.find('.brtc-va-workspace-project-group-area.shared');

        var myProjectVisible = $(myProjectGroup).find('.brtc-va-workspace-project-list').css('display') == 'block' ? true : false;
        var sharedProjectVisible = $(sharedProjectGroup).find('.brtc-va-workspace-project-list').css('display') == 'block' ? true : false;

        // MY Project Height 조정.
        var myProjects = $(myProjectGroup).find('.brtc-va-workspace-project-list-item');
        var myVisibleElements = myProjects.filter(function () {
            return $(this).css('display') == 'block';
        });

        // Shared Project Height 조정
        var sharedProjects = $(sharedProjectGroup).find('.brtc-va-workspace-project-list-item');
        var sharedVisibleElements = sharedProjects.filter(function () {
            return $(this).css('display') == 'block';
        });

        if (!this.$mainControl.find('.brtc-va-workspace-project-groups').is(':visible')) {
            return;
        }

        var titleHeight = this.$mainControl.find('.brtc-va-workspace-project-list-title').height() + 1;
        var itemHeight = this.$mainControl.find('.brtc-va-workspace-project-list-item').height() + 4;
        var sharedProjectHeight = sharedVisibleElements.length * itemHeight + titleHeight;
        var myProjectHeight = myVisibleElements.length * itemHeight + titleHeight;

        if (myProjectVisible && sharedProjectVisible) {
            if (sharedProjectHeight > this.$mainControl.find('.brtc-va-workspace-project-groups').height() * 0.3) {
                $(sharedProjectGroup).css('height', '30%');
                $(sharedProjectGroup).css('min-height', '30%');
                if (myProjectHeight > this.$mainControl.find('.brtc-va-workspace-project-groups').height() * 0.7) {
                    $(myProjectGroup).css('height', '70%');
                    $(myProjectGroup).css('max-height', '70%');
                } else {
                    $(myProjectGroup).css('height', myProjectHeight);
                    $(myProjectGroup).css('max-height', myProjectHeight);
                }
            } else {
                $(sharedProjectGroup).css('height', sharedProjectHeight);
                $(sharedProjectGroup).css('min-height', sharedProjectHeight);
                if (myProjectHeight > this.$mainControl.find('.brtc-va-workspace-project-groups').height() - sharedProjectHeight) {
                    myProjectHeight = this.$mainControl.find('.brtc-va-workspace-project-groups').height() - sharedProjectHeight;
                    $(myProjectGroup).css('height', myProjectHeight);
                    $(myProjectGroup).css('max-height', myProjectHeight);
                } else {
                    $(myProjectGroup).css('height', myProjectHeight);
                    $(myProjectGroup).css('max-height', myProjectHeight);
                }
            }
            // } else if (myProjectVisible && !sharedProjectVisible) {
        } else if (myProjectVisible) {
            $(sharedProjectGroup).css('height', titleHeight);
            $(sharedProjectGroup).css('min-height', titleHeight);
            if (myProjectHeight > this.$mainControl.find('.brtc-va-workspace-project-groups').height() - titleHeight) {
                myProjectHeight = this.$mainControl.find('.brtc-va-workspace-project-groups').height() - titleHeight;
                $(myProjectGroup).css('height', myProjectHeight);
                $(myProjectGroup).css('max-height', myProjectHeight);
            } else {
                $(myProjectGroup).css('height', myProjectHeight);
                $(myProjectGroup).css('max-height', myProjectHeight);
            }
            // } else if (!myProjectVisible && sharedProjectVisible) {
        } else if (sharedProjectVisible) {
            sharedProjectHeight = this.$mainControl.find('.brtc-va-workspace-project-groups').height() - titleHeight;
            $(sharedProjectGroup).css('height', sharedProjectHeight);
            $(sharedProjectGroup).css('min-height', sharedProjectHeight);

            $(myProjectGroup).css('height', titleHeight);
            $(myProjectGroup).css('max-height', titleHeight);
        } else {
            $(sharedProjectGroup).css('height', titleHeight);
            $(sharedProjectGroup).css('min-height', titleHeight);

            $(myProjectGroup).css('height', titleHeight);
            $(myProjectGroup).css('max-height', titleHeight);
        }

        $(myProjectGroup).find('.brtc-va-workspace-project-group-total-count').text(myVisibleElements.length);
        $(myProjectGroup).find('.brtc-va-workspace-project-list').perfectScrollbar('update');

        $(sharedProjectGroup).find('.brtc-va-workspace-project-group-total-count').text(sharedVisibleElements.length);
        $(sharedProjectGroup).find('.brtc-va-workspace-project-list').perfectScrollbar('update');
    };

    ProjectViewer.prototype._addProjectItem = function (projects) {
        var _this = this;
        var projectGroups = {
            my: {
                label: Brightics.locale.common.myProjects,
                projects: []
            },
            shared: {
                label: Brightics.locale.common.sharedProjects,
                projects: []
            }
        };

        projects.filter(function (obj) {
            if (obj.getCreator() === Brightics.VA.Env.Session.userId) {
                projectGroups['my'].projects.push(obj);
            } else {
                projectGroups['shared'].projects.push(obj);
            }
        });

        for (var i in projectGroups) {
            var $projectGroupControl = $('<div class = "brtc-va-workspace-project-group-area"></div>');
            var $projectGroupName = $('<div class="brtc-va-workspace-project-list-item-label brtc-va-workspace-project-list-title">' + projectGroups[i].label +
                '<span class="brtc-va-workspace-project-group-total-count"></span>' +
                '<div class="brtc-va-workspace-project-list-tool-item"><i class="fa fa-chevron-up fa-chevron-down" aria-hidden="true"></i></div>' +
                '</div>');
            var $projectAdd = $('<div class="brtc-va-workspace-project-new" title="' + Brightics.locale.common.createNewProject +'"></div>');
            var $projectImport = $('<div class="brtc-va-workspace-project-import" title="' + Brightics.locale.common.importProject +'"></div>');
            var $projectList = $('<div class="brtc-va-workspace-project-list">');

            $projectGroupControl.append($projectGroupName);
            $projectGroupControl.addClass(i);
            $projectGroupControl.append($projectList);

            this.$mainControl.find('.brtc-va-workspace-project-groups').append($projectGroupControl);
            if (i === 'my') {
                $projectGroupControl.append($projectAdd);
                $projectGroupControl.append($projectImport);

                $projectAdd.click(function () {
                    _this.openNewProjectDialog();
                });

                $projectImport.click(function () {
                    _this.openImportProjectDialog();
                });
            }

            $projectGroupName.find('.brtc-va-workspace-project-group-total-count').text(projectGroups[i].projects.length);
            $projectGroupName.find('.brtc-va-workspace-project-list-tool-item>i').toggleClass('fa-chevron-down');
            $projectGroupName.find('.brtc-va-workspace-project-list-tool-item').click(function (e) {
                e.preventDefault();

                if ($(this).find('i').hasClass('fa-chevron-down')) {
                    // expand
                    $(this).closest('.brtc-va-workspace-project-group-area').find('.brtc-va-workspace-project-list').show();
                } else {
                    // collpase
                    $(this).closest('.brtc-va-workspace-project-group-area').find('.brtc-va-workspace-project-list').hide();
                }
                _this.renderProjectListContainer();
                $(this).find('i').toggleClass('fa-chevron-down');
            });

            $projectGroupName.find('.brtc-va-workspace-project-list-tool-item').mouseover(function () {
                if ($(this).find('i').hasClass('fa-chevron-down')) {
                    $(this).attr('title', 'Expand');
                } else {
                    $(this).attr('title', 'Collapse');
                }
            });

            $projectGroupName.find('.brtc-va-workspace-project-group-total-count').text(projectGroups[i].projects.length);

            for (var j in projectGroups[i].projects) {
                var project = projectGroups[i].projects[j];
                var $projectItem = $('<div class="brtc-va-workspace-project-list-item" id="' + project.getProjectId() + '"></div>');
                var $projectNewArrive = $('<div class="brtc-va-worksapce-project-list-item-new"></div>');
                var $projectLabel = $('<div class="brtc-va-workspace-project-list-item-label"></div>');
                var $projectModelInfo = $('<div class="brtc-va-workspace-project-list-item-model"></div>');
                $projectItem.append($projectNewArrive);
                $projectItem.append($projectLabel);
                $projectItem.append($projectModelInfo);

                $projectLabel.text(project.getLabel());
                $projectLabel.attr('title', project.getLabel());
                $projectModelInfo.append('<span>' + Brightics.locale.common.models + '</span><span>' + project.getModelCount() + '</span><span>' + Brightics.locale.common.reports + '</span><span>' + project.getReportCount() + '</span>');
                $projectList.append($projectItem);
                if (Brightics.VA.Core.Utils.CommonUtils.getTimeDifferenceFromNow(project.getCreateTime()) < 24) {
                    $projectNewArrive.show();
                }

                $projectItem.click(function () {
                    _this.selectProject($(this).attr('id'));
                });
            }

            this.renderProjectListContainer();
            $projectList.perfectScrollbar();
        }
    };

    ProjectViewer.prototype.clearProjectItem = function () {
        this.$mainControl.find('.brtc-va-workspace-model-list-area').empty();
    };

    ProjectViewer.prototype.fillProjectList = function (selectionProjectId, fileType, callback) {
        var _this = this,
            projectId = selectionProjectId || this.$mainControl.find('.brtc-va-workspace-project-list-item-selected').attr('id');

        var sortByProjectName = function (a, b) {
            var label1 = a.getLabel().toLowerCase();
            var label2 = b.getLabel().toLowerCase();
            if (label1 < label2) return -1;
            if (label1 > label2) return 1;
            return 0;
        };

        Studio.getResourceManager().fetchProjects().then(function (projects) {
            projects.sort(sortByProjectName);
            _this._clearProjectList();
            _this._addProjectItem(projects);
            // Delete하고 난 후 Project가 있는지 검사.
            var projectList = $.grep(projects, function (project) {
                return project.getProjectId() === projectId;
            });
            if (projectList.length === 0) {
                if (projects.length > 0) {
                    _this.selectProject(_this.$mainControl.find('.brtc-va-workspace-project-list-item')[0].id);
                } else {
                    _this.clearProjectItem();
                }
            } else if (projectId) {
                _this.selectProject(projectId, fileType, callback);
            } else if (projects.length > 0) {
                _this.selectProject(projects[0].getProjectId());
            }
        }).catch(function (err) {
            console.error(err);
        });
    };

    ProjectViewer.prototype.selectProject = function (projectId, fileType, callback) {
        var $container = this.$mainControl.find('.brtc-va-workspace-project-list-area');
        if ($container.find('.brtc-va-workspace-project-list-item.brtc-va-workspace-project-list-item-selected').attr('id') == projectId) return;

        $container.find('.brtc-va-workspace-project-list-item').removeClass('brtc-va-workspace-project-list-item-selected');
        $container.find('#' + projectId).addClass('brtc-va-workspace-project-list-item-selected');
        this.renderModelList(projectId, fileType, callback);
    };

    ProjectViewer.prototype.renderModelList = function (projectId, fileType, callback) {
        this._fillModelList(projectId, fileType, callback);
    };

    ProjectViewer.prototype.openNewFileDialog = function (projectId, fileType) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.NewFileDialog(this.$mainControl, {
            project: Studio.getResourceManager().getProject(projectId),
            fileType: fileType,
            close: function (result) {
                if (result.OK) {
                    Studio.getResourceManager().fetchFiles(projectId).catch().then(function () {
                        _this.selectProject(projectId);
                        _this.result = {
                            selectedProject: projectId,
                            selectedFiles: [result.selectedFile.getFileId()],
                            fileListByProject: Studio.getResourceManager().getFiles(projectId)
                        };
                        _this.performFinish();
                    });
                }
            },
            title: fileType === 'Model' ? Brightics.locale.common.createNewData : Brightics.locale.common.createNewVisual,
        });
    };

    ProjectViewer.prototype.openImportDialog = function (projectId, fileType) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.ImportDialog(this.$mainControl, {
            resourceManager: Studio.getResourceManager(),
            fileType: fileType,
            project: Studio.getResourceManager().getProject(projectId),
            close: function (result) {
                if (result.OK) {
                    Studio.getResourceManager().fetchFiles(projectId).catch().then(function () {
                        _this.result = {
                            selectedProject: projectId,
                            selectedFiles: result.selectedFiles
                        };
                        _this.fillProjectList(projectId);
                    });
                }
            }
        });
    };

    ProjectViewer.prototype._clearModelList = function (projectId) {
        var $container = this.$mainControl.find('.brtc-va-workspace-model-list-area');
        $container.find('.brtc-va-workspace-model-list-header').remove();
        $container.find('.brtc-va-workspace-model-list-content').remove();
    };

    ProjectViewer.prototype._createModelContainer = function (projectId) {
        var _this = this,
            project = Studio.getResourceManager().getProject(projectId);

        var $container = this.$mainControl.find('.brtc-va-workspace-model-list-area');
        $container.attr('project-id', projectId);
        var $modelContainer = $('' +
            '<div class="brtc-va-workspace-model-list-header">' +
            '   <div class="brtc-va-workspace-model-list-title"></div>' +
            '   <div class="brtc-va-workspace-model-list-edit"></div>' +
            '   <div class="brtc-va-workspace-model-list-author">' +
            '       <div class="brtc-style-editor-toolitem brtc-style-s-editor-toolitem" title="' + Brightics.locale.common.info + '" item-type="model-info" />' +
            '       <span>' + Brightics.locale.common.createdon + '</span><span>' + moment(project.getCreateTime()).format('YYYY-MM-DD HH:mm:ss') + '</span>' +
            '       <span>' + Brightics.locale.common.createdby + '</span><span></span>' +
            '   </div>' +
            '   <div class="brtc-va-workspace-model-list-hashtag"></div>' +
            '   <div class="brtc-va-workspace-model-list-type">' +
            '       <div class="brtc-va-workspace-model-list-type-item model"><div>' + Brightics.locale.common.models + '</div></div>' +
            '       <div class="brtc-va-workspace-model-list-type-item report"><div>' + Brightics.locale.common.reports + '</div><div class="addedcount"></div></div>' +
            '       <div class="brtc-va-workspace-model-list-toolbar">' +
            '           <div class="brtc-va-workspace-model-list-select"></div>' +
            '          <div class="brtc-style-workspace-toolitem brtc-style-s-workspace-toolitem" title="'+Brightics.locale.common.bulkEdit+'" item-type="bulk-edit"></div>' +
            '       </div>' +
            '   </div>' +
            '</div>' +
            '<div class="brtc-va-workspace-model-list-content" id="' + projectId + '" item-type="model">' +
            '</div>');

        $modelContainer.find('.brtc-va-workspace-model-list-title').attr('title', project.getLabel()).text(project.getLabel());
        $modelContainer.find('.brtc-va-workspace-model-list-author > span:nth-child(5)').text(project.getCreator());
        $container.append($modelContainer);

        $container.find('.brtc-style-editor-toolitem[item-type=model-info]').click(function (event) {
            _this.closeInfoDialog();
            _this.openInfoDialog(event);
        });

        $container.find('.brtc-va-workspace-model-list-select').jqxCheckBox({
            theme: Brightics.VA.Env.Theme,
            width: 23,
            height: 24,
            boxSize: 17,
            checked: false
        });
        $container.find('.brtc-va-workspace-model-list-select').on('checked', function () {
            var type = _this.getSelectedTabType();
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({locked: false});
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({checked: true});
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({locked: true});
        });
        $container.find('.brtc-va-workspace-model-list-select').on('unchecked', function () {
            var type = _this.getSelectedTabType();
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({locked: false});
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({checked: false});
            _this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .jqx-checkbox').jqxCheckBox({locked: true});
        });
        $container.find('.brtc-style-workspace-toolitem[item-type=bulk-edit]').click(function () {
            _this.$ctxMenu.attr('project-id', $(this).closest('.brtc-va-workspace-model-list-area').attr('project-id'));
            _this.$ctxMenu.attr('menu-type', 'bulk-edit');
            _this.$ctxMenu.removeAttr('file-id');

            _this.$ctxMenu.find('li').css('display', 'none');
            _this.$ctxMenu.find('li[action=delete]').css('display', 'block');
            _this.$ctxMenu.find('li[action=duplicate]').css('display', 'none');
            _this.$ctxMenu.find('li[action=export]').css('display', 'block');
            _this.$ctxMenu.find('li[type=separator]:eq(0)').css('display', 'block');

            var left = $(this).offset().left + $(this).width() - 200 - 2;
            var top = $(this).offset().top + $(this).height();

            _this.$ctxMenu.jqxMenu('open', left, top);
            $('.brtc-va-workspace-model-list-area').on('scroll', _this.ctxMenuCloseHandler);
            $(window).on('resize', _this.ctxMenuCloseHandler);
        });

        $container.find('.brtc-va-workspace-model-list-edit').click(function () {
            _this.$ctxMenu.attr('project-id', $(this).closest('.brtc-va-workspace-model-list-area').attr('project-id'));
            _this.$ctxMenu.attr('menu-type', 'project-edit');
            _this.$ctxMenu.removeAttr('file-id');

            _this.$ctxMenu.find('li').css('display', 'none');
            _this.$ctxMenu.find('li[action=edit]').css('display', 'block');
            _this.$ctxMenu.find('li[action=delete]').css('display', 'block');
            _this.$ctxMenu.find('li[action=export]').css('display', 'block');
            _this.$ctxMenu.find('li[action=members]').css('display', 'block');
            _this.$ctxMenu.find('li[type=separator]').css('display', 'block');

            var left = $(this).offset().left + $(this).width() - 200 - 2;
            var top = $(this).offset().top + $(this).height();

            _this.$ctxMenu.jqxMenu('open', left, top);
            $('.brtc-va-workspace-model-list-area').on('scroll', _this.ctxMenuCloseHandler);
            $(window).on('resize', _this.ctxMenuCloseHandler);
        });

        $container.find('.brtc-va-workspace-model-list-type-item').click(function () {
            $container.find('.brtc-va-workspace-model-list-type-item').removeClass('selected');
            $(this).addClass('selected');
            if ($(this).hasClass('model')) {
                $container.find('.brtc-va-workspace-model-list-content').removeClass('report');
                $container.find('.brtc-va-workspace-model-list-content').addClass('model');
            } else {
                $container.find('.brtc-va-workspace-model-list-content').removeClass('model');
                $container.find('.brtc-va-workspace-model-list-content').addClass('report');
            }
            _this.$mainControl.find('.brtc-va-workspace-model-list-content').scrollTop(0);
            _this.$mainControl.find('.brtc-va-workspace-model-list-content').perfectScrollbar('update');
            _this._refreshCheckBoxStatus();
        });

        var $contents = this.$mainControl.find('#' + projectId + '.brtc-va-workspace-model-list-content');
        var $newModelItem = $('' +
            '<div class="brtc-va-workspace-model-list-cell model">' +
            '   <div class="brtc-va-workspace-model-list-item brtc-va-workspace-model-list-item-new" model-type="newmodel">' +
            '       <div class="brtc-va-workspace-model-list-item-new-title">' + Brightics.locale.common.createModel + '</div>' +
            '       <div class="brtc-va-workspace-model-list-item-new-content">' +
            '          <div class="brtc-va-workspace-model-list-item-new-item new">' +
            '               <div class="brtc-va-workspace-model-list-item-new-item-icon new"></div>' +
            '              <div>' + Brightics.locale.common.new + '</div>' +
            '           </div>' +
            '           <div class="brtc-va-workspace-model-list-item-new-item splitter"></div>' +
            '          <div class="brtc-va-workspace-model-list-item-new-item import">' +
            '               <div class="brtc-va-workspace-model-list-item-new-item-icon import"></div>' +
            '              <div>' + Brightics.locale.common.import + '</div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');

        var $newReportItem = $('' +
            '<div class="brtc-va-workspace-model-list-cell report">' +
            '   <div class="brtc-va-workspace-model-list-item brtc-va-workspace-model-list-item-new" model-type="newreport">' +
            '       <div class="brtc-va-workspace-model-list-item-new-title">' + Brightics.locale.common.createReport + '</div>' +
            '       <div class="brtc-va-workspace-model-list-item-new-content">' +
            '          <div class="brtc-va-workspace-model-list-item-new-item new">' +
            '               <div class="brtc-va-workspace-model-list-item-new-item-icon new"></div>' +
            '              <div>' + Brightics.locale.common.new + '</div>' +
            '           </div>' +
            '           <div class="brtc-va-workspace-model-list-item-new-item splitter"></div>' +
            '          <div class="brtc-va-workspace-model-list-item-new-item import">' +
            '               <div class="brtc-va-workspace-model-list-item-new-item-icon import"></div>' +
            '              <div>' + Brightics.locale.common.import + '</div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>');


        $newModelItem.find('.brtc-va-workspace-model-list-item-new-item.new').click(function () {
            _this.openNewFileDialog(projectId, 'Model');
        });

        $newReportItem.find('.brtc-va-workspace-model-list-item-new-item.new').click(function () {
            _this.openNewFileDialog(projectId, 'Report');
        });

        $newModelItem.find('.brtc-va-workspace-model-list-item-new-item.import').click(function () {
            _this.openImportDialog(projectId, 'Model');
        });

        $newReportItem.find('.brtc-va-workspace-model-list-item-new-item.import').click(function () {
            _this.openImportDialog(projectId, 'Report');
        });

        $contents.append($newModelItem);
        $contents.append($newReportItem);
    };

    ProjectViewer.prototype.closeInfoDialog = function () {
        if (this.infoDialog) {
            this.infoDialog.close();
        }
        this.infoDialog = null;
    };

    ProjectViewer.prototype.openInfoDialog = function (event) {
        var projectId = this.$mainControl.find('.brtc-va-workspace-model-list-area').attr('project-id');
        var project = Studio.getResourceManager().getProject(projectId);

        this.infoDialog = new Brightics.VA.Core.Dialogs.InfoDialog(this.$mainControl, {
            project: project,
            appendTo: this.$mainControl,
            modal: true,
            title: Brightics.locale.common.projectInformation
        });
    };

    ProjectViewer.prototype._addModelItem = function (projectId, files) {
        var _this = this,
            $contents = this.$mainControl.find('#' + projectId + '.brtc-va-workspace-model-list-content');
        for (var i in files) {
            var file = files[i];

            var modelType = file.getContents().type ? file.getContents().type : 'data';
            var modelClass = modelType == 'visual' ? 'report' : 'model';
            var $item = $('' +
                '<div class="brtc-va-workspace-model-list-cell ' + modelClass + '">' +
                '   <div class="brtc-va-workspace-model-list-item" id="' + file.getFileId() + '" model-type="' + modelType + '">' +
                '       <div class="brtc-va-workspace-model-list-item-header">' +
                '           <div class="brtc-va-workspace-model-list-item-icon"></div>' +
                '           <div class="brtc-va-workspace-model-list-item-type brtc-style-width-minus-250">' + modelTypeLabel[modelType] + '</div>' +
                '           <div class="brtc-va-workspace-model-list-item-version"></div>' +
                '           <div class="brtc-va-workspace-model-list-item-select" id="' + file.getFileId() + '" model-type="' + modelType + '"></div>' +
                '           <div class="brtc-va-workspace-model-list-item-edit"></div>' +
                '       </div>' +
                '       <div class="brtc-va-workspace-model-list-item-label"></div>' +
                '       <div class="brtc-va-workspace-model-list-item-updatetime">' +
                '           <div>' + Brightics.locale.common.updatedon + '</div><div>' + moment(file.getUpdateTime()).format('YYYY-MM-DD HH:mm:ss') + '</div><div>' + Brightics.locale.common.updatedby + '</div><div></div>' +
                '       </div>' +
                '       <div class="brtc-va-workspace-model-list-item-createtime">' +
                '           <div>' + Brightics.locale.common.createdon + '</div><div>' + moment(file.getCreateTime()).format('YYYY-MM-DD HH:mm:ss') + '</div><div>' + Brightics.locale.common.createdby + '</div><div></div>' +
                '       </div>' +
                '       <div class="brtc-va-workspace-model-list-item-description">' + file.getDescription() +
                '       </div>' +
                '       <div class="brtc-va-workspace-model-list-item-open">' + Brightics.locale.common.open + '</div>' +
                '   </div>' +
                '</div>'
            );
            if (_this.chartContentAddedReport[projectId] && _this.chartContentAddedReport[projectId][file.id]) $item.find('.brtc-va-workspace-model-list-item-type').addClass('chartadded');
            $item.find('.brtc-va-workspace-model-list-item-label').attr('title', file.getLabel()).text(file.getLabel());
            $item.find('.brtc-va-workspace-model-list-item-updatetime div:nth-child(4)').text(file.getUpdater());
            $item.find('.brtc-va-workspace-model-list-item-createtime div:nth-child(4)').text(file.getCreator());
            $item.find('.brtc-va-workspace-model-list-item-version').text((file.getFromVersion()) ? ((file.getFromVersion() != '0.0') ? 'From ' + file.getFromVersion() : '') : '');
            $item.find('.brtc-va-workspace-model-list-item-type').css('cursor', 'pointer');
            $item.find('.brtc-va-workspace-model-list-item-icon').css('cursor', 'pointer');
            $item.hover(function () {
                $(this).addClass('brtc-va-workspace-model-list-cell-hover');
            }, function () {
                $(this).removeClass('brtc-va-workspace-model-list-cell-hover');
            });
            $item.find('.brtc-va-workspace-model-list-item-open').click(function () {
                _this.result = {
                    selectedProject: projectId,
                    selectedFiles: [$(this).parent().attr('id')],
                    fileListByProject: Studio.getResourceManager().getFiles(projectId)
                };
                _this.performFinish();
            });

            $item.find('.brtc-va-workspace-model-list-item-select').jqxCheckBox({
                theme: Brightics.VA.Env.Theme,
                width: 23,
                height: 24,
                boxSize: 17,
                checked: false,
                locked: true
            });
            // $item.find('.brtc-va-workspace-model-list-item-select').css('visibility', 'hidden');
            $item.find('.brtc-va-workspace-model-list-item-select').on('change', function () {
                _this._refreshCheckBoxStatus();
            });
            $item.find('.brtc-va-workspace-model-list-item-header').on('click', function (event) {
                if ($(this).find('.brtc-va-workspace-model-list-item-select').css('visibility') == 'hidden') return;
                $(this).find('.brtc-va-workspace-model-list-item-select').jqxCheckBox({locked: false});
                $(this).find('.brtc-va-workspace-model-list-item-select').jqxCheckBox('toggle');
                $(this).find('.brtc-va-workspace-model-list-item-select').jqxCheckBox({locked: true});
            });

            $item.find('.brtc-va-workspace-model-list-item-edit').click(function (event) {
                event.stopPropagation();

                var projectId = $(this).closest('.brtc-va-workspace-model-list-content').attr('id'),
                    fileId = $(this).closest('.brtc-va-workspace-model-list-item').attr('id');
                var file = Studio.getResourceManager().getFile(projectId, fileId),
                    type = file.getContents().type || 'data';

                _this.$ctxMenu.attr('menu-type', 'file-edit');
                _this.$ctxMenu.attr('project-id', projectId);
                _this.$ctxMenu.attr('file-id', fileId);

                _this.$ctxMenu.find('li').css('display', 'none');
                _this.$ctxMenu.find('li[action=edit]').css('display', 'block');
                _this.$ctxMenu.find('li[action=delete]').css('display', 'block');
                if (type == 'visual') _this.$ctxMenu.find('li[type=separator]:eq(0)').css('display', 'block');
                else _this.$ctxMenu.find('li[type=separator]').css('display', 'block');

                _this._configureCtxMenuVisible(type);

                var left = $(this).offset().left + $(this).width() - 200 - 2;
                var top = $(this).offset().top + $(this).height();

                _this.$ctxMenu.jqxMenu('open', left, top);
                $('.brtc-va-workspace-model-list-content').on('scroll', _this.ctxMenuCloseHandler);
                $(window).on('resize', _this.ctxMenuCloseHandler);
            });
            $contents.append($item);
        }
    };

    ProjectViewer.prototype._refreshCheckBoxStatus = function () {
        var type = this.getSelectedTabType();
        var checkBoxes = this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .brtc-va-workspace-model-list-item-select.jqx-checkbox');
        var selected = this.$contentsContainer.find('.brtc-va-workspace-model-list-cell.' + type + ' .brtc-va-workspace-model-list-item-select.jqx-checkbox-checked');

        if (selected.length == 0) this.$contentsContainer.find('.brtc-va-workspace-model-list-select').jqxCheckBox({checked: false});
        else if (selected.length == checkBoxes.length) this.$contentsContainer.find('.brtc-va-workspace-model-list-select').jqxCheckBox({checked: true});
        else this.$contentsContainer.find('.brtc-va-workspace-model-list-select').jqxCheckBox('indeterminate');
    };

    ProjectViewer.prototype._configureCtxMenuVisible = function (modelType) {
        var _this = this;

        Brightics.VA.Core.Interface.ProjectContextMenuList[modelType].forEach(function (menuName) {
            _this.$ctxMenu.find('li[action=' + menuName + ']').css('display', 'block');
        });
        if ($.inArray('duplicate', Brightics.VA.Core.Interface.ProjectContextMenuList[modelType]) === -1) {
            this.$ctxMenu.find('li[type=separator]:eq(0)').css('display', 'none');
        }
        if ($.inArray('version', Brightics.VA.Core.Interface.ProjectContextMenuList[modelType]) === -1) {
            this.$ctxMenu.find('li[type=separator]:eq(1)').css('display', 'none');
        }
    };

    ProjectViewer.prototype._fillModelList = function (projectId, fileType, callback) {
        var _this = this;
        Studio.getResourceManager().fetchFiles(projectId).then(function (files) {
            _this._clearModelList(projectId);
            _this._createModelContainer(projectId);
            if (fileType && fileType === 'visual') _this.$mainControl.find('.brtc-va-workspace-model-list-type-item.report').click();
            else _this.$mainControl.find('.brtc-va-workspace-model-list-type-item.model').click();
            if (_this.chartContentAddedReport[projectId]) {
                var modelCount = Object.keys(_this.chartContentAddedReport[projectId]).length;
                _this.$mainControl.find('.brtc-va-workspace-model-list-type-item.report .addedcount').text(modelCount);
            } else {
                _this.$mainControl.find('.brtc-va-workspace-model-list-type-item.report .addedcount').hide();
            }
            _this._addModelItem(projectId, files);

            // _this.$mainControl.find('.brtc-va-workspace-model-list-count').html('Models <span>' + files.length + '</span>');
            _this.$mainControl.find('.brtc-va-workspace-model-list-content').perfectScrollbar();
            // 프로젝트를 선택할 때 이전 프로젝트의 모델리스트가 많아서 스크롤이 생긴 경우에 스크롤이 안 사라지는 버그 해결을 위해 update 를 추가 실행
            _this.$mainControl.find('.brtc-va-workspace-model-list-content').perfectScrollbar('update');
            if (callback && typeof callback == 'function') callback();
            if (_this.$el) _this.$el.remove();
        })
            .catch(function (err) {
                console.error(err);
                throw err;
            });
    };

    ProjectViewer.prototype.performFinish = function () {
        if (typeof this.options.close == 'function') {
            this.options.close(this.result);
        }
    };

    ProjectViewer.prototype.openNewProjectDialog = function () {
        var _this = this;
        var $dialog = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-newprojectdialog">' +
            // '   <div class="brtc-va-dialogs-header"><div class="brtc-va-dialogs-header-title">Create Project</div></div>' +
            '   <div class="brtc-va-dialogs-body">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '           <div class="brtc-va-dialogs-contents-label-main">' + Brightics.locale.common.name + '</div>' +
            '           <input type="text" class="brtc-va-dialogs-newfiledialog-name-input" maxlength="80"/>' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="' + Brightics.locale.common.ok + '" />' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-cancel" value="' + Brightics.locale.common.cancel + '" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        $('body').append($dialog);

        $dialog.dialog({
            theme: Brightics.VA.Env.Theme,
            title: Brightics.locale.common.createProject,
            width: 400,
            height: 200,
            modal: true,
            resizable: false,
            open: function () {
                $('.ui-dialog .ui-dialog-titlebar', $(this).parent()).css('border-bottom', '1px solid #d9d9d9');

                var $projectName = $dialog.find('.brtc-va-dialogs-contents > input');
                $projectName.jqxInput({
                    theme: Brightics.VA.Env.Theme
                });
                $projectName.jqxInput('selectAll');

                $dialog.find('.brtc-va-dialogs-buttonbar-ok').jqxButton({
                    theme: Brightics.VA.Env.Theme
                });
                $dialog.find('.brtc-va-dialogs-buttonbar-cancel').jqxButton({
                    theme: Brightics.VA.Env.Theme
                });
                $dialog.find('.brtc-va-dialogs-buttonbar-ok').click(function () {
                    if ($projectName.val().trim() === '') {
                        Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(Brightics.locale.sentence.S0020);
                        return;
                    }
                    _this.doCreateProject($projectName.val());
                    $dialog.dialog('close');
                });

                $dialog.find('.brtc-va-dialogs-buttonbar-cancel').click(function () {
                    $dialog.dialog('close');
                });

                $dialog.find('.brtc-va-dialogs-contents > input').focus();
            }
        });

        $dialog.attr('name', 'Create Project');
        $dialog.on('close', function (event) {
            $dialog.dialog('destroy');
            $dialog.remove();
        });
    };

    ProjectViewer.prototype.openImportProjectDialog = function () {
        var _this = this;
        new Brightics.VA.Core.Dialogs.ImportProjectDialog(this.$mainControl, {
            close: function (result) {
                if (result.OK) {
                    _this.$mainControl.trigger('project:create', [{projectId: result.projectId}]);
                    _this.fillProjectList(result.projectId);
                }
            }
        });
    };

    // Create Deploy Success POPUP
    ProjectViewer.prototype.doCreateSuccessPopup = function (data, targetServer, callback) {
        var $dialog = $('' +
            '<div class="brtc-va-dialogs-main brtc-va-dialogs-newprojectdialog">' +
            '   <div class="brtc-va-dialogs-body" style="overflow: hidden;">' +
            '       <div class="brtc-va-dialogs-contents">' +
            '           <div class="brtc-va-dialogs-row-flex-layout" style="margin-bottom: 5px !important;">' +
            '               <div class="brtc-va-dialogs-contents-label-main">Deploy ID</div>' +
            '                   <div class="target-id" style="margin-top: 5px;"></div>' +
            '           </div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout" style="margin-bottom: 5px !important;">' +
            '               <div class="brtc-va-dialogs-contents-label-main">Version</div>' +
            '                   <div class="target-version" style="margin-top: 5px;"></div>' +
            '           </div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout" style="margin-bottom: 5px !important;">' +
            '               <div class="brtc-va-dialogs-contents-label-main">Variable Flag</div>' +
            '                   <div class="target-gvyn" style="margin-top: 5px;"></div>' +
            '           </div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout" style="margin-bottom: 5px !important;">' +
            '               <div class="brtc-va-dialogs-contents-label-main">Target Store</div>' +
            '                   <div class="target-store brtc-va-text-ellipsis" style="margin-top: 5px;"></div>' +
            '           </div>' +
            '           <div class="brtc-va-dialogs-row-flex-layout" style="margin-bottom: 5px !important;">' +
            '               <div class="brtc-va-dialogs-contents-label-main">Name</div>' +
            '                   <div class="target-name brtc-va-text-ellipsis" style="margin-top: 5px;"></div>' +
            '           </div>' +
            '       </div>' +
            '       <div class="brtc-va-dialogs-buttonbar">' +
            '           <input type="button" class="brtc-va-dialogs-buttonbar-ok" value="OK" />' +
            '       </div>' +
            '   </div>' +
            '</div>');
        $('body').append($dialog);

        $dialog.find('.brtc-va-dialogs-buttonbar-ok').jqxButton({
            theme: Brightics.VA.Env.Theme
        });
        $dialog.find('.brtc-va-dialogs-buttonbar-ok').click(function () {
            $dialog.dialog('destroy');
            $dialog.remove();
            if (callback) callback();
        });
        $dialog.dialog({
            theme: Brightics.VA.Env.Theme,
            title: 'Success',
            width: 400,
            height: 310,
            modal: true,
            resizable: false,
            open: function () {
                var $targetId = $dialog.find('.target-id');
                var $targetName = $dialog.find('.target-name');
                var $targetVersion = $dialog.find('.target-version');
                var $targetStore = $dialog.find('.target-store');
                var $targetGvYn = $dialog.find('.target-gvyn');

                $targetId.text(data.deployId);
                $targetName.text(data.title);
                $targetName.attr('title', data.title);
                $targetVersion.text(data.version);
                $targetStore.text(targetServer);
                $targetStore.attr('title', targetServer);
                $targetGvYn.text(data.gvYn);
            }
        });

        $dialog.on('close', function (event) {
            $dialog.dialog('destroy');
            $dialog.remove();

            if (callback) callback();
        });

        return true;
    };

    ProjectViewer.prototype.doCreateProject = function (name) {
        var _this = this;
        // var project = {
        //     id: Brightics.VA.Core.Utils.IDGenerator.project.id(),
        //     label: name,
        //     description: '',
        //     creator: Brightics.VA.Env.Session.userId
        // };

        var project = new Brightics.VA.Vo.Project();
        project.setProjectId(Brightics.VA.Core.Utils.IDGenerator.project.id());
        project.setLabel(name);
        project.setDescription('');
        project.setCreator(Brightics.VA.Env.Session.userId);

        Studio.getResourceManager().addProject(project).then(function () {
            _this.$mainControl.trigger('project:create', [{projectId: project.getProjectId()}]);
            _this.fillProjectList(project.getProjectId());
        }).catch(function (err) {
            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
        });
    };

    ProjectViewer.prototype.openMemberManagementDialog = function (projectId) {
        var _this = this;
        new Brightics.VA.Core.Dialogs.MemberManagementDialog(this.$mainControl, {
            projectId: projectId,
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    var type = _this.getSelectedTabType() == 'model' ? 'model' : 'visual';
                    _this.fillProjectList(projectId, type);
                }
            },
            title: Brightics.locale.common.memberManagement,
            appendTo: _this.$parent
        });
    };

    ProjectViewer.prototype.exportProject = function (projectId) {
        var rs = Studio.getResourceService();
        return rs.exportProject(projectId)
            .then(function (json) {
                Brightics.VA.Core.Utils.CommonUtils.downloadJsonFile(
                    JSON.stringify(json),
                    json.data.label || 'untitled'
                );
            })
            .catch(function (err) {
                Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
            });
    };

    ProjectViewer.prototype.openEditProjectDialog = function (projectId) {
        var _this = this;
        var project = Studio.getResourceManager().getProject(projectId);
        var dlg = new Brightics.VA.Core.Dialogs.EditResourceDialog(this.$mainControl, {
            title: Brightics.locale.common.editProject,
            label: project.getLabel(),
            description: project.getDescription(),
            close: function (dialogResult) {
                if (dialogResult.OK) {
                    project.setLabel(dialogResult.label);
                    project.setDescription(dialogResult.description);
                    _this.doEditProject(project).catch(function (err) {
                        if (err.status === 400) {
                            Brightics.VA.Core.Utils.WidgetUtils.openBadRequestErrorDialog(err);
                        }
                        project.setLabel(dlg.options.label);
                        project.setDescription(dlg.options.description);
                        _this.fillProjectList(project.getProjectId());
                    });
                }
            }
        });
    };

    ProjectViewer.prototype.doEditProject = function (project) {
        var _this = this;
        project.setUpdater(Brightics.VA.Env.Session.userId);

        return Studio.getResourceManager().updateProject(project).then(function () {
            _this.$mainControl.trigger('project:change', [{projectId: project.getProjectId()}]);
            _this.fillProjectList(project.getProjectId());
        });
    };

    ProjectViewer.prototype.deleteProject = function (projectId) {
        var _this = this;
        var project = Studio.getResourceManager().getProject(projectId);

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                var files = Studio.getResourceManager().getFiles(projectId);
                var fileIds = [];
                for (var i in files) {
                    fileIds.push(files[i].getFileId());
                }
                _this.deleteAlluxioFile(fileIds);
                Studio.getResourceManager().deleteProject(projectId).then(function () {
                    _this.$mainControl.trigger('project:delete', [{projectId: projectId}]);
                    _this.fillProjectList();
                });
            }
        };

        var message = 'Are you sure you want to delete "' + project.getLabel() + '"?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, closeHandler);
    };

    ProjectViewer.prototype.deleteAlluxioFile = function (files) {
        Brightics.VA.Core.GarbageCollector.immediatelyClearData(files);
    };

    ProjectViewer.prototype.deleteFiles = function (projectId, selected) {
        var _this = this;
        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                var deleteFiles = [];
                var file = Studio.getResourceManager().getFile(projectId, selected[0]);

                for (var i in selected) {
                    deleteFiles.push(new Promise(function (resolve, reject) {
                        Studio.getResourceManager().deleteFile(projectId, selected[i]).then(function (fileId) {
                            _this.$mainControl.trigger('file:delete', [{projectId: projectId, fileId: fileId}]);
                            resolve(fileId);
                        }).catch(function (err) {
                            reject(err.responseJSON);
                        });
                    }));
                }

                Promise.all(deleteFiles).then(function (files) {
                    _this.deleteAlluxioFile(files);
                }).catch(function (error) {
                    Brightics.VA.Core.Utils.WidgetUtils.openErrorDialog(error);
                }).then(function () {
                    _this._clearModelList(projectId);
                    _this.fillProjectList(projectId, file.getContents().type);
                });
            }
        };

        var message = 'Are you sure you want to delete the ' + selected.length + ' ' + this.getSelectedTabType() + '(s)?';
        Brightics.VA.Core.Utils.WidgetUtils.openConfirmDialog(message, closeHandler);
    };

    ProjectViewer.prototype.duplicateFiles = function (projectId, selected) {
        var _this = this;

        var closeHandler = function (dialogResult) {
            if (dialogResult.OK) {
                _this.fillProjectList(dialogResult.projectId, _this.getSelectedTabType() == 'model' ? 'model' : 'visual');
            }
        };
        var title = this.getSelectedTabType() === 'model' ? 'Duplicate Model' : 'Duplicate Report';
        var files = [];
        for (var i in selected) {
            files.push(Studio.getResourceManager().getFile(projectId, selected[i]));
        }
        new Brightics.VA.Core.Dialogs.DuplicateModelDialog($('body'), {
            files: files,
            title: title,
            resourceManager: Studio.getResourceManager(),
            close: closeHandler,
            width: 600,
            height: 300,
            minWidth: 600,
            minHeight: 300,
            maxWidth: 800,
            maxHeight: 400,
            resizable: false
        });
    };

    // TODO : 리팩토링 필요
    ProjectViewer.prototype.exportFiles = function (projectId, selected, isSingle) {
        var _this = this;
        var closeHandler = function (dialogResult) {
            if (!dialogResult.OK) return;
            _.forEach(selected, function (fid) {
                var file = Studio.getResourceManager().getFile(projectId, fid);
                Studio.getResourceService()
                    .exportJSON(file.getFileId(), projectId, dialogResult.OPTION)
                    .then(function (jsons) {
                        console.log(jsons);
                        var commonUtils = Brightics.VA.Core.Utils.CommonUtils;
                        commonUtils.downloadJsonFile(JSON.stringify(jsons), file.getLabel());
                        return true;
                    })
                    .catch(console.error);
            });
        };

        let contentText;

        if (isSingle) {
            if (Brightics.VA.SettingStorage.getCurrentLanguage() === 'ko') {
                contentText = Studio.getResourceManager().getFile(projectId, selected[0]).getLabel() + ' ' + Brightics.locale.sentence.S0025;
            } else {
                contentText = Brightics.locale.sentence.S0025 + ' ' + Studio.getResourceManager().getFile(projectId, selected[0]).getLabel() + '?'
            }
        } else {
            contentText = 'Are you sure you want to export the ' + selected.length + ' model(s)?';
        }

        var visualCnt = 0;
        for (var j in selected) {
            var file = Studio.getResourceManager().getFile(projectId, selected[j]);
            if (file && file.getContents().type === 'visual') visualCnt++;
        }
        var optionText = Brightics.locale.sentence.S0026;
        if (visualCnt > 0) optionText = 'Include the data flow(s) along with the selected report.';

        Brightics.VA.Core.Utils.WidgetUtils.openConfirmWithOptionDialog('', contentText, optionText, closeHandler);
    };

    ProjectViewer.prototype.getSelectedTabType = function () {
        return this.$mainControl.find('.brtc-va-workspace-model-list-type-item.model').hasClass('selected') ? 'model' : 'report';
    };

    ProjectViewer.prototype.show = function () {
        this.$parent.removeClass('brtc-va-workspace-popup');
        this.$parent.css('display', 'block');
        this.$mainControl.css('display', 'block');
    };

    ProjectViewer.prototype.hide = function () {
        this.$parent.css('display', 'none');
        this.$mainControl.css('display', 'none');
    };

    ProjectViewer.prototype.showPopup = function () {
        var _this = this;
        this.fillProjectList(null, null, function () {
            _this.$parent.addClass('brtc-va-workspace-popup');
            _this.$parent.css('display', 'block');
            _this.$mainControl.css('display', 'flex');
            _this.renderProjectListContainer();
        });
    };

    ProjectViewer.prototype.setChartContentAddedReport = function (selectedModels) {
        this.chartContentAddedReport = {};
        for (var i in selectedModels) {
            var projectId = selectedModels[i]['project_id'];
            var fileId = selectedModels[i].id;
            if (!this.chartContentAddedReport[projectId]) this.chartContentAddedReport[projectId] = {};
            this.chartContentAddedReport[projectId][fileId] = selectedModels[i];
        }
    };

    Brightics.VA.Workspace.ProjectViewer = ProjectViewer;
}).call(this);
