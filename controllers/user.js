const User = require('./../models/user.js');
const { formatTime } = require('./../utils/date.js');
const authCodeFunc = require('./../utils/authCode.js');

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
    },
    user: async function(req,res,next) {
        const id = req.params.id;
        const users = await User.select({ id })
        res.locals.user = users[0]
        res.locals.nav = 'user';
        res.render('admin/user_edit');
    },
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

module.exports = userController;