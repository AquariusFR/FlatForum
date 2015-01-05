var build = function(mongoose) {
	'use strict';
	console.log("SearchTokenRessource");
	var Token = mongoose.model('token');

	var defaultSort = {
		data : "asc"
	};

	var _ = {

		errorMongoToken : function(err, fluffy) {
			if (err) {
				return console.error('uho:' + err);
			}
		},
		searchToken : function(body, callback) {
			var query = {};
			_.setQuery(query, body.data);
			_.setQuery(query, body.status);
			var querySort = (body.sort) ? body.sort : defaultSort;
			var find = Token.find(query);
			find.sort(querySort);
			find.exec(_.processResult(callback));
		},

		processResult : function(callback) {
			return function(err, searchToken) {
				if (err) {
					_.errorMongoToken(err);
					return callback({
						error : err
					});
				}
				if (null === searchToken) {
					callback({
						error : "cannot find " + id
					}, 404);
					return;
				}
				callback(searchToken);
			}
		},

		setQuery : function(query, queryField) {
			if (!queryField) {
				return;
			}
			if (queryField.contains) {
				query.data = new RegExp(queryField.contains, 'i');
			} else if (queryField.equals) {
				query.data = queryField.equals;
			}
		}
	}

	return {
		create : _.searchToken
	};
};

exports.build = build;