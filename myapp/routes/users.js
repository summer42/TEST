var express = require('express');
var router = express.Router();
var promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      code: 200,
      result: {
        retCode: 0
      },
      data: { list: [{ data: 'test' }] }
    });
  }, 500)
});

var promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({
      code: 200,
      result: {
        retCode: 0
      },
      data: { data: 'test22222' }
    });
  }, 500)
});

var promise3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject({
      code: 500,
      result: {
        retCode: 0
      },
      data: { data: 'error' }
    });
  }, 500)
});


/* GET users listing. */
router.get('/', function (req, res) {
  res.render('user', { data: 'test' });

});

router.post('/getData1/', function (req, res, next) {
  res.locals.promise = promise1;
  next();
});

router.post('/getData2/', function (req, res, next) {
  res.locals.promise = promise2;
  next();
});

router.post('/getData3/', function (req, res, next) {
  res.locals.promise = promise3;
  next();
});

router.use(function (req, res, next) {
  if (typeof (res.locals.promise) === 'object' && typeof (res.locals.promise.then) === 'function') {
    var promsie = res.locals.promise;
    promsie.then(result => {
      res.send(result);
    }, err => { res.send(err) }).catch(err => {
      res.send(err);
    })
  };
  req.data = 123;
  next();
}, function (req, res, next) {
  console.log(req.data);
})


module.exports = router;
