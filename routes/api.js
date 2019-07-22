var express = require('express');
var router = express.Router();
const User = require('./../models/user.js');
const Clue = require('./../models/clue.js');
const ClueLog = require('./../models/log.js');
const authCodeFunc = require('./../utils/authCode.js');


const userController = {
  insert: async function(req,res,next){
    let name = req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;
    let role = req.body.role;
    let create_time = new Date();
  
    if(!name || !phone || !password){
      res.json({
        code:200,
        message:'缺少必要参数' 
      })
      return
    }
  
    try{
      const users = await User.insert({
        name,phone,password,role,create_time
      })
      res.json({
        code:200,
        data:users
      })
    }catch(e){
      console.log(e)
      res.json({code:0,message:'内部错误'})
    }
  },
  login:async function(req,res,next){
    let phone = req.body.phone;
    let password = req.body.password;
    
    //判断是否有输入内容
    if (!phone || !password) {
      res.json({
        code:0,
        message:'参数不全'
      })
      return
    }
  
    try {
      //查找用户模型
      const users = await User.select({phone,password})
      const user = users[0];
      console.log(users[0])
      if (user) {
         // 将其邮箱、密码、id 组合加密
         let auth_Code = phone +'\t'+ password +'\t'+ user.id +'\t'+ user.role;
         auth_Code = authCodeFunc(auth_Code,'ENCODE');
         // 加密防止再 cookie 中，并不让浏览器修改
         res.cookie('ac', auth_Code, { maxAge: 24* 60 * 60 * 1000, httpOnly: true });
         res.cookie('user_name', user.name, { maxAge: 24* 60 * 60 * 1000, httpOnly: true });
         // 返回登录的信息
         res.json({ code: 200, message: '登录成功！'})
      }else{
        res.json({ code: 0, message: '登录失败，没有此用户！' })
      }
    } catch (error) {
      res.json({ code:0, message:'系统问题'})
    }
  },
  
  update: async function(req,res,next) {
    let name = req.body.name;
    let phone = req.body.phone;
    let password = req.body.password;
    let role = req.body.role;
    let id = req.params.id;
    
    console.log(name,phone,password);
    
    if(!name || !phone || !password || !role){
      res.json({ code: 0, message: '缺少必要参数' });
      return
    }
  
    try{
      const users = await User.update( id ,{ 
        name, phone, password, role
      });
      res.json({ code: 200, data: users })
    }catch(e){
      console.log(e)
      res.json({ code: 0, message: '内部错误' })
    }
  },
  renderUserCreate: function(req,res,next) {
    res.locals.nav = 'user';
    res.render('admin/user_create');
  },
}

const clueController = {
  insert:async function(req,res,next){
    let name = req.body.name;
    let phone = req.body.phone;
    let utm = req.body.utm;
    let created_time = new Date();

    if (!name || !phone) {
      res.json({
        code:0,
        message:"缺少参数"
      })
      return
    }
    
    try {
      const clues = await Clue.insert({name,phone,utm,created_time})
      res.json({
        code:200,
        data:clues
      })
    } catch (error) {
      console.log(error);
      res.json({code:0,message:'内部错误'})
    }
  },
  addLog:async function(req,res,next){
    let content = req.body.content;
    let created_time = new Date();
    let clue_id = req.params.id;

    
    if (!content) {
      res.json({
        code:0,
        message:'缺少参数'
      })
    }

    try {
      const clue = await ClueLog.insert({
        content,created_time,clue_id
      });
      res.json({
        code:200,
        data:clue
      })  
    } catch (error) {
      console.log(error);
      res.json({code:0,message:'内部错误'})
    }
  },
  update: async function(req,res,next) {
    let status = req.body.status;
    console.log(status);
    
    let remark = req.body.remark;
    let id = req.params.id;
    let user_id = req.body.user_id;
    if(!status || !remark){
      res.json({ code: 0, message: '缺少必要参数' });
      return
    }

    try{
      const clue = await Clue.update( id ,{ 
        status,user_id,remark
      });
      res.json({ 
        code: 200, 
        data: clue
      })
    }catch(e){
      console.log(e)
      res.json({ 
        code: 0,
        message: '内部错误'
      })
    }
  },
}


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/user',userController.insert);

router.put('/user/:id',userController.update)

router.post('/login',userController.login)

router.get('/logout',async function(req,res,next){
  res.clearCookie('ac');
  res.redirect('/admin/login')
})

router.post('/clue',clueController.insert)

router.put('/clue/:id',clueController.update)

router.post('/clue/:id/log', clueController.addLog);



module.exports = router;
