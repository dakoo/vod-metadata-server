var chai = require('chai');
var chaiHttp = require('chai-http');
var server = 'http://localhost:3001';
var should = chai.should();
chai.use(chaiHttp);
describe('GET /vod', function() {
	it('should return 200 OK', function(done) {
		chai.request(server)
			.get('/vod')
			.end(function(err, res) {
				res.should.have.status(200);
				done();
			});
	});
	it('should return json', function(done) {
		chai.request(server)
			.get('/vod')
			.end(function(err, res) {
				res.should.be.json;
				done();
			});
	});
	it('should return array', function(done) {
		chai.request(server)
			.get('/vod')
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				done();
			});
	});
	it('should list the items includig _id, title, description, loc, createDate, creator, videoUrl, thumbnailUrl', function(done) {
		chai.request(server)
			.get('/vod')
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				for (var i = res.body.length - 1; i >= 0; i--) {
					res.body[i].should.have.property('_id');
					res.body[i].should.have.property('title');
					res.body[i].should.have.property('description');					
					res.body[i].should.have.property('loc');					
					res.body[i].should.have.property('creationDate');
					res.body[i].should.have.property('creator');
					res.body[i].should.have.property('videoUrl');
					res.body[i].should.have.property('thumbnailUrl');					
				};
				done();
			});
	});
	it('should list the items includig _id, title, loc, createDate, videoUrl with the value', function(done) {
		chai.request(server)
			.get('/vod')
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				for (var i = res.body.length - 1; i >= 0; i--) {
					res.body[i]['_id'].should.be.not.empty;
					res.body[i]['title'].should.be.not.empty;
					res.body[i]['loc'].should.be.not.empty;
					res.body[i]['creationDate'].should.be.not.empty;
					res.body[i]['videoUrl'].should.be.not.empty;				
				};
				done();
			});
	});	
});