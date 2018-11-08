/**
 * Created by ty_tree.kim on 2016-05-17.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    function ServicesAddStepController($parent) {
        this.$parent = $parent;
        this.data = {};

        this.step1Container = new Brightics.Installer.ContentContainer.ServiceAddStep1Container(this.$parent);
        this.step2Container = new Brightics.Installer.ContentContainer.ServiceAddStep2Container(this.$parent);
        this.step3Container = new Brightics.Installer.ContentContainer.ServiceAddStep3Container(this.$parent);

        this.step1Container.setController(this);
        this.step2Container.setController(this);
        this.step3Container.setController(this);
    }

    ServicesAddStepController.prototype.startStep1 = function () {
        this.step1Container.render();
    };

    ServicesAddStepController.prototype.startStep2 = function () {
        this.step2Container.render();
    };

    ServicesAddStepController.prototype.startStep3 = function () {
        this.step3Container.render();
    };

    root.Brightics.Installer.Controller.ServicesAddStepController = ServicesAddStepController;

}).call(this);