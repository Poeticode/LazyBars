var express = require('express');
var app = express();
const path = require('path');

app
    .use(express.static('dist'))
    .use('/dynamic', express.static(path.join('_src','/hbs','/data', '/dynamic')))
    .listen(8080);