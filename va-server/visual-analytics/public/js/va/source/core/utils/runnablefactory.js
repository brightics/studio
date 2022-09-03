/**
 * Created by daewon.park on 2016-09-24.
 */
(function () {
    'use strict';

    var root = this;
    var Brightics = root.Brightics;

    root.Brightics.VA.Core.Utils.RunnableFactory = {
        _create: function (jid, user) {       
            return {
                'main': '',
                'models': {},
                'version': Brightics.VA.Env.CoreVersion
            }
        },
        createForUnit: function (fnUnit, jid, user, args, options) {
            var type = fnUnit.parent().type || 'data';
            var runnableFactory = Brightics.VA.Core.Interface.RunnableFactory[type];
            if (runnableFactory) {
                return runnableFactory.createForUnit(fnUnit, jid, user, args, options);
            }
        },
        createForFlow: function (model, jid, user, args, options) {      
            var type = model.type;
            var runnableFactory = Brightics.VA.Core.Interface.RunnableFactory[type];
            if (runnableFactory) {
                return runnableFactory.createForFlow(model, jid, user, args, options);
            }
        },
        createForDummy: function (fnUnit, jid, user, args, options) {
            var execUnit = $.extend(true, {}, fnUnit);

            var model = {
                mid: 'mid',
                type: 'data',
                functions: [execUnit]
            };

            var runnable = {
                main: 'mid',
                models: { 'mid': model },
                version: Brightics.VA.Env.CoreVersion
            }
            return runnable;
        }
    };

}).call(this);