(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    Brightics.VA.Implementation.Visual.Utils.RunnableFactory = {
        _create: function (jid, user) {
            return {
                main: '',
                models: {},
                version: Brightics.VA.Env.CoreVersion
            };
        },
        createForUnit: function (fnUnit, jid, user, args, options) {
            var runnable = this._create(jid, user);
            delete runnable.args;

            var execUnit = $.extend(true, {}, fnUnit, { display: null });
            Brightics.VA.Core.Utils.ModelUtils.deleteDisplay(execUnit);
            Brightics.VA.Core.Utils.ModelUtils.deleteEmptyArray(execUnit);

            var mid = fnUnit.parent().mid;
            runnable.main = mid;
            runnable.models[mid] = {
                'mid': mid,
                'type': 'data',
                'functions': [execUnit]
            };

            return runnable;
        },
        createForFlow: function (model, jid, user, args, options) {
            var runnable = this._create(jid, user);
            delete runnable.args;

            var mid = model.mid;
            runnable.main = mid;

            // ?? 여기 사용될 일 없나? 왜 주석으로 되어 있지?
            // 일단 visual model에서 전체 run이 없어서
            // VisualModelLauncer.prototype.launchModel 함수를 사용하는 일이 없긴 한데,
            // 나중에 사용하게 되면 확인 필요함.
            // createForUnit과 같이 runnable models의 type을 data로 수정해야 함.

            // var execModel = Brightics.VA.Core.Utils.ModelUtils.exportAsRunnable(model);
            // for (var j in execModel.functions) {
            //     var fnUnit = execModel.functions[j];
            //
            //     Brightics.VA.Core.Utils.ModelUtils.deleteDisplay(fnUnit);
            //     Brightics.VA.Core.Utils.ModelUtils.deleteEmptyArray(fnUnit);
            // }
            //
            // execModel.links = [];
            // for (var k = 1; k < execModel.functions.length; k++) {
            //     execModel.links.push({
            //         kid: root.Brightics.VA.Core.Utils.IDGenerator.link.id(),
            //         'sourceFid': execModel.functions[k - 1].fid,
            //         'targetFid': execModel.functions[k].fid
            //     });
            // }
            //
            // execModel.entries = [execModel.functions[0].fid];
            // runnable.models[mid] = execModel;

            return runnable;
        }
    };
}).call(this);
