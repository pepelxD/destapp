const favicon = require('koa-favicon');
const path = require('path');

exports.init = app => app.use(favicon(path.join(__dirname, '../shadowgun_multi.ico')));
console.log(path.join(__dirname, '../shadowgun_multi.ico'))