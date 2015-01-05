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
        mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        // module perso
        restModule = require('./module/RestModule'),
        subjectModule = require('./module/SubjectModule'),
        postModule = require('./module/PostModule'),
        searchTokenModule = require('./module/SearchTokenModule'),
        searchPostModule = require('./module/SearchPostModule'),
        db = null,
        serverInstance = express(),
        index = null,
        setFolder = function (folder) {
            console.log("open access to " + '/' + folder + ' routes to ' + __dirname + '/' + folder);
            serverInstance.use('/' + folder, express["static"](folder));
        },
        connectionOpen = function callback() {

            var post = new postModule.build(mongoose),
                subject = new subjectModule.build(mongoose),
                postSearch = new searchPostModule.build(mongoose);
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

    mongoose.connect('mongodb://localhost/test');
    db = mongoose.connection;
    for (index in folders) {
        if (folders.hasOwnProperty(index)) {
            setFolder(folders[index]);
        }
    }
    serverInstance.use(express["static"](__dirname + '/public'));
    serverInstance.use(bodyParser.urlencoded({
        extended: false
    }));
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', connectionOpen);
};
init();
