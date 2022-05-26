require('dotenv').config()
const createError = require('http-errors');
const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const routes = require('./routes')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('',routes)




app.listen(process.env.NODE_PORT, ()=>{
  console.log(`Servidor online: http://${process.env.NODE_HOST}:${process.env.NODE_PORT}`)
})