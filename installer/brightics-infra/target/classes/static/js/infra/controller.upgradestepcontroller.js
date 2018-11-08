/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function UpgradeStepController($parent) {
        this.$parent = $parent;
        this.data = {};

        this.step1Container = new Brightics.Installer.ContentContainer.UpgradeStep1Container(this.$parent);
        this.step2Container = new Brightics.Installer.ContentContainer.UpgradeStep2Container(this.$parent);
        this.step3Container = new Brightics.Installer.ContentContainer.UpgradeStep3Container(this.$parent);
        this.step4Container = new Brightics.Installer.ContentContainer.UpgradeStep4Container(this.$parent);

        this.step1Container.setController(this);
        this.step2Container.setController(this);
        this.step3Container.setController(this);
        this.step4Container.setController(this);
    }

    UpgradeStepController.prototype.startStep1 = function () {
        this.step1Container.render();
    };

    UpgradeStepController.prototype.startStep2 = function () {
        this.step2Container.render();
    };

    UpgradeStepController.prototype.startStep3 = function () {
        this.step3Container.render();
    };

    UpgradeStepController.prototype.startStep4 = function () {
        this.step4Container.render();
    };

    root.Brightics.Installer.Controller.UpgradeStepController = UpgradeStepController;

}).call(this);