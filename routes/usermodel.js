'use strict';

var express = require('express'),
    router = express.Router();

/**
 * @api {get} /usermodel/:prefix/:suffix  Returns a document value assigned to the constructed key.
 * @apiName GetUsermodel
 * @apiGroup Usermodel
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              <VALUE_DOCUMENT>
 *          }
 *      ]
 *
 */
router.get('/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.get(prefix, suffix, function (err, document) {
            if (err) {
                return next(err);
            }
            res.json(document);
        });
    });
});

/**
 * @api {post} /usermodel/:prefix/:suffix Creates a new document.
 * @apiName PostUsermodel
 * @apiGroup Usermodel
 *
 * @apiHeader {String} x-gleaner-user.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          <VALUE_DOCUMENT>
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *
 */
router.post('/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.create(prefix, suffix, req.body, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });
});

/**
 * @api {put} /usermodel/:prefix/:suffix Updates or creates a new document.
 * @apiName PutUsermodel
 * @apiGroup Usermodel
 *
 * @apiHeader {String} x-gleaner-user.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          <VALUE_DOCUMENT>
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *
 */
router.put('/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.updateAndSet(prefix, suffix, req.body, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });
});

/**
 * @api {delete} /usermodel/:prefix/:suffix Deletes an existing document.
 * @apiName DeleteUsermodel
 * @apiGroup Usermodel
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *
 */
router.delete('/:prefix/:suffix', function (req, res, next) {

    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.del(prefix, suffix, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });
});

var validateParams = function (req, next, callback) {
    var prefix = req.params.prefix || '';
    var error;

    if (!prefix) {
        error = new Error('Prefix required!');
        error.status = 400;
        return next(error);
    }

    var suffix = req.params.suffix || '';

    if (!suffix) {
        error = new Error('Suffix required!');
        error.status = 400;
        return next(error);
    }

    callback(prefix, suffix);
};

module.exports = router;