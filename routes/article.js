exports.admin = (req, res, next) => {
  req.models.Article.list((error, articles) => {
    if (error)
      return next(error);
    res.render('admin', {articles: articles});
  });
}

exports.post = (req, res, next) => {
  if (!req.body.title)
    res.render('post');
}

exports.postArticle = (req, res, next) => {
  if (!req.body.title || !req.body.slug || !req.body.text) {
    return res.render('post', {error: 'Fill title, slug and text.'});
  }
  var article = {
    title: req.body.title,
    slug: req.body.slug,
    text: req.body.text,
    published: false
  }
  req.models.Article.create(article, (error, articleResponse) => {
    if (error)
      return next(error);
    res.render('post', {error: 'Article was added. Publish it on Admin page.'});
  })
}