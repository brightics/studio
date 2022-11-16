// gulp build-all --gulpfile gulpfile.opensource.js
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var filesize = require('gulp-filesize');
var clean = require('gulp-clean');
var insert = require('gulp-insert');
var babel = require('gulp-babel');

var getCurrentDateComment = function () {
  var today = new Date();
  return '/*   Brightics VA Build ' + today.toISOString().substring(2, 10).replace(/-/gi, '') + ' */\n';
};

function concatJsSource(task_type) {
  return gulp.src(task_type.sourceList)
    .pipe(concat(task_type.result + '.js'))
    .pipe(insert.prepend(getCurrentDateComment()))
    .pipe(gulp.dest(task_type.dest))
    .pipe(filesize())
    .pipe(uglify())
    //.pipe(rename(task_type.result + '.js'))
    .pipe(rename(task_type.result + '.min.js'))
    .pipe(insert.prepend(getCurrentDateComment()))
    .pipe(gulp.dest(task_type.dest))
    .pipe(filesize())
    .on('error', gutil.log)
}

function concatCssSource(task_type) {
  return gulp.src(task_type.sourceList)
    .pipe(concat(task_type.result + '.css'))
    .pipe(insert.prepend(getCurrentDateComment()))
    .pipe(gulp.dest(task_type.dest))
    .pipe(filesize())
    .on('error', gutil.log)
}

gulp.task('clean-all', function () {
  return gulp.src([
    'public/js/va/brightics-va-!(ajax|main|publish-variables)*.js',
    'public/js/admin/brightics-admin.js',
    'public/js/admin/brightics-admin.min.js',
    'public/css/va/brightics-va.css',
    'public/css/va/brightics-va.min.css',
    'public/css/admin/brightics-admin.css',
    'public/css/admin/brightics-admin.min.css',
  ], { read: false, allowEmpty: true }).pipe(clean());
});


/**************************************************************************************************/
/* START JS TASK **********************************************************************************/
/**************************************************************************************************/

/* build/tmp/brightics-va-controls.js *************************************************************/
var buildControls = require('./build/build-controls');
gulp.task('build-controls', buildControls);

