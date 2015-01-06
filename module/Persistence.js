/**
 * New node file
 */
var mongoose = require('mongoose');
var connect = function() {
	'use strict';
	var successAlreadyCalledParam = false, errorAlreadyCalledParam = false,
		promise = {
			successCallback : function(data) {
				successAlreadyCalledParam = data;
			},
			errorCallback : function(data) {
				errorAlreadyCalledParam = data;
			},
			success : function(_successCallback) {
				promise.successCallback = _successCallback;
				if(successAlreadyCalledParam !== false){
					console.log("woops, success called before successCallback is defined.")
					promise.successCallback(successAlreadyCalledParam);
				}
				return promise;
			},
			error : function(_errorCallback) {
				promise.errorCallback = _errorCallback;
				if(errorAlreadyCalledParam !== false){
					console.log("woops, error called before errorCallback is defined.")
					promise.errorCallback(errorAlreadyCalledParam);
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

	callSuccess();

	return promise;
}, read = function() {
}, write = function() {
};

exports.connect = connect;
exports.read = read;
exports.write = write;