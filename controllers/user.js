const User = require('./../models/user.js');
const { formatTime } = require('./../utils/date.js');

const userController = {
    show: async function(req,res,next){
        try{
            const users = await User.all();
            res.locals.users = users.map((data)=>{
            data.role_display = ( data.role == 1 ) ? '管理员' : '销售';
            data.created_time_display = formatTime(data.created_time);
            return data
            });
            res.locals.nav = 'user';
            res.render('admin/user.tpl',res.locals)
        }catch(e){
            res.locals.error = e;
            res.render('error',res.locals);
        }
    },
}

module.export = userController;