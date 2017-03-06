'use strict';

/**
 * A backend for the 'document-storage' plug in that stores
 * its data inside a Mongo database.
 */

/**
 * The MongoBackend maps the documents storing them directly into the MongoDB 'documents' collection.
 * The 'key' used to identify the document is stored as the '_id' attribute of the MongoDB document.
 * Before returning a document to the user, e.g. using the method 'get',
 * the '_id' attribute is removed from the document.
 *
 * @param options An object with the 'uri' of the MongoConnection. For instance:
 *                  {
 *                      uri: 'mongodb://localhost:27017/gamestorage'
 *                  }
 */
var MongoBackend = function (options) {

    var db;
    var collection;

    /**
     * If it failes to connect, tries to connect the MongoDB client every 5 seconds.
     */
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
        collection.find({
            _id: key
        }).limit(1).next(function (err, doc) {
            if (err) {
                err = parseError(err);
                return callback(err);
            }
            if (!doc) {
                return callback();
            }
            delete doc._id;
            callback(null, doc);
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
        value._id = key;
        collection.insertOne(value, function (err) {
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
        value._id = key;
        collection.updateOne({
            _id: key
        }, value, {
            upsert: true
        }, function (err) {
            if (err) {
                err = parseError(err);
            }
            callback(err);
        });
    };

    /**
     * Updates an attribute of a given document with a given value.
     *
     * If they key is not available an error is thrown.
     *
     * @param key - A String used as a key to identify the document.
     * @param value - A document with the following format:
     *                {
     *                      <field1>: <value1>,
     *                      <field2>: <value2>,
     *                      ...
     *                }
     *                The fields to be updated support dot notation.
     *                    More information at: https://docs.mongodb.org/manual/core/document/#document-dot-notation
     * @param callback - A function with signature function(err) to be invoked when the <key, value> is updated.
     *                   err (Any) - The error that occurred.
     */
    this.updateFields = function (key, value, callback) {
        value._id = key;
        collection.updateOne({
            _id: key
        }, {
            $set: value
        }, function (err, res) {
            if (err) {
                err = parseError(err);
            } else if (!res || !res.result || res.result.n === 0) {
                err = new Error('No document found!');
                err.status = 400;
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