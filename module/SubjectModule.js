/*global console : false, exports: false */
var build = function (mongoose) {
    'use strict';
    console.log("SubjectRessource");
    var SubjectSchema = mongoose.Schema({
            name: String,
            text: String,
            category: String,
            user: String,
            parentSubjectId: {
                "type": String,
                "default": "root"
            },
            created: {
                "type": Date,
                "default": Date.now
            },
            updated: {
                "type": Date,
                "default": Date.now
            }
        }),
        Subject = mongoose.model('subject', SubjectSchema),

        errorMongoSubject = function (err, fluffy) {
            if (err) {
                return console.error(err);
            }
        },
        processResult = function (callback) {
            return function (err, searchSubject) {
                if (err) {
                    errorMongoSubject(err);
                    return callback({
                        error: err
                    });
                }
                if (null === searchSubject) {
                    callback({
                        error: "cannot find subjects ..."
                    }, 404);
                    return;
                }
                callback(searchSubject);
            };
        },
        listSubject = function (callback) {

            var find = Subject.find();

            find.exec(processResult(callback));
        },
        createSubject = function (body, callback) {
            var createdSubject = new Subject();
            createdSubject.name = body.name;
            createdSubject.text = body.text;
            createdSubject.category = body.category;
            createdSubject.save(errorMongoSubject);
            callback(createdSubject);
        },
        retrieveSubject = function (id, callback) {
            Subject.findById(id, function (err, retrievedSubject) {
                if (err) {
                    errorMongoSubject(err);
                    return callback({
                        error: err
                    });
                }
                if (null === retrievedSubject) {
                    callback({
                        error: "cannot find " + id
                    }, 404);
                    return;
                }
                retrievedSubject.status = "retrieved";
                callback(retrievedSubject);
            });
        },
        isNullOrUndefined = function (val) {
            if (typeof (val) === "undefined") {
                return true;
            }
            return val === null;
        },
        updateIfNotNull = function (object, property, val) {
            if (isNullOrUndefined(val)) {
                return;
            }
            object[property] = val;
        },

        updateSubject = function (id, body, callback) {
            console.log('Subject update, id:' + id + ', update:' + body);
            Subject.findById(id, function (err, SubjectToUpdate) {
                if (err) {
                    errorMongoSubject(err);
                    return callback({
                        error: err
                    });
                }
                if (null === SubjectToUpdate) {
                    callback({
                        error: "cannot find " + id
                    }, 404);
                    return;
                }

                updateIfNotNull();
                SubjectToUpdate.name = body.name;
                SubjectToUpdate.text = body.text;
                SubjectToUpdate.category = body.category;

                SubjectToUpdate.save(errorMongoSubject);
                console.log('save');
                callback(SubjectToUpdate);
            });
        },
        deleteSubject = function (id, callback) {
            Subject.findByIdAndRemove(id, function (err, deletedSubject) {
                if (err) {
                    errorMongoSubject(err);
                    return callback({
                        error: err
                    });
                }
                if (null === deletedSubject) {
                    callback({
                        error: "cannot find " + id
                    }, 404);
                    return;
                }
                deletedSubject.status = "deleted";
                callback(deletedSubject);
            });
        };
    console.log("schema created");

    return {
        create: createSubject,
        retrieve: retrieveSubject,
        update: updateSubject,
        del: deleteSubject,
        list: listSubject
    };
};

exports.build = build;
