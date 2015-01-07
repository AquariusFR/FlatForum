/**
 * New node file
 */
var mongoose = require('mongoose');
var connect = function() {
	'use strict';
	var successAlreadyCalledParam = false, errorAlreadyCalledParam = false, promise = {
		successCallback : function(data) {
			successAlreadyCalledParam = data;
		},
		errorCallback : function(data) {
			errorAlreadyCalledParam = data;
		},
		success : function(_successCallback) {
			promise.successCallback = _successCallback;
			if (successAlreadyCalledParam !== false) {
				console
						.log("woops, success called before successCallback is defined.")
				promise.successCallback(successAlreadyCalledParam);
			}
			return promise;
		},
		error : function(_errorCallback) {
			promise.errorCallback = _errorCallback;
			if (errorAlreadyCalledParam !== false) {
				console
						.log("woops, error called before errorCallback is defined.")
				promise.errorCallback(errorAlreadyCalledParam);
			}
			return promise;
		}
	}, callError = function(data) {
		promise.errorCallback(data);
	}, callSuccess = function(data) {
		promise.successCallback(data);
	};

	callSuccess();

	return promise;
},
buildFind = function(model) {
	return function(){};
},
buildCreate = function(model) {
	return function(){};
},
findById = function(model) {
	return function(){};
},
findByIdAndRemove = function(model) {
	return function(){};
},
getModelInterface = function(model, name) {
	var PostSchema = mongoose.Schema(model),
		PostModel = mongoose.model(name, PostSchema);

	console.log(name, "schema created");

	return {
		find : buildFind(PostModel),
		create : buildCreate(PostModel),
		findById : findById(PostModel),
		findByIdAndRemove : findByIdAndRemove(PostModel)
	};
};

exports.connect = connect;
exports.getModelInterface = getModelInterface;