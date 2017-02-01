const shortid = require('shortid');

const utils = require('../lib/utils');

module.exports = (database) => {
  const router = require('express').Router();

  router.get('/urls', (request, response) => {
    let user = request.cookies['userid'];
    
    database.getAllUrlsForUser(user, (urls) => {
      response.render('urls_index', {
        urls: urls
      });
    });
  });

  router.post('/urls', (request, response) => {
    let user = request.cookies['userid'];
    let long = utils.cleanUrl(request.body.long);
    let short = shortid();

    database.createUrl({
      short: short,
      long: long,
      user_id: user
    }, () => {
      response.redirect('/urls');
    });
  });

  router.get('/urls/:short', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;

    database.getUrl(short, (url) => {
      response.render('urls_show', {
        short: url.short,
        long: url.long
      });
    });
  });

  router.post('/urls/:short/edit', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;
    let long = request.body.long;

    database.updateUrl(short, long, () => {
      response.redirect('/urls');
    });
  });

  router.post('/urls/:short/delete', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;

    database.deleteUrl(short, () => {
      response.redirect('/urls');
    });
  });

  return router;
}