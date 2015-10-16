module.exports = function(config) {
  var configuration = {
    basePath: '',

    browsers: ['Chrome', 'Firefox'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    frameworks: ['mocha', 'chai', 'sinon-chai'],

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
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
  }

  config.set(configuration);
};
