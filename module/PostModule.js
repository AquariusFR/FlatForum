/*global console : false, exports: false */
var build = function (persistenceModule) {
    'use strict';
    console.log("PostRessource");
    var postInterface = persistenceModule.getModelInterface({
        subject: String,
        text: String,
        user: String,
        created: {
            "type": Date,
            "default": Date.now
        },
        updated: {
            "type": Date,
            "default": Date.now
        }
    }, "post");

    console.log("post schema created");
    var listPost = function (callback, ressource) {


        var defaultSort = {
            created: "asc"
        };
        var query = {
            subject: ressource.subject
        };

        postInterface(query).sort(defaultSort).exec(processResult(callback));
    };

    var processResult = function (callback) {
        return function (err, searchPost) {
            if (err) {
                errorMongoPost(err);
                return callback({
                    error: err
                });
            }
            if (null === searchPost) {
                callback({
                    error: "error finding subjects"
                }, 404);
                return;
            }
            callback(searchPost);
        };
    };
    var errorMongoPost = function (err, fluffy) {
        if (err) {
            return console.error(err);
        }
    };

    var isNullOrUndefined = function (val) {
        if (typeof (val) === "undefined") {
            return true;
        }
        return val === null;
    };

    var updateIfNotNull = function (object, property, val) {
        if (isNullOrUndefined(val)) {
            return;
        }
        object[property] = val;
    };

    var createPost = function (body, callback, ressource) {
    	//postInterface.factory();
        var createdPost = postInterface.factory();
        var subject = ressource.subject;
        var text = body.text;
        var user = body.user;

        if (isNullOrUndefined(subject) || isNullOrUndefined(text) || isNullOrUndefined(user)) {
            callback({
                error: "user, text and subject are required",
                post: body
            }, 400);
            return;
        }

        createdPost.subject = subject;
        createdPost.text = text;
        createdPost.user = user;
        createdPost.save(errorMongoPost);
        callback(createdPost);
    };
    var retrievePost = function (id, callback, ressource) {
        PostModel.findById(id, function (err, retrievedPost) {
            if (err) {
                errorMongoPost(err);
                return callback({
                    error: err
                });
            }
            if (null === retrievedPost) {
                callback({
                    error: "cannot find " + id
                }, 404);
                return;
            }

            if (retrievedPost.subject !== ressource.subject) {
                callback({
                    error: "cannot find " + id + " with subject" + retrievedPost.subject
                }, 404);
            }

            callback(retrievedPost);
        });
    };
    var updatePost = function (id, body, callback) {
        console.log('Post update, id:' + id + ', update:' + body);
        PostModel.findById(id, function (err, postToUpdate) {
            if (err) {
                errorMongoPost(err);
                return callback({
                    error: err
                });
            }
            if (null === postToUpdate) {
                callback({
                    error: "cannot find " + id
                }, 404);
                return;
            }

            var subject = body.subject;
            var text = body.text;
            var user = body.user;
            updateIfNotNull(postToUpdate, "subject", subject);
            updateIfNotNull(postToUpdate, "text", text);
            updateIfNotNull(postToUpdate, "user", user);
            postToUpdate.save(errorMongoPost);
            callback(postToUpdate);
        });
    };
    var deletePost = function (id, callback) {
        PostModel.findByIdAndRemove(id, function (err, deletedPost) {
            if (err) {
                errorMongoPost(err);
                return callback({
                    error: err
                });
            }
            if (null === deletedPost) {
                callback({
                    error: "cannot find " + id
                }, 404);
                return;
            }
            callback(deletedPost);
        });
    };

    return {
        create: createPost,
        retrieve: retrievePost,
        update: updatePost,
        del: deletePost,
        list: listPost
    };
};

exports.build = build;
