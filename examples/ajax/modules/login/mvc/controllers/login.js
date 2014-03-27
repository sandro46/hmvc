var ejs = require('ejs'),
    fs  = require('fs');

module.exports = function LoginController(modules,_this) {
    this.loadPage = function(session,res){
        res.render('login',{session:session,lang:modules.login.view.getLang()});
    };

    this.checkUserLogin = function(session,res,username,password){
        modules.users.controller.getUser(checkUserLoginCallback,username,password,{session:session,res:res});
    };

    function checkUserLoginCallback(data,err,result){
        if (err)
            throw err;
        if (!result[0]){
            data.res.writeHead(200, {'Content-Type': 'text/plain'});
            data.res.write("nu ai fost logat");
            data.res.end();
        }else{
            data.session.user = result[0];
            data.session.save();

            data.res.writeHead(200, {'Content-Type': 'text/plain'});
            data.res.write("ai fost logat");
            data.res.end();
        }
    }
};