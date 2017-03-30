var express = require('express');
var router = express.Router();

var rest = require('rest');
var client = rest.wrap(require('rest/interceptor/mime'), {
  mime: 'application/json'
}).wrap(require('rest/interceptor/timeout'), {
  timeout: 10e3
}).wrap(require('rest/interceptor/errorCode'));

var rootUrl = 'http://localhost:8501/todos/';

/* GET users listing. */
router.post('/', function(req, res, next) {
  client({
    path: rootUrl
  }).then(function(resp) {
    resp.entity.todos.reverse();
    res.send(resp.entity);
  }, function(resp) {
    res.send(resp.entity);
  });
});

router.post('/add', function(req, res, next) {
  var todo = req.body.todo;
  if (!todo.title) {
    res.status(500).send({
      code: 0,
      errorMsg: 'Cannot add empty todo.'
    });
    return;
  }
  client({
    path: rootUrl + 'add',
    entity: {
      todo: todo
    }
  }).then(function(resp) {
    res.send(resp.entity);
  }, function(resp) {
    res.send(resp.entity);
  });
});

router.post('/toggle', function(req, res, next) {
  var todo = req.body.todo;
  client({
    path: rootUrl + 'update',
    entity: {
      todo: todo
    }
  }).then(function(resp) {
    res.send(resp.entity);
  }, function(resp) {
    res.send(resp.entity);
  });
});

router.post('/destroy', function(req, res, next) {
  var todo = req.body.todo;
  if (!todo) {
    res.send({
      code: 0,
      errorMsg: 'Parameter `todo` cannot be null or undefined.'
    });
    return;
  }
  var id = todo.id;
  client({
    path: rootUrl + 'remove',
    entity: {
      id: id
    }
  }).then(function(resp) {
    res.send(resp.entity);
  }, function(resp) {
    res.send(resp.entity);
  })
});

router.post('/modify', function(req, res, next) {
  var todo = req.body.todo;
  client({
    path: rootUrl + 'update',
    entity: {
      todo: todo
    }
  }).then(function(resp) {
    res.send(resp.entity);
  }, function(resp) {
    res.send(resp.entity);
  });
});

module.exports = router;
