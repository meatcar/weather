Package.describe({
  name: 'weatherjs',
  summary: 'Some summary'
});

Npm.depends({'weather-js': '1.0.1'});

Package.on_use(function (api, where) {
  api.addFiles('test.js', 'server');
  api.export("weatherjs");
});
