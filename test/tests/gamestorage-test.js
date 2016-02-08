'use strict';

var should = require('should');

module.exports = function (request, documentStorage) {

    /**-------------------------------------------------------------**/
    /**-------------------------------------------------------------**/
    /**                     Test Games API                          **/
    /**-------------------------------------------------------------**/
    /**-------------------------------------------------------------**/

    var token = '|';
    var prefix = 'prefix';
    var suffix = 'suffix';
    var field = 'field';
    var value = {
        field: 'someValue'
    };
    var updateValue = {
        someUpdateKey: 'someUpdateValue'
    };

    describe('Documents tests - ', function () {
        after(function (done) {
            documentStorage.clean(done);
        });

        /**
         * CREATE(POST)
         */

        it('should POST(CREATE) a documment', function (done) {
            request.post('/api/storage/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not POST(CREATE) a new document with the same prefix/suffix', function (done) {
            request.post('/api/storage/' + prefix + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix and suffix provided are already in use, change them and try again.');
                    done();
                });
        });

        it('should not POST(CREATE) a new document with an invalid prefix (containing |)', function (done) {
            request.post('/api/storage/' + prefix + token + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + token + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not POST(CREATE) a new document with an invalid suffix (containing |)', function (done) {
            request.post('/api/storage/' + prefix + '/' + suffix + token)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + token + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * GET
         */
        it('should GET a document', function (done) {
            request.get('/api/storage/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.not.exist(res.body._id);
                    should(res.body).eql(value);
                    done();
                });
        });

        it('should not GET a document with a non-existent prefix/suffix', function (done) {
            request.get('/api/storage/asdsa/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body).eql('');
                    done();
                });
        });

        it('should not GET a new document with an invalid prefix (containing |)', function (done) {
            request.get('/api/storage/' + prefix + token + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + token + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not GET a new document with an invalid suffix (containing |)', function (done) {
            request.get('/api/storage/' + prefix + '/' + suffix + token)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + token + ' cannot contain ' + token);
                    done();
                });
        });


        /**
         * UPDATE A FIELD (POST)
         */

        it('should POST(UPDATE A FIELD) a field of a document', function (done) {
            var newFieldvalue = value.field + ' with a new Value';
            var update = {};
            update[field] = newFieldvalue;

            request.post('/api/storage/update/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(update)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('Success.');
                    request.get('/api/storage/' + prefix + '/' + suffix)
                        .expect(200)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            should.not.exist(err);
                            should(res.body[field]).equal(newFieldvalue);
                            done();
                        });
                });
        });

        it('should POST(UPDATE A FIELD) a field of a document that doesn\'t have the provided field as an attribute', function (done) {

            var update = {};
            var newField = field + '_2';
            update[newField] = 'this is a random value';

            request.post('/api/storage/update/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(update)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('Success.');
                    done();
                });
        });

        it('should POST(UPDATE A FIELD) a non-existent dot-notated field of a document', function (done) {
            var update = {};
            var dotFieldValue = 'this is a string field';
            update['dot.notated.nested.field'] = dotFieldValue;

            request.post('/api/storage/update/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(update)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('Success.');
                    request.get('/api/storage/' + prefix + '/' + suffix)
                        .expect(200)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            should.not.exist(err);
                            should(res.body.dot.notated.nested.field).equal(dotFieldValue);
                            done();
                        });
                });
        });

        it('should not POST(UPDATE A FIELD) a field of a non-existent document', function (done) {
            request.post('/api/storage/update/' + prefix + '2/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send({'some-field': 'should-fail'})
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('No document found!');
                    done();
                });
        });

        it('should not POST(UPDATE A FIELD) a field of a new document with an invalid prefix (containing |)', function (done) {
            request.post('/api/storage/update/' + prefix + token + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + token + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not POST(UPDATE A FIELD) a field of a new document with an invalid suffix (containing |)', function (done) {
            request.post('/api/storage/update/' + prefix + '/' + suffix + token)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + token + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * UPDATE AND SET (PUT)
         */
        it('should PUT(UPDATE AND SET - create) a documment', function (done) {
            request.put('/api/storage/' + prefix + '3' + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should PUT(UPDATE AND SET) a new document with the same prefix/suffix', function (done) {
            request.put('/api/storage/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(updateValue)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not PUT(UPDATE AND SET) a new document with an invalid prefix (containing |)', function (done) {
            request.put('/api/storage/' + prefix + token + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + token + ' cannot contain ' + token);
                    done();
                });
        });

        it('should not PUT(UPDATE AND SET) a new document with an invalid suffix (containing |)', function (done) {
            request.put('/api/storage/' + prefix + '/' + suffix + token)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + token + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * DELETE
         */
        it('should DELETE a document', function (done) {
            request.delete('/api/storage/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not DELETE a document with a non-existent prefix/suffix', function (done) {
            request.delete('/api/storage/asdsa/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not DELETE a new document with an invalid prefix (containing |)', function (done) {
            request.delete('/api/storage/' + prefix + token + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + token + ' cannot contain ' + token);
                    done();
                });
        });

        it('should not DELETE a new document with an invalid suffix (containing |)', function (done) {
            request.delete('/api/storage/' + prefix + '/' + suffix + token)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + token + ' cannot contain ' + token);
                    done();
                });
        });
    });

};
