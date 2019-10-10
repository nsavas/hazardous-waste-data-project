let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));