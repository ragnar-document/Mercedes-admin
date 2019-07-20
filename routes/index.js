var express = require('express');
var router = express.Router();
const User = require('./../models/user.js');
const { formatTime } = require('./../utils/date.js');
const Clue = require('./../models/clue.js');

// 方法放置区

const userController = {
  show: async function(req,res,next){
    try{
      const users = await User.all();
      res.locals.users = users.map((data)=>{
        data.role_display = ( data.role == 1 ) ? '管理员' : '销售';
        data.created_time_display = formatTime(data.create_time);
        return data
      });
      res.locals.nav = 'user';
      res.render('admin/user.tpl',res.locals)
    }catch(e){
      res.locals.error = e;
      res.render('error',res.locals);
    }
  },
  renderLogin:async function(req,res,next){
    // 如果用户已经登录，重定向到用户管理页面
    if(res.locals.isLogin){
      res.redirect('/admin/clue')
      return
    }
    res.render('admin/login')
  }
}

const authMiddleware = {
  mustLogin: async function(req,res,next){
    if(!res.locals.isLogin){
      res.redirect('/admin/login')
      return
    }
    next();
  },
  mustRoot: function(req,res,next){
    // console.log(res.locals.userInfo.role )
    if(res.locals.userInfo.role != 1){
      // res.writeHead(403);
      // res.end("403 Forbidden");
      res.redirect('/admin/clue')
      return
    }
    next();
  }
}

const clueController = {
  show: async function(req,res,next){
    try{
      const clues = await Clue.all();
      res.locals.clues = clues.map((data)=>{
        data.created_time_display = formatTime(data.created_time);
        return data
      });
      res.render('admin/clue.tpl',res.locals)
    }catch(e){
      res.locals.error = e;
      res.render('error',res.locals);
    }
  },
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/admin/login', userController.renderLogin);
//authMiddleware.mustLogin,authMiddleware.mustRoot,
router.get('/admin/user',authMiddleware.mustLogin,authMiddleware.mustRoot,userController.show,)

router.get('/admin/user/create',authMiddleware.mustLogin,function(req,res,next) {
  res.locals.nav = 'user';
  res.render('admin/user_create');
})

router.get('/admin/user/:id/edit',authMiddleware.mustLogin,async function(req,res,next) {
  const id = req.params.id;
  const users = await User.select({ id })
  res.locals.user = users[0]
  res.locals.nav = 'user';
  res.render('admin/user_edit');
})

router.get('/admin/clue',authMiddleware.mustLogin,clueController.show)

router.get('/admin/clue/:id',authMiddleware.mustLogin,function(req,res,next){
  res.render('admin/clue_log')
})

module.exports = router;
