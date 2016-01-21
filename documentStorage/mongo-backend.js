/**
 * A backend for the 'document-storage' plug in that stores
 * its data inside a Mongo database.
 */

'use strict';


var MongoBackend = function (options) {

    var db;
    var collection;

    var connectToDB = function () {
        var MongoClient = require('mongodb').MongoClient;
        var connectionString = options.uri;
        MongoClient.connect(connectionString, function (err, database) {
            if (err) {
                console.log(err,
                    'Impossible to connect to MongoDB. Retrying in 5s');
                setTimeout(connectToDB, 5000);
            } else {
                console.log('Successfully connected to ' + connectionString);
                db = database;
                collection = db.collection('documents');
            }
        });
    };

    connectToDB();

    /**
     * Returns a document value assigned to the constructed key
     *
     * If they key is not available an error message is returned.
     *
     * @param key - A String used as a key.
     * @param callback - A function with signature function(err, value) to be invoked when the value is returned.
     *                   err (Any) - The error that occurred.
     *                   value - The document associated with the key
     */
    this.get = function (key, callback) {
        collection.findOne({
            _id: key
        }, function (err, doc) {
            if (err) {
                err = parseError(err);
                return callback(err);
            }
            if (!doc) {
                return callback();
            }
            callback(null, doc.val);
        });
    };

    /**
     * Creates a new document for the constructed key assigning it 'value'
     *
     * If they key already has an assigned value an error is returned.
     *
     * @param key - A String used as a key.
     * @param value - An object (document) associated to the key.
     * @param callback - A function with signature function(err) to be invoked when the <key, value> is created.
     *                   err (Any) - The error that occurred.
     */
    this.create = function (key, value, callback) {
        collection.insertOne({
            _id: key,
            val: value
        }, function (err) {
            if (err) {
                err = parseError(err);
            }
            callback(err);
        });
    };

    /**
     * Updates an available document with key assigning it 'value'
     *
     * If they key is not available an error is returned.
     *
     * @param key - A String used as a key.
     * @param value - An object (document) associated to the key.
     * @param callback - A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.update = function (key, value, callback) {
        collection.updateOne({
            _id: key
        }, {
            $set: {
                val: value
            }
        }, function (err) {
            if (err) {
                err = parseError(err);
            }
            callback(err);
        });
    };

    /**
     * Updates a document with the constructed key assigning it 'value'
     *
     * If they key is not available a new document is created.
     *
     * @param key - A String used as a key.
     * @param value - An object (document) associated to the key.
     * @param callback - A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.updateAndSet = function (key, value, callback) {
        collection.updateOne({
            _id: key
        }, {
            _id: key,
            val: value
        }, {
            upsert: true
        }, function (err) {
            if (err) {
                err = parseError(err);
            }
            callback(err);
        });
    };

    /**
     * Deletes a document with the constructed key.
     *
     * If they key is not available an error message is returned and nothing is deleted.
     *
     * @param key - A String used as a key.
     * @param callback - A function with signature function(err) to be invoked when the <key, value> pair is deleted.
     *                   err (Any) - The error that occurred.
     */
    this.del = function (key, callback) {
        collection.findOneAndDelete({
            _id: key
        }, function (err) {
            if (err) {
                err = parseError(err);
            }
            callback(err);
        });
    };

    /**
     * Drops the mongo collection.
     *
     * @param callback - A function with signature function(err) to be invoked when the collection is cleaned.
     *                   err (Any) - The error that occurred.
     */
    this.clean = function (callback) {
        collection.drop(callback);
    };

    /**
     * Parses the message from a MongoDB error to a more readable version.
     *
     * @param error - MongoDB error
     * @return parsedError
     */
    var parseError = function (error) {
        if (error.code === 11000) {
            error.message = 'The prefix and suffix provided are already in use, ' +
                'change them and try again.';
            error.status = 400;
        } else {
            var msg = 'An unexpected error occurred in our database: ' + error.message;
            error.message = msg;
            error.status = 400;
        }
        return error;
    };
};

module.exports = MongoBackend;