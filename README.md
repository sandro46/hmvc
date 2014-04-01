hmvc
====

A hierarchical mvc framework for node.js.
I created this framework in order to create my bachelor degree project.

  
Instalation
====

    npm install hmvc

Usage
====
In order to function properly hmvc require this structure in every module:
       
        {module name}
        |
        --css
          |
          -- login.css
        |
        --javascript
          |
          -- login.js
          -- login.io.js
        |
        --mvc
           |
           --controllers
              |
              -- login.js
              -- login.io.js
           |
           --models
           |
           --views
              |
              -- login.html
              
To call a controller from a module you can write:
    
    module.{moduleName}.controller.{function}() // the main controller
    module.{moduleName}.controllers.{class}.{function}() // specific controller

Example if you have a module named login and a controller in this module named LoginController you can call:

    module.login.controller.loadPage();
    module.login.controllers.LoginController.loadPage();
        
For a view you will have
    
    module.{moduleName}.view which is a object with the functions:
      - path ( a function that get's the view absolute path )
      - render ( renders a view with a renderer like ejs.render, must be specified in hmvc constructor params)
      - getLang ( return a file with multilanguage support, must be specified in hmvc constructor params)
And if you have multiple views:
    
    module.{moduleName}.views.{viewName} // views are considered only files with .html extensions
        
For a model you will need to intializate a object with the new keyword.
    
    var model = new module.{moduleName}.model(); // for one
    var model = new module.{moduleName}.models.{modelName}. // for multiple

P.S : the name is not the filename *.js but the class inside that have module.exports.

Simple example
====
Application structure
    
    Simple app
    |
    -- modules
      test
      |
      --mvc
        |
        --controllers
          |
          --test.js
          --test.io.js
        --views
          |
          --test.html
    -- node_modules
    -- app.js

the main file(app.js)
```js
Hmvc = require('hmvc');
express = require('express');
ejs = require('ejs');
var app = express();

app.configure(function () {
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
    app.use(express.static(__dirname + '/plugins/'));
});

hmvc = new Hmvc({app:app,view_extension:'html'});

hmvc.loadModules(__dirname+"/modules");
var modules = hmvc.modules;

app.listen(7076);
```

test.js file
```js
module.exports = function TestController(modules,_this){
    this.load = function(res){
        res.render('test'); // in this case you will need to ensure that are no name conflicts in multiple modules
        //res.render(modules.test.view.path());// in this case you don't
        //res.render(modules.test.view.path(),{modules:modules}) // if you want the modules in the view, this is made automatically in render function of view object, but this works only with websockets see example for more info.
    }
};
```
test.io.js file
```js
module.exports = function TestIOController(modules,_this){
    _this.app.get('/test',function(req,res){
        modules.test.controller.load(res);
    });
};
```
test.html file
```html
<html>
<head></head>
<body>
    This is a test
</body>
</html>
```
P.S in _this are send the parameters that you give to hmvc constructor except for langfile and sqlStatements which are reserved.

Simple example(jade)
====
The differences between jade and ejs application are only in view and main file(app.js)
app.js

```js
Hmvc = require('hmvc');
express = require('express');
ejs = require('jade');
var app = express();

app.configure(function () {
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/plugins/'));
});

hmvc = new Hmvc({app:app,view_extension:'jade'});

hmvc.loadModules(__dirname+"/modules");
var modules = hmvc.modules;

app.listen(7076);
```

test.jade

```jade
html
    head
    body
        This is a test
        =modules.test.view.path()
```

Simple example(websocket) - ejs
====
the main file(app.js)
```js
  Hmvc = require('hmvc');
express = require('express.io');
ejs = require('ejs');
var app = express().http().io();

app.configure(function () {
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
    app.use(express.static(__dirname + '/plugins/'));
});

hmvc = new Hmvc({app:app,renderer:ejs.render,view_extension:'html'});

hmvc.loadModules(__dirname+"/modules");
var modules = hmvc.modules;

app.get('/',function(req,res){
   res.render(modules.layout.view.path(),{
       javascripts:modules.javascripts
   });
});

app.listen(7076);
```

test.io.js(server)
```js
module.exports = function TestIOController(modules,_this){
    _this.app.io.route('test:create',function(req){
        modules.test.controller.load(req.io);
    });
};
```

test.js(server)
```js
module.exports = function TestController(modules){
    this.load = function(socket){
        socket.emit("test:created",modules.test.view.render({}));
    }
};
```

test.io.js(client)
```js
function TestIO(){

}

TestIO.create= function(){
    socket.emit('test:create');
};

socket.on('test:created',function(data){
   $("#test_container").html(data);
});
```

test.js(client)
```js
function Test(){
    TestIO();
}

Test.load = function(){
    TestIO.create();
};
```

test.html file
```html
<html>
<head></head>
<body>
This is a test ejs <%= modules.test.view.path() %>
</body>
</html>
```

index.html file
```html
<html>
<head>
    <script language="javascript" src="jquery/jquery.js"></script>
    <script src="/socket.io/socket.io.js"></script>
    <script language="javascript">
        var socket = io.connect();
    </script>
    <% javascripts.forEach(function(javascript){ %>
    <script type="text/javascript" src="<%= javascript %>"></script>
    <% }) %>
    <script>
        $(document).ready(function(){
            Test();
            Test.load();
        });
    </script>
</head>
<body>
<div id='test_container'></div>
</body>
</html>
```

license
====

The MIT License (MIT)

Copyright (c) 2014 Paraschiv Alexandru Nicolae

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
