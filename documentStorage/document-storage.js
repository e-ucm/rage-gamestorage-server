'use strict';

var DocumentStorage = function (backend) {

    /**
     * A special character that cannot be present in the prefix nor the suffix.
     *
     * @type {string}
     */
    var token = '|';

    /**
     * Creates a key using the values of 'prefix' & 'suffix'
     *
     * The generation process appends 'prefix' + '|' + 'suffix'
     * to create the key.
     *
     * '|' is a special character that cannot be present in the prefix nor the suffix.
     *
     * @param prefix
     * @param suffix
     * @param next A function with signature function(err) to be invoked when the key could not be created.
     *                   err - the prefix/suffix contains the special character ('|')
     */
    var buildKey = function (prefix, suffix, next, callback) {
        var error;
        if (prefix.indexOf(token) !== -1) {
            error = new Error('The prefix ' + prefix + ' cannot contain ' + token);
            error.status = 400;
            return next(error);
        }
        if (suffix.indexOf(token) !== -1) {
            error = new Error('The suffix ' + suffix + ' cannot contain ' + token);
            error.status = 400;
            return next(error);
        }

        callback(prefix + token + suffix);
    };

    /**
     * Returns a document value assigned to the constructed key
     *
     * If they key is not available an error message is returned.
     *
     * @param prefix
     * @param suffix
     * @param callback - A function with signature function(err, value) to be invoked when the value is returned.
     *                   err (Any) - The error that occurred.
     *                   value - The document associated with the key
     */
    this.get = function (prefix, suffix, callback) {
        buildKey(prefix, suffix, callback, function (key) {
            backend.get(key, callback);
        });
    };

    /**
     * Creates a new document for the constructed key assigning it 'value'
     *
     * If they key already has an assigned value an error is returned.
     *
     * @param prefix
     * @param suffix
     * @param value
     * @param callback A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.create = function (prefix, suffix, value, callback) {
        buildKey(prefix, suffix, callback, function (key) {
            backend.create(key, value, callback);
        });
    };

    /**
     * Updates an available document with the constructed key assigning it 'value'
     *
     * If they key is not available an error is returned.
     *
     * @param prefix
     * @param suffix
     * @param value
     * @param callback A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.update = function (prefix, suffix, value, callback) {
        buildKey(prefix, suffix, callback, function (key) {
            backend.update(key, value, callback);
        });
    };

    /**
     * Updates a document with the constructed key assigning it 'value'
     *
     * If they key is not available a new document is created.
     *
     * @param prefix
     * @param suffix
     * @param value
     * @param callback A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.updateAndSet = function (prefix, suffix, value, callback) {
        buildKey(prefix, suffix, callback, function (key) {
            backend.updateAndSet(key, value, callback);
        });
    };

    /**
     * Deletes a document with the constructed key.
     *
     * If they key is not available an error message is returned and nothing is deleted.
     *
     * @param prefix
     * @param suffix
     */
    this.del = function (prefix, suffix, callback) {
        buildKey(prefix, suffix, callback, function (key) {
            backend.del(key, callback);
        });
    };

    /**
     * Cleans all the database.
     *
     * @param callback - A function with signature function(err) to be invoked when the database is cleaned.
     *                   err (Any) - The error that occurred.
     */
    this.clean = function (callback) {
        backend.clean(callback);
    };
};

module.exports = DocumentStorage;