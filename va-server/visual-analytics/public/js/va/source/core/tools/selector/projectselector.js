/**
 * Created by daewon.park on 2016-01-27.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ProjectSelector(parentId, options) {
        this.parentId = parentId;
        this.options = options || {};
        this.retrieveParent();
        this.createControls();
    }

    ProjectSelector.prototype.retrieveParent = function () {
        this.$parent = Brightics.VA.Core.Utils.WidgetUtils.retrieveWidget(this.parentId);
    };

    ProjectSelector.prototype.createControls = function () {
        this.$mainControl = $('<div class="brtc-va-tools-projectselector"></div>');
        this.$parent.append(this.$mainControl);

        this.$mainControl.css({
            width: '100%',
            height: '100%'
        });

        this.createProjectControl();
    };

    ProjectSelector.prototype.createProjectControl = function () {
        var _this = this;

        this.$projectArea = $('<div class="brtc-va-tools-projectselector-project"></div>');
        this.$mainControl.append(this.$projectArea);

        var source = [];

        var projects = this.getProjects();

        _.map(projects, function (project) {
            source.push({
                text: project.getLabel(),
                value:  project.getProjectId()
            })
        });

        this.createDropdownList(this.$projectArea, {
            placeHolder: 'Project',
            source: source,
            disabled: this.options.disabled
        });

        this.$projectArea.val(this.options.projectId);
    };

    ProjectSelector.prototype.createDropdownList = function ($target, options) {
        var _this = this;

        var defaultOptions = {
            theme: Brightics.VA.Env.Theme,
            enableBrowserBoundsDetection: true,
            animationType: 'none',
            width: '100%',
            height: '25px',
            openDelay: 0,
            dropDownHeight: 120,
            disabled: this.options.disabled,
            displayMember: 'text',
            valueMember: 'value'
        };

        $.extend(true, defaultOptions, options);
        
        $target.jqxDropDownList(defaultOptions);

        $target.change(function () {
            var projectId = $(this).val();

            if (_this.options.onChange) _this.options.onChange(projectId);
        });
    };

    ProjectSelector.prototype.getProjects = function () {
        return Studio.getResourceManager().getProjects();
    };

    ProjectSelector.prototype.getProjectId = function () {
        return this.$projectArea.val();
    };

    ProjectSelector.prototype.setSource = function (source) {
        return this.$projectArea.jqxDropDownList('source', source);
    };

    Brightics.VA.Core.Tools.ProjectSelector = ProjectSelector;

}).call(this);
