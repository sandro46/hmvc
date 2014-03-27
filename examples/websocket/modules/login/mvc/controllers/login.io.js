module.exports = function LoginIoController(modules,_this){
    _this.app.io.route('login',{
        create: function(req){
            req.session.lang = 'en';
            modules.login.controller.loadPage(req.session,req.io);
        },
        auth: function(req){
            console.log(req.data);
            modules.login.controller.checkUserLogin(req.session,req.io,req.data.username,req.data.password);
        }
    });
};