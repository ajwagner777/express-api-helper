'use strict';

var _hasOwnProperty = Object.prototype.hasOwnProperty;

var Status = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNSUPPORTED_ACTION: 405,
    TEAPOT: 418,
    VALIDATION_FAILED: 422,
    SERVER_ERROR: 500
};

function statusMessage(status) {
    switch (status) {
        case Status.BAD_REQUEST:
            return 'Bad Request';
        case Status.UNAUTHORIZED:
            return 'Unauthorized';
        case Status.FORBIDDEN:
            return 'Forbidden';
        case Status.NOT_FOUND:
            return 'Not Found';
        case Status.UNSUPPORTED_ACTION:
            return 'Unsupported Action';
        case Status.TEAPOT:
            return 'I am a teapot';
        case Status.VALIDATION_FAILED:
            return 'Validation Failed';
        case Status.SERVER_ERROR:
            return 'Internal Server Error';
    }
}

function jsonResponse(res, body, options) {
    options = options || {};
    options.status = options.status || Status.OK;
    res.status(options.status).json(body);
}

var api = {
    ok: function (data) {
        var body = {
                body: data.body,
                friendlyMessage: data.friendlyMessage || "Object Found"
            };
        jsonResponse(data.res, body, { status: Status.OK });
    },

    created: function (data) {
        var body = {
                body: data.body,
                friendlyMessage: data.friendlyMessage || "Created successfully"
            };
        jsonResponse(data.res, body, { status: Status.CREATED });
    },

    badRequest: function (data) {
        var errors = Array.isArray(data.errors) ? data.errors : [data.errors];

        var body = {
            message: statusMessage(Status.BAD_REQUEST),
            friendlyMessage: data.friendlyMessage || Status.BAD_REQUEST,
            errors: data.errors
        };

        jsonResponse(data.res, body, { status: Status.BAD_REQUEST });
    },

    unauthorized: function (data) {
        var body = { 
            friendlyMessage: data.friendlyMessage || Status.UNAUTHORIZED,
            message: statusMessage(Status.UNAUTHORIZED)
        };

        jsonResponse(data.res, body, { status: Status.UNAUTHORIZED });
    },

    forbidden: function (data) {
        var body = { 
            friendlyMessage: data.friendlyMessage || Status.FORBIDDEN,
            message: statusMessage(Status.FORBIDDEN)
        };

        jsonResponse(data.res, body, { status: Status.FORBIDDEN });
    },

    notFound: function (data) {
        var body = { 
            friendlyMessage: data.friendlyMessage || Status.NOT_FOUND,
            message: statusMessage(Status.NOT_FOUND)
        };

        jsonResponse(data.res, body, { status: Status.NOT_FOUND });
    },

    unsupportedAction: function (data) {
        var body = { 
            friendlyMessage: data.friendlyMessage || Status.UNSUPPORTED_ACTION,
            message: statusMessage(Status.UNSUPPORTED_ACTION)
        };

        jsonResponse(data.res, body, { status: Status.UNSUPPORTED_ACTION });
    },

    teapot: function (data) {
        var body = { 
            friendlyMessage: data.friendlyMessage || Status.TEAPOT,
            message: statusMessage(Status.TEAPOT)
        };

        jsonResponse(data.res, body, { status: Status.TEAPOT });
    },

    invalid: function (data) {
        var errors = Array.isArray(data.errors) ? data.errors : [data.errors];

        var body = {
            message: statusMessage(Status.VALIDATION_FAILED),
            friendlyMessage: data.friendlyMessage || Status.VALIDATION_FAILED,
            errors: data.errors
        };

        jsonResponse(data.res, body, { status: Status.VALIDATION_FAILED });
    },

    serverError: function (data) {
        var error = {};
        if (data.error instanceof Error) {
            error = {
                message: data.error.message,
                stacktrace: data.error.stack
            };
        }
        var body = {
            message: statusMessage(Status.SERVER_ERROR),
            error: error
        };

        jsonResponse(data.res, body, { status: Status.SERVER_ERROR });
    },

    requireParams: function (data, next) {
        var missing = [],
            params = Array.isArray(data.params) ? data.params : [data.params];

        params.forEach(function (param) {
            if (!(data.req.body && _hasOwnProperty.call(data.req.body, param)) && !(data.req.params && _hasOwnProperty.call(data.req.params, param)) && !_hasOwnProperty.call(data.req.query, param)) {
                missing.push('Missing required parameter: ' + param);
            }
        });

        if (missing.length) {
            api.badRequest(data.req, data.res, missing);
        }
        else {
            next();
        }
    }
};

module.exports = api;
