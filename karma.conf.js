// Karma configuration
// Generated on Wed Oct 28 2015 17:39:02 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    "target/main/js/rbs-angular-core-lib.js",
    "bower_components/angular-resource/angular-resource.js",
    "bower_components/angular-mocks/angular-mocks.js",
    "bower_components/jasmine-promise-matchers/dist/jasmine-promise-matchers.js",
    "bower_components/jasmine-object-matchers/dist/jasmine-object-matchers.js",
    "target/main/js/rbs-angular-core.js",
    "target/test/unit/js/Mixins_specs.js",
    "target/test/unit/js/config/Configuration_specs.js",
    "target/test/unit/js/controller/ActionCtrl_specs.js",
    "target/test/unit/js/controller/ActionMessagesSupport_specs.js",
    "target/test/unit/js/controller/ActionProgressSupport_specs.js",
    "target/test/unit/js/service/Backoff_specs.js",
    "target/test/unit/js/service/ErrorFactory_specs.js",
    "target/test/unit/js/service/Resolves_specs.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['junit', 'story'],

    junitReporter: {outputDir: 'target/reports'},

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
