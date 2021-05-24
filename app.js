const express = require('express');
const http = require('http');
const path = require('path');
const mongoskin = require('mongoskin');
const dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/blog';

const db = mongoskin.db(dbUrl);
const collections = {
  articles: db.collection('articles'),
  users: db.collection('users')
};
let app = express();
app.locals.appTitle = 'blog-express';
// expose collections to all other middlware and routes
app.use((req, res, next) => {
  if (!collections.articles || !collections.users)
    return next(new Error('No collections.'));
  req.collections = collections;
  return next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.all('*', (req, res) => {
  res.render('index', {msg: 'Welcome to Practical Node.js!'});
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
