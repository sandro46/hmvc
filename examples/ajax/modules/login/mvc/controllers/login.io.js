module.exports = function LoginIoController(modules,_this){
    _this.app.get('/login',function(req,res){
        req.session.lang = 'en';
        modules.login.controller.loadPage(req.session,res);
    });

    _this.app.post('/login',function(req,res){
        modules.login.controller.checkUserLogin(req.session,res,req.body.username,req.body.password);
    });
};