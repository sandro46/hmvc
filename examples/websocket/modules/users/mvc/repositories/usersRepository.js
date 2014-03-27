module.exports = function UsersRepository(db) {
    this.getUser = function(callback,username,password,data){
        db.query("Select * from users where username=? and password=?",[username,password],callback.bind(null, data));
    };
};