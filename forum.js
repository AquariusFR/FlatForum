/**
 * New node file
 */
/*jslint nomen: true*/
/*jshint es5: true */
/*global require: false,__dirname : false, console: false*/
var init = function () {
    'use strict';
    var folders = ['css', 'app', 'js', 'img', 'data', 'template'],
        express = require('express'),
        bodyParser = require('body-parser'),
        // module perso
        persistenceModule = require('./module/Persistence'),
        restModule = require('./module/RestModule'),
        subjectModule = require('./module/SubjectModule'),
        postModule = require('./module/PostModule'),
        searchPostModule = require('./module/SearchPostModule'),
        serverInstance = express(),
        index = null,
        setFolder = function (folder) {
            console.log("open access to " + '/' + folder + ' routes to ' + __dirname + '/' + folder);
            serverInstance.use('/' + folder, express["static"](folder));
        },
        connectionOpen = function callback() {

            var post = new postModule.build(persistenceModule),
                subject = new subjectModule.build(persistenceModule),
                postSearch = new searchPostModule.build(persistenceModule);
            console.log("connection open");
            serverInstance.use(bodyParser.json());
            restModule.restRessource(serverInstance, "", "post", post, ["subject"]);
            restModule.restRessource(serverInstance, "", "subject", subject);
            restModule.restRessource(serverInstance, "/post", "search", postSearch);
            serverInstance.use(function (req, res, next) {
                res.setHeader('Content-Type', 'text/html');
                var error = '<html><body>';
                error += '<div>Page introuvable</div>';
                error += '</body></html>';
                res.status(404).send(error);
            });
            serverInstance.listen(8080);
            console.log('dirName:' + __dirname);
            console.log('Express Server running at http://127.0.0.1:8080/');
        };

    for (index in folders) {
        if (folders.hasOwnProperty(index)) {
            setFolder(folders[index]);
        }
    }
    serverInstance.use(express["static"](__dirname + '/public'));
    serverInstance.use(bodyParser.urlencoded({
        extended: false
    }));

    persistenceModule.connect()
    	.success(connectionOpen)
    	.error(function(data){
    		console.error('connection error:', data);
    		}
    	);
    
};
init();
