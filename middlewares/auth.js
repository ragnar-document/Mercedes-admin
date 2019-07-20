const User = require('./../models/user.js')

const authMiddleware = {
    mustLogin: async function(req,res,next){
      if(res.locals.isLogin){
        res.redirect('/admin/login')
        return
      }
      
      next();
    },
    mustRoot: function(req,res,next){
      if(res.locals.userInfo.role != 1){
        res.writeHead(403);
        res.end("403 Forbidden");
        return
      }
      next();
    }
  }
  
  module.exports = authMiddleware;