/* public/js/va/brightics-va-core.js **************************************************************/
var gulp_va_core_js = {
  sourceList: [
    'build/tmp/brightics-va-controls.js',
    'public/js/va/source/env.js',
    'public/js/va/source/core/logger.js',
    'public/js/va/source/core/command/command.js',
    'public/js/va/source/core/command/compoundcommand.js',
    'public/js/va/source/core/command/commandmanager.js',
    'public/js/va/source/core/modellauncher/jobdelegator.js',
    'public/js/va/source/core/modellauncher/job.js',
    'public/js/va/source/core/modellauncher/modellauncher.js',
    'public/js/va/source/core/modellauncher/modellaunchermanager.js',
    'public/js/va/source/core/modellauncher/eventdetector.js',
    'public/js/va/source/core/functionlibrary.js',
    'public/js/va/source/core/viewerlibrary.js',
    'public/js/va/source/core/optfunctions.js',
    'public/js/va/source/core/dataquerytemplate.js',
    'public/js/va/source/core/repositoryquerytemplate.js',
    'public/js/va/source/core/garbagecollector.js',
    'public/js/va/source/core/layoutmanager.js',
    'public/js/va/source/core/addon-function/*',
    'public/js/va/source/view/*',
    'public/js/va/source/core/report/*.js',
    'public/js/va/source/studio.js',
    'public/js/va/source/core/shapes/*.js',
    'public/js/va/source/core/tools/*.js',
    'public/js/va/source/core/tools/menubar/*.js',
    'public/js/va/source/core/tools/migrator/*.js',
    'public/js/va/source/core/tools/migrator/lib/*.js',
    'public/js/va/source/core/utils/verifier.js',
    'public/js/va/source/core/utils/verifier/*.js',
    'public/js/va/source/core/utils/fnunitgenerator.js',
    'public/js/va/source/core/utils/fnunitgenerator/*.js',
    'public/js/va/source/core/validator/basevalidator.js',
    'public/js/va/source/core/validator/singleinputvalidator.js',
    'public/js/va/source/core/validator/pairinputvalidator.js',
    'public/js/va/source/core/validator/multiinputvalidator.js',
    'public/js/va/source/core/validator/problemfactory.js',
    'public/js/va/source/core/validator/validators/opt/*.js',
    'public/js/va/source/core/validator/validators/udf/*.js',
    'public/js/va/source/core/validator/validators/*.js',
    'public/js/va/source/core/editors/editor.js',
    'public/js/va/source/core/editors/*.js',

    'public/js/va/source/core/editors/diagram/*.js',
    'public/js/va/source/core/editors/diagram/commands/*.js',
    'public/js/va/source/core/editors/diagram/commands/controleditor/*.js',

    'public/js/va/source/core/editors/diagram/boat/boat.js',
    'public/js/va/source/core/editors/diagram/boat/!(boat)*.js',

    'public/js/va/source/core/editors/sheet/*.js',
    'public/js/va/source/core/editors/sheet/controls/propertycontrol.js',
    'public/js/va/source/core/editors/sheet/controls/dataworksheet.js',
    'public/js/va/source/core/editors/sheet/controls/!(propertycontrol)*.js',
    'public/js/va/source/core/editors/sheet/controls/optimization-controls/*.js',
    'public/js/va/source/core/editors/sheet/panels/basepanel.js',
    'public/js/va/source/core/editors/sheet/panels/datapanel.js',
    'public/js/va/source/core/editors/sheet/panels/newfnunitpanel.js',
    'public/js/va/source/core/editors/sheet/panels/propertiespanel.js',
    'public/js/va/source/core/editors/sheet/panels/dex-properties-panel.js',
    'public/js/va/source/core/editors/sheet/panels/*.js',
    'public/js/va/source/core/editors/sheet/panels/functionpropertiespanels/opt/!(optfuncbaseproperties)*.js',
    'public/js/va/source/core/editors/sheet/panels/functionpropertiespanels/*.js',
    'public/js/va/source/core/editors/sheet/panels/functionpropertiespanels/udf/*.js',
    'public/js/va/source/core/editors/sheet/panels/bigdataoptionpanels/*.js',

    'public/js/va/source/core/editors/navigator/navigator.js',
    'public/js/va/source/core/editors/navigator/navigatortree.js',

    'public/js/va/source/core/editors/toolbar/toolbar.js',
    'public/js/va/source/core/editors/toolbar/item.js',
    'public/js/va/source/core/editors/toolbar/items/*.js',
    'public/js/va/source/core/editors/toolbar/itemstemplate.js',

    'public/js/va/source/core/views/!(clipboardexplorer|set-variable|local-outline|global-outline)*.js',
    'public/js/va/source/core/views/clipboardexplorer.js',
    'public/js/va/source/core/views/set-variable.js',
    'public/js/va/source/core/views/local-outline.js',
    'public/js/va/source/core/views/global-outline.js',
    'public/js/va/source/core/setting/*.js',
    'public/js/va/source/core/setting/settingstorage.js',
    'public/js/va/source/core/setting/widgets/*.js',
    'public/js/va/source/core/setting/registry/setting.js',
    'public/js/va/source/core/setting/registry/!(setting)*.js',
    'public/js/va/source/core/setting/preference/preference.js',
    'public/js/va/source/core/setting/preference/!(preference)*.js',
    'public/js/va/source/core/dialogs/refinesteps/validators/stepvalidator.js',
    'public/js/va/source/core/dialogs/refinesteps/validators/!(stepvalidator)*.js',
    'public/js/va/source/core/dialogs/refinesteps/stepdialog.js',
    'public/js/va/source/core/dialogs/refinesteps/*.js',
    'public/js/va/source/core/dialogs/scripteditordialog.js',
    'public/js/va/source/core/dialogs/fnunitdialog.js',
    'public/js/va/source/core/dialogs/!(scripteditordialog|fnunitdialog)*.js',
    'public/js/va/source/core/wizards/pages/wizardpage.js',
    'public/js/va/source/core/wizards/pages/*.js',
    'public/js/va/source/core/wizards/wizard.js',
    'public/js/va/source/core/wizards/*.js',
    'public/js/va/source/core/utils/!(verifier|fnunitgenerator)*.js',
    'public/js/va/source/core/widget/controls/*.js',
    'public/js/va/source/core/widget/widgetconfigurator.js',
    'public/js/va/source/core/widget/widgetfactory.js',
    'public/js/va/source/core/widget/!(widgetconfigurator|widgetfactory)*.js',
    // 'public/js/va/source/core/tools/adapter/sidebaradapter.js',
    // 'public/js/va/source/core/tools/adapter/!(sidebaradapter)*.js',
    'public/js/va/source/core/tools/manager/*.js',
    'public/js/va/source/core/tools/sidebar/sidebar.js',
    'public/js/va/source/core/tools/sidebar/!(sidebar)*.js',
    'public/js/va/source/core/tools/selector/*.js',
    'public/js/va/source/core/tools/tab/tab.js',
    'public/js/va/source/core/tools/tab/tab-navigator.js',
    'public/js/va/source/core/tools/tab/tab-page.js',

    'public/js/va/source/core/components/*.js',
    'public/js/va/source/extension/*.js'
  ],
  result: 'brightics-va-core',
  dest: 'public/js/va'
};

