LoginIO = function(){
    socket.emit('login:create');
};
LoginIO.authenticate = function(data){
    socket.emit('login:auth',data);
};

socket.on('login:created',function(data){
    $("#login_container").html(data); // div in home page
    Login.load();
});

socket.on('login:authenticated',function(data){
    alert(data);
});