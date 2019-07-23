var express = require('express');
var router = express.Router();
const authMiddleware = require('./../Middlewares/auth');
const userController = require('./../controllers/user');
const clueController = require('./../controllers/clue');
// 方法放置区



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/admin/login', userController.renderLogin);
router.get('/admin/user',authMiddleware.mustLogin,authMiddleware.mustRoot,userController.show,)
router.get('/admin/user/create',authMiddleware.mustLogin,function(req,res,next) {
  res.locals.nav = 'user';
  res.render('admin/user_create');
})
router.get('/admin/user/:id/edit',authMiddleware.mustLogin,userController.user)
router.get('/admin/clue',authMiddleware.mustLogin,clueController.show)
router.get('/admin/clue/:id',authMiddleware.mustLogin,clueController.log,function(req,res,next){
  res.render('admin/clue_log')
})

module.exports = router;
