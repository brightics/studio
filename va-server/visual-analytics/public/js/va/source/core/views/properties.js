/**
 * Created by SDS on 2016-09-05.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function Properties(parentId, options) {
        this.parentId = parentId;
        this.options = options;
        this.factory = this.getPropertyPageFactory();
        this.retrieveParent();
        this.createControls();
        this.init();
    }

    Properties.prototype.init = function () {
        var _this = this;
        this.commandListener = function (command) {
            if (_this.page) _this.page.onCommand(command);
        };

        this.problemsListener = function (event, mid, problems) {
            if (_this.page && _this.activeEditor.getModel().mid == mid) _this.page.onProblem(problems);
        };

        this.$contentsArea.bind('fireCommand', function (event, command) {
            if (_this.activeEditor) _this.activeEditor.getCommandManager().execute(command);
        });

        Studio.getInstance().addProblemListener(this.problemsListener);
    };

    Properties.prototype.getPropertyPageFactory = function () {
        return new PropertyPageFactory();
    };


    Properties.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    Properties.prototype.createControls = function () {
        this.$mainControl = $('' +
            '<div class="brtc-va-views-properties">' +
            '   <div class="brtc-va-views-properties-contents" />' +
            '</div>');
        this.$mainControl.css({
            width: this.options.width,
            height: this.options.height
        });
        this.$parent.append(this.$mainControl);

        this.$contentsArea = this.$mainControl.find('.brtc-va-views-properties-contents');
        this.$mainControl.perfectScrollbar();
    };

    Properties.prototype.editorChanged = function (editor) {
        this.activeEditor = null;
    };

    Properties.prototype.selectionChanged = function (selection) {
        var _this = this;
        if (selection && this.selection !== selection) {
            if(this.page) this.page.destroy();
            this.$contentsArea.empty();

            this.page = this.factory.createPage(this.$contentsArea, selection);
            this.page.parent = this;
            this.page.setInput(selection).then(function () {
                _this.page.removeValidation();
                _this.page.renderValidation();
            });
        } else if (!selection) {
            if(this.page) this.page.destroy();
            this.$contentsArea.empty();
            this.page = null;
        }
        this.selection = selection;
    };

    Brightics.VA.Core.Views.Properties = Properties;

    function PropertyPageFactory() {
    }

    PropertyPageFactory.prototype.createPage = function ($parent, unit) {
        return new Brightics.VA.Core.Views.Pages.PropertyPage($parent, {
            width: '100%',
            height: '100%'
        })
    };

}).call(this);