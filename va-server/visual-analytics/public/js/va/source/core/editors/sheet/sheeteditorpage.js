/**
 * Created by sungjin1.kim on 2016-01-30.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function SheetEditorPage(parentId, options) {
        Brightics.VA.Core.Editors.EditorPage.call(this, parentId, options);
        this.registerCommandEventListener();
    }

    SheetEditorPage.prototype = Object.create(Brightics.VA.Core.Editors.EditorPage.prototype);
    SheetEditorPage.prototype.constructor = SheetEditorPage;

    SheetEditorPage.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-editors-sheet-sheeteditorpage">' +
            '   <div class="brtc-va-editors-sheet-sheeteditorpage-description">' +
            '       <i class="fa fa-info fa-5x"></i><br>' +
            '       There is no selected function for this page.<br>Please select a function.' +
            '   </div>' +
            '   <div class="brtc-va-editors-sheet-sheeteditorpage-fnunitviewer"></div>' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.$description = this.$mainControl.find('.brtc-va-editors-sheet-sheeteditorpage-description');
        this.$fnUnitViewer = this.$mainControl.find('.brtc-va-editors-sheet-sheeteditorpage-fnunitviewer');

        this.showDescription(false);
        this.createFnUnitViewer(this.$fnUnitViewer);
    };

    SheetEditorPage.prototype.createFnUnitViewer = function ($parent) {
        this.fnUnitViewer = new Brightics.VA.Core.Editors.Sheet.FnUnitViewer($parent, {
            width: '100%',
            height: '100%',
            panelFactory: this.options.panelFactory
        });
    };

    SheetEditorPage.prototype.registerCommandEventListener = function () {
        var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(this.$mainControl);
        modelEditorRef.addCommandListener(function (command) {
            // TODO
        });
    };

    SheetEditorPage.prototype.render = function (fnUnits) {
        var _this = this;
        if (fnUnits && fnUnits.length > 0) {
            if (fnUnits.length == 1) {
                this.showDescription(false);
                this.fnUnitViewer.render(fnUnits[0]);
            } else {
                this.$description.empty();
                this.$description.append('Do you want to ');
                var $removeButton = $('<input value="Delete" type="button" style="margin-left: 6px; margin-right: 6px"/>');
                this.$description.append($removeButton);
                this.$description.append('selected ' + fnUnits.length + ' functions ?');
                $removeButton.jqxButton({
                    theme: Brightics.VA.Env.Theme,
                    width: 80, height: 30
                });
                $removeButton.on('click', function () {
                    var modelEditorRef = Brightics.VA.Core.Utils.WidgetUtils.getModelEditorRef(_this.$mainControl);
                    var modelContents = modelEditorRef.options.editorInput.getContents();
                    var command = new Brightics.VA.Core.CompoundCommand(this, {});
                    // Search Connected Links with Removing FnUnit
                    var linkIds = [], i, j;
                    for (i in fnUnits) {
                        var links = modelContents.getConnectedLinkUnits(fnUnits[i].fid);
                        for (j in links) {
                            if (linkIds.indexOf(links[j].kid) < 0) {
                                linkIds.push(links[j].kid);
                            }
                        }
                    }
                    // Remove LinkUnit
                    for (const linkId of linkIds) {
                        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.DisconnectFnUnitCommand(this, {kid: linkId}));
                    }
                    // Remove FnUnit
                    for (i in fnUnits) {
                        command.add(new Brightics.VA.Core.Editors.Diagram.Commands.RemoveFnUnitCommand(this, {fid: fnUnits[i].fid}));

                        // Unbind Global Parameter 
                        for (var paramKey in fnUnits[i].param) {
                            var variable = fnUnits[i].parent().getVariable(fnUnits[i].fid, paramKey);
                            if (variable) {
                                command.add(new Brightics.VA.Core.Editors.Diagram.Commands.UnBindVariableCommand(this, {
                                    fid: fnUnits[i].fid,
                                    paramKey: paramKey,
                                    variable: variable
                                }));
                            }
                        }
                    }
                    modelEditorRef.getCommandManager().execute(command);
                });
                this.showDescription(true);
            }
        } else {
            this.fnUnitViewer.destroy();
            this.$description.empty();
            this.$description.append('<i class="fa fa-info fa-5x"></i><br>There is no selected function for this page.<br>Please select a function.');
            this.showDescription(true);
        }
    };

    SheetEditorPage.prototype.showDescription = function (visible) {
        if (visible) {
            this.$description.css('display', 'block');
            this.$fnUnitViewer.css('display', 'none');
        } else {
            this.$description.css('display', 'none');
            this.$fnUnitViewer.css('display', 'block');
        }
    };

    SheetEditorPage.prototype.destroy = function () {
        this.fnUnitViewer.destroy();
    };

    SheetEditorPage.prototype.getFnUnitViewer = function () {
        return this.fnUnitViewer;
    };

    SheetEditorPage.prototype.onActivated = function () {
        return this.getFnUnitViewer().refresh();
    };

    Brightics.VA.Core.Editors.Sheet.SheetEditorPage = SheetEditorPage;

}).call(this);