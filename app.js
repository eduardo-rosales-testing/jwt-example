const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const models = require('./models');
const mongoose = require('mongoose');
// const dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog';
const dbUrl = "mongodb://e3rosale:QAZwsx123!%40@cluster0-shard-00-00.haphz.mongodb.net:27017,cluster0-shard-00-01.haphz.mongodb.net:27017,cluster0-shard-00-02.haphz.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-14mh0f-shard-0&authSource=admin&retryWrites=true&w=majority"
// connect to database
const db = mongoose.connect(dbUrl, {useMongoClient: true});
// const logger = require('morgan');
// const errorHandler = require('errorhandler');
const session = require('express-session');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
let app = express();
app.locals.appTitle = 'blog-express';
// expose collections to all other middlware and routes
app.use((req, res, next) => {
  if (!models.Article || !models.User) 
    return next(new Error('No models.'));
  req.models = models;
  return next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Express.js middleware configuration
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F', resave: true, saveUninitialized: true}));
// app.use(methodOverride());
// app.use(require('stylus').middleware(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));

// development only
// if (app.get('env') === 'development') {
//   app.use(errorHandler('dev'));
// }

// Pages and routes
app.get('/', routes.index);
app.get('/login', routes.user.login);
app.post('/login', routes.user.authenticate);

// app.get('/logout', (req, res, next) => {
//   res.send("[GET]: /logout page");
// });

app.get('/admin', (req, res, next) => {
  res.render('admin', {articles: []});
});

// app.get('/post', (req, res, next) => {
//   res.send("[GET]: /post page")
// });

// app.post('/post', (req, res, next) => {
//   res.send("[POST]: /post page");
// });

// app.get('/articles/:slug', (req, res, next) => {
//   res.send("[GET]: /articles/:slug page")
// });

// REST API routes

app.all('*', (req, res) => {
  res.status(404).send();
});

const server = http.createServer(app);
const boot = () => {
  server.listen(app.get('port'), () => {
    console.info(`Express.js server is listening on port ${app.get('port')}`);
  });
}

const shutdown = () => {
  server.close();  
}

if (require.main === module) {
  boot();
} else {
  console.info('Running app as a module');
  exports.boot = boot;
  exports.shutdown = shutdown;
  exports.port = app.get('port');
}
