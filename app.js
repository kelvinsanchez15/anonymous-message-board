const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('cookie-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
require('dotenv').config();

const apiThreadsRouter = require('./routers/api/threads');
const apiRepliesRouter = require('./routers/api/replies');
const frontendBoardRouter = require('./routers/frontend/board');
const frontendThreadRouter = require('./routers/frontend/thread');

const app = express();

// Configurations
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());

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

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Main route defined
app.get('/', (req, res) => res.render('index'));

// Routing for API
app.use('/api', apiThreadsRouter);
app.use('/api', apiRepliesRouter);

// Routing for Frontend
app.use('/b/', frontendBoardRouter);
app.use('/b/', frontendThreadRouter);

module.exports = app;
