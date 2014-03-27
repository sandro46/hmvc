/**
 * Created with IntelliJ IDEA.
 * User: alexand7u
 * Date: 9/28/13
 * Time: 9:01 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports = function UsersController(modules) {
    this.getUser = function(callback,username,password,data){
        modules.users.repository.getUser(callback,username,password,data);
    };
};