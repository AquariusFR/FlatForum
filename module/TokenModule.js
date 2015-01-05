var build = function(mongoose) {
	'use strict';
	console.log("TokenRessource");
	var tokenSchema = mongoose.Schema({
		status : String,
		data : String
	});
	var Token = mongoose.model('token', tokenSchema);
	console.log("schema created");
	var listToken = function(callback) {
		callback({
			error : "cannot call list method"
		}, 405);
	};

	var errorMongoToken = function(err, fluffy) {
		if (err) {
			return console.error(err);
		}
	};

	var createToken = function(body, callback) {
		var createdToken = new Token();
		createdToken.status = "created";
		createdToken.data = body.data;
		createdToken.save(errorMongoToken);
		callback(createdToken);
	};
	var retrieveToken = function(id, callback) {
		Token.findById(id, function(err, retrievedToken) {
			if (err) {
				errorMongoToken(err);
				return callback({
					error : err
				});
			}
			if (null === retrievedToken) {
				callback({
					error : "cannot find " + id
				}, 404);
				return;
			}
			retrievedToken.status = "retrieved";
			callback(retrievedToken);
		});
	};
	var updateToken = function(id, body, callback) {
		console.log('token update, id:' + id + ', update:' + body);
		Token.findById(id, function(err, tokenToUpdate) {
			if (err) {
				errorMongoToken(err);
				return callback({
					error : err
				});
			}
			if (null === tokenToUpdate) {
				callback({
					error : "cannot find " + id
				}, 404);
				return;
			}
			console.log('token update, old value' + tokenToUpdate);
			tokenToUpdate.status = "updated";
			tokenToUpdate.data = body.data;
			console.log('token update, new value' + tokenToUpdate + 'saving ...');
			tokenToUpdate.save(errorMongoToken);
			console.log('save');
			callback(tokenToUpdate);
		});
	};
	var deleteToken = function(id, callback) {
		Token.findByIdAndRemove(id, function(err, deletedToken) {
			if (err) {
				errorMongoToken(err);
				return callback({
					error : err
				});
			}
			if (null === deletedToken) {
				callback({
					error : "cannot find " + id
				}, 404);
				return;
			}
			deletedToken.status = "deleted";
			callback(deletedToken);
		});
	};

	return {
		create : createToken,
		retrieve : retrieveToken,
		update : updateToken,
		del : deleteToken,
		list : listToken
	};
};

exports.build = build;