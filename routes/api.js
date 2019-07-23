var express = require('express');
var router = express.Router();
const User = require('./../models/user.js');
const Clue = require('./../models/clue.js');
const ClueLog = require('./../models/log.js');
const authCodeFunc = require('./../utils/authCode.js');
const userController = require('./../controllers/user');
const clueController = require('./../controllers/clue');






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
