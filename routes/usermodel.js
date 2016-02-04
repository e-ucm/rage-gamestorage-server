'use strict';

var express = require('express'),
    router = express.Router();

/**
 * @api {get} /usermodel/:prefix/:suffix  Returns a document value assigned to the constructed key.
 * @apiDescription
 *          If a document with a given key is not available an error message is returned.
 *
 *          The key is constructed using the values of 'prefix' & 'suffix'
 *
 *          The generation process appends 'prefix' + '|' + 'suffix' to create the key.
 *
 *          NOTE: '|' is a special character that cannot be present in the prefix nor the suffix.
 *
 *          The prefix/suffix mechanism is used to be able to easily filter documents with the same identifier
 *          used by different assets.
 *          For instance, is assets 'A' and 'B' want to use a document identified by the key 'key'
 *          and each document has to be different, they can use the prefix/suffix with the following values:
 *
 *              Asset A:
 *                  prefix: 'A'
 *                  suffix: 'key'
 *              Asset B:
 *                  prefix: 'B'
 *                  suffix: 'key'
 *
 * @apiName GetUsermodel
 * @apiGroup Usermodel
 *
 * @apiParam {String} prefix A string used as prefix to build the key.
 * @apiParam {String} suffix A string used as suffix to build the key.
 *                           The document's key is built such as: 'prefix' + '|' + 'suffix'.
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
 * @api {post} /usermodel/update/:prefix/:suffix/ Updates the fields of an existing document.
 * @apiDescription If they key is not available an error is thrown.
 *
 * @apiName PostUsermodelField
 * @apiGroup Usermodel
 *
 * @apiParam {String} prefix A string used as prefix to build the key.
 * @apiParam {String} suffix A string used as suffix to build the key.
 *                           The document's key is built such as: 'prefix' + '|' + 'suffix'.
 * @apiParam {String} fields The fields to be updated. Dot notation is supported.
 *                           More information at: https://docs.mongodb.org/manual/core/document/#document-dot-notation
 *                           If the fields does not exist, new fields will be added with the specified value,
 *                           provided that the new fields does not violate a type constraint.
 *                           If you specify a dotted path for a non-existent field,
 *                           the embedded documents will be created as needed to fulfill the dotted path to the field.
 *
 * @apiHeader {String} x-gleaner-user.
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          <field1>: <value1>,
 *          <field2>: <value2>,
 *          ...
 *      }
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "message": "Success."
 *      }
 *
 * @apiError(400) DocumentNotFound No document found!
 *
 */
router.post('/update/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.updateFields(prefix, suffix, req.body, function (err) {
            if (err) {
                return next(err);
            }
            res.sendDefaultSuccessMessage();
        });
    });
});

/**
 * @api {post} /usermodel/:prefix/:suffix Creates a new document.
 * @apiDescription If they key already has an assigned value an error is returned.
 *
 * @apiName PostUsermodel
 * @apiGroup Usermodel
 *
 * @apiParam {String} prefix A string used as prefix to build the key.
 * @apiParam {String} suffix A string used as suffix to build the key.
 *                           The document's key is built such as: 'prefix' + '|' + 'suffix'.
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
 *      {
 *         "message": "Success."
 *      }
 *
 */
router.post('/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.create(prefix, suffix, req.body, function (err) {
            if (err) {
                return next(err);
            }
            res.sendDefaultSuccessMessage();
        });
    });
});

/**
 * @api {put} /usermodel/:prefix/:suffix Overrides or creates a new document.
 * @apiDescription
 *                - If a document with the given key is not available a new document is created.
 *                - If a document with the given key already exists all its values are overridden by the new
 *                      values provided within the body of this PUT request.
 *
 * @apiName PutUsermodel
 * @apiGroup Usermodel
 *
 * @apiParam {String} prefix A string used as prefix to build the key.
 * @apiParam {String} suffix A string used as suffix to build the key.
 *                           The document's key is built such as: 'prefix' + '|' + 'suffix'.
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
 *      {
 *         "message": "Success."
 *      }
 */
router.put('/:prefix/:suffix', function (req, res, next) {
    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.updateAndSet(prefix, suffix, req.body, function (err) {
            if (err) {
                return next(err);
            }
            res.sendDefaultSuccessMessage();
        });
    });
});

/**
 * @api {delete} /usermodel/:prefix/:suffix Deletes an existing document.
 * @apiDescription If they key is not available an error message is returned and nothing is deleted.
 *
 * @apiName DeleteUsermodel
 * @apiGroup Usermodel
 *
 * @apiParam {String} prefix A string used as prefix to build the key.
 * @apiParam {String} suffix A string used as suffix to build the key.
 *                           The document's key is built such as: 'prefix' + '|' + 'suffix'.
 *
 * @apiSuccess(200) Success.
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *         "message": "Success."
 *      }
 *
 */
router.delete('/:prefix/:suffix', function (req, res, next) {

    validateParams(req, next, function (prefix, suffix) {
        req.app.documentStorage.del(prefix, suffix, function (err) {
            if (err) {
                return next(err);
            }
            res.sendDefaultSuccessMessage();
        });
    });
});


/**
 * Validates the parameters 'prefix' and 'suffix' from the 'req.params' object to
 * assure that they are not empty. If an empty param is found an error message is thrown (using next)
 * and the callback is not invoked.
 *
 * @param req
 * @param next
 * @param callback
 * @returns {*}
 */
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