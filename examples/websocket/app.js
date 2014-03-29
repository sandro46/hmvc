Hmvc = require('hmvc');
express = require('express.io');
ejs = require('ejs');
connect = require('connect');
var app = express().http().io();


var cookieParser = express.cookieParser('your secret sauce'),
    sessionStore = new connect.middleware.session.MemoryStore();

app.configure(function () {
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');

    app.use(express.static(__dirname + '/plugins/'));

    app.use(express.cookieParser('bleah'));
    app.use(express.bodyParser());
    app.use(express.session({
        secret:'your secret sauce',
        store: sessionStore,
        expires : new Date(Date.now() + 3600000)
    }));
});

hmvc = new Hmvc({app:app,renderer:ejs.render,view_extension:'html'});

hmvc.setMysqlHost({
    host : 'yourhost',
    user: 'youruser',
    password: 'yourpassword',
    database: 'yourdb'
});
hmvc.loadModules(__dirname+"/modules");
var modules = hmvc.modules;

app.get('/', function(req, res){
    res.render('index', {
        stylesheets: modules.stylesheets,
        javascripts: modules.javascripts
    });
});

app.listen(7076);
