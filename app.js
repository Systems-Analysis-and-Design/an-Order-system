var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');

var routes = require('./routes/index');

var app = express();

//初始化View
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由
routes(app);

//捕获404并递交到处理器
app.use(function(req, res, next) {
  next(createError(404));
});

//错误处理器
app.use(function(err, req, res, next) {
  //只在本地开发环境才显示错误信息
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  //渲染错误页
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
