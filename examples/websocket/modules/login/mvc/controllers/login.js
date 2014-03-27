module.exports = function LoginController(modules,_this) {
    this.loadPage = function(session,socket){
        socket.emit('login:created',modules.login.view.render({session:session,lang:modules.login.view.getLang()}));
    };

    this.checkUserLogin = function(session,socket,username,password){
        modules.users.controller.getUser(checkUserLoginCallback,username,password,{session:session,socket:socket});
    };

    function checkUserLoginCallback(data,err,result){
        if (err)
            throw err;
        if (!result[0]){
            data.socket.emit("login:authenticated","nu ai fost logat");
        }else{
            data.session.user = result[0];
            data.session.save();
            data.socket.emit("login:authenticated","ai fost logat");
        }
    }
};