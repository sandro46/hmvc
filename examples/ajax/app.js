Hmvc = require('hmvc');
express = require('express');
ejs = require('ejs');
var app = express();

app.configure(function () {
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');

    app.use(express.static(__dirname + '/plugins/'));

    app.use(express.cookieParser('bleah'));
    app.use(express.bodyParser());
    app.use(express.session());
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
