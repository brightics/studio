/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function InstallStepController($parent) {
        this.$parent = $parent;
        this.data = {};

        this.step1Container = new Brightics.Installer.ContentContainer.InstallStep1Container(this.$parent);
        this.step2Container = new Brightics.Installer.ContentContainer.InstallStep2Container(this.$parent);
        this.step3Container = new Brightics.Installer.ContentContainer.InstallStep3Container(this.$parent);
        this.step4Container = new Brightics.Installer.ContentContainer.InstallStep4Container(this.$parent);

        this.step1Container.setController(this);
        this.step2Container.setController(this);
        this.step3Container.setController(this);
        this.step4Container.setController(this);
    }

    InstallStepController.prototype.startStep1 = function () {
        this.step1Container.render();
    };

    InstallStepController.prototype.startStep2 = function () {
        this.step2Container.render();
    };

    InstallStepController.prototype.startStep3 = function () {
        this.step3Container.render();
    };

    InstallStepController.prototype.startStep4 = function () {
        this.step4Container.render();
    };

    root.Brightics.Installer.Controller.InstallStepController = InstallStepController;

}).call(this);