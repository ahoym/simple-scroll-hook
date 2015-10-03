module.exports = function(config) {
  config.set({
    basePath: '',

    browsers: ['Chrome', 'Firefox'],

    frameworks: ['mocha', 'chai'],

    files: [
      './simple-scroll-hook.js',
      './test/**/*.js'
    ],

    reporters: ['spec'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: true,

    phantomjsLauncher: {
      exitOnResourceError: true
    }
  });
};
