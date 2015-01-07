/**
 * New node file
 */
var mongoose = require('mongoose');
var connect = function() {
	'use strict';
	var db = null, successAlreadyCalled = false, errorAlreadyCalled = false,
		promise = {
			successCallback : function() {
				successAlreadyCalled = true;
			},
			errorCallback : function() {
				errorAlreadyCalled = true;
			},
			success : function(_successCallback) {
				promise.successCallback = _successCallback;
				if(successAlreadyCalled){
					promise.successCallback();
				}
				return promise;
			},
			error : function(_errorCallback) {
				promise.errorCallback = _errorCallback;
				if(errorAlreadyCalled){
					promise.errorCallback();
				}
				return promise;
			}
	},
	callError = function(data){
		promise.errorCallback(data);
	},
	callSuccess = function(data){
		promise.successCallback(data);
	};

	mongoose.connect('mongodb://localhost/test');
	db = mongoose.connection;
	db.on('error', callError);
	db.once('open', callSuccess);

	return promise;
}, read = function() {
}, write = function() {
},
getModelInterface = function(model){

    
    var PostSchema = mongoose.Schema(model);
    var PostModel = mongoose.model('post', PostSchema);
    console.log("post schema created");
    return PostModel;
};

exports.connect = connect;
exports.getModelInterface = getModelInterface;
exports.read = read;
exports.write = write;