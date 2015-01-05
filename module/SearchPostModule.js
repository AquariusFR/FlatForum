var build = function(mongoose) {
	'use strict';
	console.log("SearchPostRessource");
	var Post = mongoose.model('post');

	var defaultSort = {created : "asc"};

	var _ = {
		errorMongoPost : function(err, fluffy) {
			if (err) {
				return console.error('uho:' + err);
			}
		},
		searchPost : function(body, callback) {
			var query = {};
			_.setQuery(query, body.text);
			_.setQuery(query, body.subject);
			_.setQuery(query, body.user);
			var querySort = (body.sort) ? body.sort : defaultSort;
			var find = Post.find(query);
			find.sort(querySort);
			find.exec(_.processResult(callback));
		},
		processResult : function(callback) {
			return function(err, searchPost) {
				if (err) {
					_.errorMongoPost(err);
					return callback({
						error : err
					});
				}
				if (null === searchPost) {
					callback({
						error : "cannot find " + id
					}, 404);
					return;
				}
				callback(searchPost);
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
		create : _.searchPost
	};
};

exports.build = build;