hmvc
====

A hierarchical mvc framework for node.js.
I created this framework in order to create my bachelor degree project.

Dependencies
====

The framework was tested in node.js 0.10 and the requested frameworks are:
  -express
  -ejs(I will put a jade example soon if i have time).

Usage
====
To call a controller from a module you can write:
    
    module.{moduleName}.controller.{function}() // the main controller
    module.{moduleName}.controllers.{class}.{function}() // specific controller
Example if you have a module named login and a controller in this module named LoginController you can call:
    
    module.login.controller.loadPage();
    module.login.controllers.LoginController.loadPage();
        
For a view you will have
    
    module.login.view which is a object with the functions:
      - path ( a function that get's the view absolute path )
      - render ( renders a view with a renderer like ejs.render, must be specified in hmvc constructor params)
      - getLang ( return a file with multilanguage support, must be specified in hmvc constructor params)
And if you have multiple views:
    
    module.login.views.{viewName} // views are considered only files with .html extensions
        
For a model you will need to intializate a object with the new keyword.
    
    var loginModel = new module.login.model(); // for one
    var loginModel = new module.login.models.{modelName}. // for multiple

P.S : the name is not the filename *.js but the class inside that have module.exports.
      
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
