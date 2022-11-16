/**
 * Created by SDS on 2016-01-28.
 */
(function () {
    'use strict';

    var root = this;

    root.Brightics.VA.Core.Widget.Configurator = {
        setCodeMirrorConfiguration: function () {
            CodeMirror.defineMode('brtc-default', function (config) {
                return CodeMirror.simpleMode(config, {start: []});
            });

            var CFConditionVerifier = new Brightics.VA.Core.Verifier.CFConditionVerifier();
            CodeMirror.defineMode(CFConditionVerifier.getRuleMode(), function (config) {
                return CodeMirror.simpleMode(config, {start: CFConditionVerifier.getSyntaxRule()});
            });

            var CFVariableVerifier = new Brightics.VA.Core.Verifier.CFVariableVerifier();
            CodeMirror.defineMode(CFVariableVerifier.getRuleMode(), function (config) {
                return CodeMirror.simpleMode(config, {start: CFVariableVerifier.getSyntaxRule()});
            });

            var ConditionVerifier = new Brightics.VA.Core.Verifier.ConditionVerifier();
            CodeMirror.defineMode(ConditionVerifier.getRuleMode(), function (config) {
                return CodeMirror.simpleMode(config, {start: ConditionVerifier.getSyntaxRule()});
            });

            var NumericalFormulaVerifier = new Brightics.VA.Core.Verifier.NumericalFormulaVerifier();
            CodeMirror.defineMode(NumericalFormulaVerifier.getRuleMode(), function (config) {
                return CodeMirror.simpleMode(config, {start: NumericalFormulaVerifier.getSyntaxRule()});
            });

            var SystemVariableVerifier = new Brightics.VA.Core.Verifier.SystemVariableVerifier();
            CodeMirror.defineMode(SystemVariableVerifier.getRuleMode(), function (config) {
                return CodeMirror.simpleMode(config, {start: SystemVariableVerifier.getSyntaxRule()});
            });

            CodeMirror.commands.autocomplete = function (cm) {
                var doc = cm.getDoc();
                var POS = doc.getCursor();
                var mode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(POS).state).mode.name;

                if (mode == 'sql') { //html depends on xml
                    CodeMirror.showHint(cm, CodeMirror.hint.sql);
                    // CodeMirror.showHint(cm, CodeMirror.hint['sql-custom']);
                } else if (mode == 'clike') {

                    CodeMirror.showHint(cm, CodeMirror.hint['scala-custom']);
                } else if (mode == 'brtc-default'
                    || mode == 'brtc-controlflow-variable'
                    || mode == 'brtc-control'
                    || mode == 'brtc-va-numerical-formula-rule'
                    || mode == 'r') {
                    CodeMirror.showHint(cm, CodeMirror.hint['brtc-custom']);
                } else {
                    CodeMirror.showHint(cm, CodeMirror.hint.anyword);
                }
                // } else if (mode == 'javascript') {
                //     CodeMirror.showHint(cm, CodeMirror.hint.javascript);
                // } else if (mode == 'css') {
                //     CodeMirror.showHint(cm, CodeMirror.hint.css);
                // } else if (mode == 'xml') {
                //     CodeMirror.showHint(cm, CodeMirror.hint.html);
            };
        }
    }
}).call(this);