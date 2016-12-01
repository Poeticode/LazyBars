// should probably switch to this https://github.com/request/request
var express = require('express');
var app = express();
const path = require('path');

// send em the damn file! now get outta here

app
    .use(express.static('dist'))
    .use('/dynamic', express.static(path.join('_src','/hbs','/data', '/dynamic')))
    .listen(8080);