module.exports = hmvc;
var fs = require("fs"),
    mysql = require('mysql'),
    $ = require('jquery');

function hmvc(params){
    var _this = this;

    this.setMysqlHost = function(host){
        this.client =mysql.createConnection(host);
        this.client.connect();
    };

    this.load = function(modulesDirectory,parent){
        var dirs = fs.readdirSync(modulesDirectory);
        $.each(dirs,function(index,dir){
            if (parent == undefined){
                _this.modules[dir] = {
                    controllers : {},
                    models : {},
                    repositories : {},
                    views : {}
                };
                loadModule(_this.modules[dir],dir,modulesDirectory);
            }else{
                _this.modules[parent][dir] = {
                    controllers : {},
                    models : {},
                    repositories : {},
                    views : {}
                };
                loadModule(_this.modules[parent][dir],dir,modulesDirectory);
            }

            if (fs.existsSync(modulesDirectory+"/"+dir+"/modules")) {
                _this.load(modulesDirectory+"/"+dir+"/modules",dir);
            }
        });
    }

    this.loadModules = function(modulesDirectory){
        _this.modules = {};
        _this.views = [];
        _this.modules.stylesheets = [];
        _this.modules.javascripts = [];

        if (params.sqlfile != undefined){
            _this.sqls = require(modulesDirectory+"/"+params.sqlfile+".js");
        }
        if (params.langfile != undefined){
            _this.lang = require(modulesDirectory+"/"+params.langfile+".js");
        }
        _this.load(modulesDirectory);
        ViewEnableMultiFolders(params.app);
        params.app.set('views', this.views);
    };

    function loadModule(current,dir,modulesDirectory){
        _this.views.push(modulesDirectory+"/"+dir+"/mvc/views");
        current.path = modulesDirectory+"/"+dir;
        loadViews(current,dir,modulesDirectory);
        loadControllers(current,dir,modulesDirectory);
        loadModels(current,dir,modulesDirectory);
        loadRepositories(current,dir,modulesDirectory);

        loadCssFiles(dir,modulesDirectory);
        loadJavascriptFiles(dir,modulesDirectory);
    }

    function loadCssFiles(dir,modulesDirectory){
        try{
            var css = fs.readdirSync(modulesDirectory+"/"+dir+"/css/");
        }catch(e){
            return;
        }
        $.each(css,function(index,file){
           params.app.get("/"+file,function(req,res){
               var data = fs.readFileSync(modulesDirectory+"/"+dir+"/css/"+file);
               res.set('Content-Type', 'text/css');
               res.write(data);
               res.end();
           });
            _this.modules.stylesheets.push(file);
        });
    }

    function loadJavascriptFiles(dir,modulesDirectory){
        try{
            var javascript = fs.readdirSync(modulesDirectory+"/"+dir+"/javascript/");
        }catch(e){
            return;
        }
        $.each(javascript,function(index,file){
            params.app.get("/"+file,function(req,res){
                var data = fs.readFileSync(modulesDirectory+"/"+dir+"/javascript/"+file);
                res.set('Content-Type', 'text/javascript');
                res.write(data);
                res.end();
            });
            _this.modules.javascripts.push(file);
        });
    }

    function loadModels(current,dir,modulesDirectory){
        try{
            var models = fs.readdirSync(modulesDirectory+"/"+dir+"/mvc/models/");
        }catch(e){
            return;
        }
        $.each(models,function(index,file){
            try{
                 var module = require(modulesDirectory+"/"+dir+"/mvc/models/"+file);
                current.model = module;
                current.models[module.name] = module;
            }catch(e){
                console.log("Warning: Your model function has been defined incorect in file "+file);
            }
        });
    }

    function loadControllers(current,dir,modulesDirectory){
        try{
            var controllers = fs.readdirSync(modulesDirectory+"/"+dir+"/mvc/controllers/");
        }catch(e){
            return;
        }
        $.each(controllers,function(index,file){
            try{
                var module = require(modulesDirectory+"/"+dir+"/mvc/controllers/"+file);
                var object = new module(_this.modules,{app:params.app});
                current.controller = object;
                current.controllers[module.name] = object;
            }catch(e){
                console.log(e.message);
                console.log("Warning: Your controller function has been defined incorect in file "+file);
            }
        });
    }

    function loadRepositories(current,dir,modulesDirectory){
        try{
            var repositories = fs.readdirSync(modulesDirectory+"/"+dir+"/mvc/repositories/");
        }catch(e){
            return;
        }

        $.each(repositories,function(index,file){
            try{
                var module = require(modulesDirectory+"/"+dir+"/mvc/repositories/"+file);
                var object = new module(_this.client);
                if (_this.sqls)
                    object["sqls"] = _this.sqls[dir];

                current.repository = object;
                current.repositories[module.name] = object;
            }catch(e){
                console.log("Warning: Your repository function has been defined incorect in file "+file+"\nError:"+ e.message);
            }
        });
    }

    function loadViews(current,dir,modulesDirectory){
        try{
            var views = fs.readdirSync(modulesDirectory+"/"+dir+"/mvc/views/");
        }catch(e){
            return;
        }

        current.views = [];
        current.files = function(f){
            this.content = function(){
                return fs.readFileSync(__dirname + '/../views/index.txt',"ascii");
            }
            this.path = function(){
                return modulesDirectory+"/"+dir+"/mvc/views/"+f;
            }
        }

        $.each(views,function(index,file){
            try{
                if (file.split(".")[1] == params.view_extension){
                    current.view = new function(modules){
                        var self = this;
                        self.renderer = params.renderer;
                        self.lang = _this.lang;

                        self.content = function(){
                            return fs.readFileSync(modulesDirectory+"/"+dir+"/mvc/views/"+file,"ascii");
                        }
                        self.path = function(){
                            return modulesDirectory+"/"+dir+"/mvc/views/"+file;
                        }
                        self.render = function(locals){
                            locals["modules"] = modules;
                            locals["lang"] = self.lang;
                            return self.renderer(this.content(), { locals: locals });
                        }
                        self.getLang = function(){
                            return self.lang;
                        }
                    }
                    current.views[file.split(".")[0]] = current.view;
                }
            }catch(e){
                console.log("Warning: Your view has been defined incorect in file "+file+" Error: "+ e.message);
            }
        });
    }

    function ViewEnableMultiFolders(app) {
        var lookup_proxy = params.app.get('view').prototype.lookup;

        app.get('view').prototype.lookup = function(viewName) {
            var context, match;
            if (this.root instanceof Array) {
                for (var i = 0; i < this.root.length; i++) {
                    context = {root: this.root[i]};
                    match = lookup_proxy.call(context, viewName);
                    if (match) {
                        return match;
                    }
                }
                return null;
            }
            return lookup_proxy.call(this, viewName);
        };
    }

}
