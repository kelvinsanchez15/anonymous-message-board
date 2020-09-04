const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
const apiThreadsRouter = require('./routers/api/threads');
const apiRepliesRouter = require('./routers/api/replies');
const frontendBoardRouter = require('./routers/frontend/board');

const app = express();

// Configurations
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.set('view engine', 'pug');

// Connection to the database and error handling
const url =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URI
    : 'mongodb://127.0.0.1:27017/messageBoardDB';

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

mongoose.connection.on('error', (error) => console.log(error));

// Main route defined
app.get('/', (req, res) => res.render('index'));

// Routing for API
app.use('/api', apiThreadsRouter);
app.use('/api', apiRepliesRouter);

// Routing for Frontend
app.use('/b/', frontendBoardRouter);

module.exports = app;