gulp.task('build-va-core-js', gulp.series(['build-controls', function () {
  return concatJsSource(gulp_va_core_js);
}]));

gulp.task('clean-va-js', function () {
  return gulp.src('build-va-core-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-functions.js *********************************************************/
var gulp_va_functions_js = {
  sourceList: [
    'public/js/va/functions/common/*.js',
    'public/js/va/functions/script_pythonScript.js',
    'public/js/va/functions/python/*.js',
    'public/js/va/functions/dialog/*.js',
    'public/js/va/functions/control_*.js',
    'public/js/va/functions/process_setValue.js',
    'public/js/va/functions/io_loadFrom*.js',
    'public/js/va/functions/bigData_*.js',
    'public/js/va/functions/brightics*.js'
  ],
  result: 'brightics-va-functions',
  dest: 'public/js/va'
};

gulp.task('build-va-functions-js', function () {
  return concatJsSource(gulp_va_functions_js);
});

gulp.task('clean-va-functions-js', function () {
  return gulp.src('build-va-functions-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-windowchart.js *******************************************************/
var gulp_va_windowchart_js = {
  sourceList: [
    'public/js/va/source/window-chart/*.js',
    'public/js/va/source/window-chart/utils/*.js',
    'public/js/va/source/window-chart/controls/*.js',
    'public/js/va/source/window-chart/multichart/multichart.js',
    'public/js/va/source/window-chart/multichart/multichart-executor-python.js',
    'public/js/va/source/window-chart/properties/*.js',
  ],
  result: 'brightics-va-windowchart',
  dest: 'public/js/va'
};

gulp.task('build-va-windowchart-js', function () {
  return concatJsSource(gulp_va_windowchart_js);
});

gulp.task('clean-va-windowchart-js', function () {
  return gulp.src('build-va-windowchart-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-dataflow.js **********************************************************/
var gulp_va_dataflow_js = {
  sourceList: [
    'public/js/va/source/implementation/dataflow/env.js',
    'public/js/va/source/implementation/dataflow/editors/datafloweditor.js',
    'public/js/va/source/implementation/dataflow/editors/modellayoutmanager.js',
    'public/js/va/source/implementation/dataflow/validator/*',
    'public/js/va/source/implementation/dataflow/validator/validators/*.js',
    'public/js/va/source/implementation/dataflow/modellauncher/*.js',
    'public/js/va/source/implementation/dataflow/editors/diagram/shapes/*.js',
    'public/js/va/source/implementation/dataflow/editors/diagram/datafloweditorpage.js',
    'public/js/va/source/implementation/dataflow/editors/sheet/*.js',
    'public/js/va/source/implementation/dataflow/editors/sheet/panels/*.js',
    'public/js/va/source/implementation/dataflow/editors/sheet/panels/functionoutpanels/*.js',
    'public/js/va/source/implementation/dataflow/editors/sheet/panels/invokepanels/*.js',
    'public/js/va/source/implementation/dataflow/editors/sheet/panels/invokepanels/controls/*.js',
    'public/js/va/source/implementation/dataflow/editors/header/*.js',
    'public/js/va/source/implementation/dataflow/editors/header/condition-header/*.js',
    'public/js/va/source/implementation/dataflow/editors/header/loop-header/*.js',
    'public/js/va/source/implementation/dataflow/editors/toolbar/toolbar.js',
    'public/js/va/source/implementation/dataflow/editors/toolbar/items/*.js',
    'public/js/va/source/implementation/dataflow/editors/toolbar/itemstemplate.js',
    'public/js/va/source/implementation/dataflow/utils/*.js',
    // 'public/js/va/source/implementation/dataflow/tools/adapter/*.js',
    'public/js/va/source/implementation/dataflow/tools/manager/*.js',
    'public/js/va/source/implementation/dataflow/coreinterfaces.js',
  ],
  result: 'brightics-va-dataflow',
  dest: 'public/js/va'
};

gulp.task('build-va-dataflow-js', function () {
  return concatJsSource(gulp_va_dataflow_js);
});

gulp.task('clean-va-dataflow-js', function () {
  return gulp.src('build-va-dataflow-js', { read: false, allowEmpty: true }).pipe(clean());
});


/* public/js/va/brightics-va-visual.js ************************************************************/
var gulp_va_visual_js = {
  sourceList: [
    'public/js/va/source/implementation/visualmodel/env.js',
    'public/js/va/source/implementation/visualmodel/validator/visualvalidator.js',
    // 'public/js/va/source/implementation/visualmodel/tools/adapter/*.js',
    'public/js/va/source/implementation/visualmodel/tools/manager/*.js',
    'public/js/va/source/implementation/visualmodel/utils/*.js',

    'public/js/va/source/implementation/visualmodel/dialogs/scheduledialog.js',
    'public/js/va/source/implementation/visualmodel/dialogs/publishreportdialog.opensource.js',
    'public/js/va/source/implementation/visualmodel/dialogs/!(publishreportdialog|scheduledialog)*.js',

    'public/js/va/source/implementation/visualmodel/views/**/*.js',
    'public/js/va/source/implementation/visualmodel/views/*.js',
    'public/js/va/source/implementation/visualmodel/wizards/pages/*.js',
    'public/js/va/source/implementation/visualmodel/wizards/*.js',
    'public/js/va/source/implementation/visualmodel/editors/visualeditor.js',
    'public/js/va/source/implementation/visualmodel/editors/modellayoutmanager.js',
    'public/js/va/source/implementation/visualmodel/editors/diagram/*.js',
    'public/js/va/source/implementation/visualmodel/editors/diagram/command/*.js',
    'public/js/va/source/implementation/visualmodel/editors/diagram/figures/basecontentunit.js',
    '!public/js/va/source/implementation/visualmodel/editors/diagram/figures/chartcontentunit.js',
    'public/js/va/source/implementation/visualmodel/editors/diagram/figures/!(basecontentunit)*.js',
    'public/js/va/source/implementation/visualmodel/editors/diagram/figures/droppable/*.js',
    'public/js/va/source/implementation/visualmodel/editors/sheet/*.js',
    'public/js/va/source/implementation/visualmodel/editors/sheet/command/*.js',
    'public/js/va/source/implementation/visualmodel/editors/sheet/figures/*.js',
    'public/js/va/source/implementation/visualmodel/editors/toolbar/toolbar.js',
    'public/js/va/source/implementation/visualmodel/editors/toolbar/items/*.js',
    'public/js/va/source/implementation/visualmodel/editors/toolbar/itemstemplate.js',
    'public/js/va/source/implementation/visualmodel/modellauncher/*.js',
    'public/js/va/source/implementation/visualmodel/publish/*.js',
    'public/js/va/source/implementation/visualmodel/coreinterfaces.js',
    'public/js/va/source/implementation/visualmodel/export/*.js',
  ],
  result: 'brightics-va-visual',
  dest: 'public/js/va'
};

gulp.task('build-va-visual-js', function () {
  return concatJsSource(gulp_va_visual_js);
});

gulp.task('clean-va-visual-js', function () {
  return gulp.src('build-va-visual-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-deeplearning.js ******************************************************/
var gulp_va_deeplearning_js = {
  sourceList: [
    'public/js/va/source/implementation/deeplearning/env.js',
    'public/js/va/source/implementation/deeplearning/editors/deeplearningeditor.js',
    'public/js/va/source/implementation/deeplearning/utils/*.js',
    'public/js/va/source/implementation/deeplearning/views/*.js',
    'public/js/va/source/implementation/deeplearning/dialogs/*.js',
    'public/js/va/source/implementation/deeplearning/editors/modellayoutmanager.js',
    'public/js/va/source/implementation/deeplearning/validator/deeplearningvalidator.js',
    'public/js/va/source/implementation/deeplearning/validator/validators/deeplearningsingleinputvalidator.js',
    'public/js/va/source/implementation/deeplearning/validator/validators/!(deeplearningsingleinputvalidator)*.js',
    'public/js/va/source/implementation/deeplearning/validator/validators/*.js',
    'public/js/va/source/implementation/deeplearning/modellauncher/*.js',
    'public/js/va/source/implementation/deeplearning/editors/diagram/deeplearningeditorpage.js',
    'public/js/va/source/implementation/deeplearning/editors/sheet/*.js',
    'public/js/va/source/implementation/deeplearning/editors/sheet/panels/*.js',
    'public/js/va/source/implementation/deeplearning/editors/sheet/panels/properties/*.js',
    'public/js/va/source/implementation/deeplearning/editors/toolbar/toolbar.js',
    'public/js/va/source/implementation/deeplearning/editors/toolbar/items/*.js',
    'public/js/va/source/implementation/deeplearning/editors/toolbar/itemstemplate.js',
    'public/js/va/source/implementation/deeplearning/utils/*.js',
    'public/js/va/source/implementation/deeplearning/tools/manager/*.js',
    'public/js/va/source/implementation/deeplearning/coreinterfaces.js',
  ],
  result: 'brightics-va-deeplearning',
  dest: 'public/js/va'
};

gulp.task('build-va-deeplearning-js', function () {
  return concatJsSource(gulp_va_deeplearning_js);
});

gulp.task('clean-va-deeplearning-js', function () {
  return gulp.src('build-va-deeplearning-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-commons.js ***********************************************************/
var gulp_va_commons_js = {
  sourceList: [
    'build/tmp/brightics-va-controls.js',
    //EnV
    'public/js/va/source/env.js',

    //Utils
    'public/js/va/source/core/utils/commonutil.js',
    'public/js/va/source/core/utils/widgetutils.js',
    'public/js/va/source/core/utils/modelutils.js',
    'public/js/va/source/core/utils/inputvalidator.js',

    //WidgetControls
    'public/js/va/source/core/editors/sheet/controls/textareacontrol.js',
    'public/js/va/source/core/widget/controls/*.js',
    'public/js/va/source/core/widget/widgetfactory.js',

    //Dialog
    'public/js/va/source/core/dialogs/rundatadialog.js',
    'public/js/va/source/core/dialogs/runcontroldialog.js',
    'public/js/va/source/core/dialogs/runrealtimedialog.js',

    //Report
    'public/js/va/source/core/report/reportmanager.js',
    'public/js/va/source/core/dataquerytemplate.js'
  ],
  result: 'brightics-va-commons',
  dest: 'public/js/va'
};

gulp.task('build-va-commons-js', gulp.series(['build-controls', function () {
  return concatJsSource(gulp_va_commons_js);
}]));

gulp.task('clean-va-commons-js', function () {
  return gulp.src('build-va-commons-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-publish.js ***********************************************************/
var gulp_va_publish_js = {
  sourceList: [
    'build/tmp/brightics-va-controls.js',
    'public/js/va/source/env.js',
    'public/js/va/source/core/dataquerytemplate.js',
    'public/js/va/source/core/functionlibrary.js',
    'public/js/va/source/core/utils/fnunitgenerator.js',
    'public/js/va/source/core/utils/fnunitgenerator/*.js',
    'public/js/va/source/core/utils/!(verifier|fnunitgenerator)*.js',
    'public/js/va/source/core/modellauncher/jobdelegator.js',
    'public/js/va/source/core/modellauncher/job.js',
    'public/js/va/source/core/modellauncher/modellauncher.js',
    'public/js/va/source/core/modellauncher/modellaunchermanager.js',
    'public/js/va/source/core/modellauncher/eventdetector.js',
    'public/js/va/source/implementation/visualmodel/modellauncher/*.js',
  ],
  result: 'brightics-va-publish',
  dest: 'public/js/va'
};

gulp.task('build-va-publish-js', gulp.series(['build-controls', function () {
  return concatJsSource(gulp_va_publish_js);
}]));

gulp.task('clean-va-publish-js', function () {
  return gulp.src('build-va-publish-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-ajax.js ***********************************************************/
var gulp_va_ajax_js = {
  sourceList: [
    'public/js/va/ajax/ajax.js'
  ],
  result: 'brightics-va-ajax',
  dest: 'public/js/va'
};

gulp.task('build-va-ajax-js', function () {
  return concatJsSource(gulp_va_ajax_js);
});

gulp.task('clean-va-ajax-js', function () {
  return gulp.src('build-va-ajax-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/va/brightics-va-main.js ***********************************************************/
var gulp_va_main_js = {
  sourceList: [
    'public/js/va/main/main.js',
  ],
  result: 'brightics-va-main',
  dest: 'public/js/va'
};

gulp.task('build-va-main-js', function () {
  return concatJsSource(gulp_va_main_js);
});

gulp.task('clean-va-main-js', function () {
  return gulp.src('build-va-main-js', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/js/admin/brightics-admin.js *************************************************************/
var gulp_admin_js = {
  sourceList: [
    'public/js/admin/source/*.js'
  ],
  result: 'brightics-admin',
  dest: 'public/js/admin'
};

gulp.task('build-admin-js', function () {
  return concatJsSource(gulp_admin_js);
});

gulp.task('clean-admin-js', function () {
  return gulp.src('build-admin-js', { read: false, allowEmpty: true }).pipe(clean());
});




/* JS Babel Transform *****************************************************************************/
gulp.task('build-babel-transform-js', gulp.parallel(
  'build-va-core-js',
  'build-va-functions-js',
  'build-va-dataflow-js',
  'build-va-visual-js',
  'build-va-commons-js',
  'build-admin-js',
  'build-va-publish-js'
), function () {
  return gulp.src(['public/js/va/brightics-va-!(ajax|main)*.js'])
    .pipe(babel({
      "presets": [[
        "@babel/preset-env", {
          modules: false,
          loose: true
        }
      ]],
      compact: true
    }))
    .pipe(gulp.dest('public/js/va/'))
});

/**************************************************************************************************/
/* END JS TASK ************************************************************************************/
/**************************************************************************************************/


/**************************************************************************************************/
/* START CSS TASK *********************************************************************************/
/**************************************************************************************************/

/* public/css/va/brightics-va.css *****************************************************************/
var gulp_va_css = {
  sourceList: [
    'public/css/va/source/brtc-va.css',
    'public/css/va/source/brtc-*.css',
    'public/css/va/source/common/brtc-*.css'
  ],
  result: 'brightics-va',
  dest: 'public/css/va'
};

gulp.task('build-va-css', function () {
  return concatCssSource(gulp_va_css);
});

gulp.task('clean-va-css', function () {
  return gulp.src('build-va-css', { read: false, allowEmpty: true }).pipe(clean());
});

/* public/css/admin/brightics-admin.css ***********************************************************/
var gulp_admin_css = {
  sourceList: [
    'public/css/admin/source/*.css'
  ],
  result: 'brightics-admin',
  dest: 'public/css/admin'
};

gulp.task('build-admin-css', function () {
  return concatCssSource(gulp_admin_css);
});

gulp.task('clean-admin-css', function () {
  return gulp.src('build-admin-css', { read: false, allowEmpty: true }).pipe(clean());
});


/**************************************************************************************************/
/* END CSS TASK ***********************************************************************************/
/**************************************************************************************************/

gulp.task('build-all', gulp.parallel(
  'clean-all',
  'build-va-core-js',
  'build-va-functions-js',
  'build-va-dataflow-js',
  'build-va-visual-js',
  'build-va-commons-js',
  'build-va-windowchart-js',
  'build-va-publish-js',
  'build-va-ajax-js',
  'build-va-main-js',
  'build-admin-js',
  'build-babel-transform-js',
  'build-va-css',
  'build-admin-css'
), function () {
  console.log("Opensource version was built.");
});
