function Login(username){
    LoginIO();
}

Login.load = function(){
    $("#lbutton").on('click',function(){
        LoginIO.authenticate({username:$("#username").val(),password:$("#password").val()});
    });
};