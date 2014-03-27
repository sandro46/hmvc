/**
 * Created by alexand7u on 2/5/14.
 */

LoginIO = function(){
    $.get('/login',function(data){
        $("#login_container").html(data);
        Login.load();
    });
};

LoginIO.authenticate = function(data){
    $.post('/login',data,function(data){
       alert(data);
    });
};
