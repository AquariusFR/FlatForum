var restRessource = function (expressApp, urlPrefix, ressource, rest, previousRessource) {
    'use strict';
    // list
    var listFunction = rest.list,
        createFunction = rest.create,
        retrieveFunction = rest.retrieve,
        updateFunction = rest.update,
        deleteFunction = rest.del,
        rootUrl = urlPrefix + "/",
        currentRessourceIndex,
        currentRessource,
        url,
        urlWithId;

    if (previousRessource) {

        for (currentRessourceIndex in previousRessource) {
            currentRessource = previousRessource[currentRessourceIndex];
            rootUrl += currentRessource + "/:" + currentRessource + "/";
        }

        rootUrl += ressource;
    } else {

        rootUrl += ressource;
    }

    url = rootUrl;
    urlWithId = rootUrl + '/:id';

    var isNullOrUndefined = function (val) {
        if (typeof (val) === "undefined") {
            return true;
        }
        return val === null;
    };
    var traceRoute = function (crudFunction, wrapperFunction, method, targetURL) {
        if (isNullOrUndefined(crudFunction)) {
            return;
        }

        switch (method) {
        case "GET":
            console.log("GET:" + targetURL);
            expressApp.get(targetURL, wrapperFunction);
            break;

        case "POST":
            console.log("POST:" + targetURL);
            console.log("  BODY");
            expressApp.post(targetURL, wrapperFunction);
            break;

        case "PUT":
            console.log("PUT:" + targetURL);
            console.log("  BODY");
            expressApp.put(targetURL, wrapperFunction);
            break;

        case "DELETE":
            console.log("DELETE:" + targetURL);
            console.log("  BODY");
            expressApp["delete"](targetURL, wrapperFunction);
            break;
        }
    };
    var writeJson = function (res) {
        return function (object, status) {
            if (status) {
                res.status(status).json(object);
                return;
            }
            res.json(object);
        };
    };
    var getParamPreviousRessource = function (req) {
        if (!previousRessource) {
            return null;
        }

        var paramPreviousRessource = {};

        for (var currentRessourceIndex in previousRessource) {
            var currentRessource = previousRessource[currentRessourceIndex];

            var value = req.params[currentRessource];

            paramPreviousRessource[currentRessource] = value;
        }

        return paramPreviousRessource;
    };

    var wrappedList = function (req, res) {
        if (!checkRestFunction(listFunction, res)) {
            return;
        }
        try {
            setJsonType(res);

            listFunction(writeJson(res), getParamPreviousRessource(req));

        } catch (e) {
            writeErrorMessage(res, e);
        }
    };

    var wrappedCreate = function (req, res) {
        if (!checkRestFunction(createFunction, res)) {
            return;
        }
        try {
            setJsonType(res);
            var body = req.body;

            var callback = writeJson(res);

            createFunction(body, callback, getParamPreviousRessource(req));

        } catch (e) {
            writeErrorMessage(res, e);
        }
    };

    var wrappedRetrieve = function (req, res) {
        if (!checkRestFunction(retrieveFunction, res)) {
            return;
        }
        try {
            setJsonType(res);
            var id = req.params.id;
            retrieveFunction(id, writeJson(res), getParamPreviousRessource(req));
        } catch (e) {
            writeErrorMessage(res, e);
        }
    };

    var wrappedUpdate = function (req, res) {
        if (!checkRestFunction(updateFunction, res)) {
            return;
        }
        try {
            setJsonType(res);
            var id = req.params.id;
            var body = req.body;

            updateFunction(id, body, writeJson(res), getParamPreviousRessource(req));

        } catch (e) {
            writeErrorMessage(res, e);
        }
    };
    var wrappedDelete = function (req, res) {
        if (!checkRestFunction(deleteFunction, res)) {
            return;
        }
        try {
            setJsonType(res);
            var id = req.params.id;
            deleteFunction(id, writeJson(res), getParamPreviousRessource(req));
        } catch (e) {
            writeErrorMessage(res, e);
        }
    };

    console.log("RestModule - tracing routes " + ressource);
    // list
    traceRoute(listFunction, wrappedList, "GET", url)
    // create
    traceRoute(createFunction, wrappedCreate, "POST", url);
    // retrieve
    traceRoute(retrieveFunction, wrappedRetrieve, "GET", urlWithId);
    // update
    traceRoute(updateFunction, wrappedUpdate, "PUT", urlWithId);
    // delete
    traceRoute(deleteFunction, wrappedDelete, "DELETE", urlWithId);
};
var jsonHeader = {
    type: 'Content-Type',
    content: 'application/json'
};
var setJsonType = function (res) {

    res.setHeader(jsonHeader.type, jsonHeader.content);
};
var writeErrorMessage = function (res, e) {
    res.setHeader('Content-Type', 'text/html');
    var error = '<html><body>';
    error += '<div>error' + e + '</div>';
    error += '</body></html>';
    res.status(500).send(error);
    return;
};
var checkRestFunction = function (restFunction, res) {
    if (restFunction === null) {
        res.setHeader('Content-Type', 'application/json');
        res.status(403).send({
            error: 'invalid call'
        });
        return false;
    }
    return true;
};

exports.restRessource = restRessource;
