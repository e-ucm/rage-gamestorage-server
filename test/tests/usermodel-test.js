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
    var value = {
        someKey: 'someValue'
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
            request.post('/api/usermodel/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not POST(CREATE) a new document with the same prefix/suffix', function (done) {
            request.post('/api/usermodel/' + prefix + '/' + suffix)
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
            request.post('/api/usermodel/' + prefix + '|' + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + '|' + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not POST(CREATE) a new document with an invalid suffix (containing |)', function (done) {
            request.post('/api/usermodel/' + prefix + '/' + suffix + '|')
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + '|' + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * GET
         */
        it('should GET a document', function (done) {
            request.get('/api/usermodel/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body).eql(value);
                    done();
                });
        });

        it('should not GET a document with a non-existent prefix/suffix', function (done) {
            request.get('/api/usermodel/asdsa/' + suffix)
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
            request.get('/api/usermodel/' + prefix + '|' + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + '|' + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not GET a new document with an invalid suffix (containing |)', function (done) {
            request.get('/api/usermodel/' + prefix + '/' + suffix + '|')
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + '|' + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * UPDATE AND SET (PUT)
         */
        it('should PUT(UPDATE AND SET - create) a documment', function (done) {
            request.put('/api/usermodel/' + prefix + '2' + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should PUT(UPDATE AND SET) a new document with the same prefix/suffix', function (done) {
            request.put('/api/usermodel/' + prefix + '/' + suffix)
                .expect(200)
                .set('Accept', 'application/json')
                .send(updateValue)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not PUT(UPDATE AND SET) a new document with an invalid prefix (containing |)', function (done) {
            request.put('/api/usermodel/' + prefix + '|' + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + '|' + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not PUT(UPDATE AND SET) a new document with an invalid suffix (containing |)', function (done) {
            request.put('/api/usermodel/' + prefix + '/' + suffix + '|')
                .expect(400)
                .set('Accept', 'application/json')
                .send(value)
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + '|' + ' cannot contain ' + token);
                    done();
                });
        });

        /**
         * DELETE
         */
        it('should DELETE a document', function (done) {
            request.delete('/api/usermodel/' + prefix + '/' + suffix)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not DELETE a document with a non-existent prefix/suffix', function (done) {
            request.delete('/api/usermodel/asdsa/' + suffix)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    done();
                });
        });

        it('should not DELETE a new document with an invalid prefix (containing |)', function (done) {
            request.delete('/api/usermodel/' + prefix + '|' + '/' + suffix)
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The prefix ' + prefix + '|' + ' cannot contain ' + token);
                    done();
                });
        });


        it('should not DELETE a new document with an invalid suffix (containing |)', function (done) {
            request.delete('/api/usermodel/' + prefix + '/' + suffix + '|')
                .expect(400)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    should.not.exist(err);
                    should(res.body.message).equal('The suffix ' + suffix + '|' + ' cannot contain ' + token);
                    done();
                });
        });
    });

};
