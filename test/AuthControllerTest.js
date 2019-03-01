process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const spawn = require('child-process-promise').spawn;
const spawnOptions = { stdio: 'inherit' };
const LOGIN_URL = '/auth/login';
const REGISTER_URL = '/auth/register';
const AUTH_URL = '/api/auth';

chai.use(chaiHttp);

const agent = chai.request.agent(server);

describe('AuthController', () => {
    before(done => {
        spawn('./node_modules/.bin/sequelize', ['db:create'], spawnOptions)
            .then(() => spawn('./node_modules/.bin/sequelize', ['db:migrate'], spawnOptions))
            .then(() => spawn('./node_modules/.bin/sequelize', ['db:seed:all'], spawnOptions))
            .then(() => done());
    });

    after(done => {
        spawn('./node_modules/.bin/sequelize', ['db:drop'], spawnOptions)
            .then(() => done());
    });

    // Login tests
    describe(`POST ${LOGIN_URL}`, () => {
        
        it('should response with 403 if empty request body was provided', done => {
            agent.post(LOGIN_URL)
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');

                    done();
                });
        });

        it('should response with 403 if invalid credentials were provided', done => {
            agent.post(LOGIN_URL)
                .send({
                    email: "wrong@email.com",
                    password: "wrongpassword"
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    
                    done();
                });
        });

        it('should response with 200 and token if valid credentials were provided', done => {
            agent.post(LOGIN_URL)
                .send({
                    email: "john@example.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.body.data.token.should.have.property('token');
                    
                    done();
                });
        });
    });

    // Current auth tests
    describe(`GET ${AUTH_URL}`, () => {

        it('should response with 401 if auth token was not provided', done => {
            agent.get(AUTH_URL)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    
                    done();
                });
        });

        it('should response with 401 if invalid auth token was provided', done => {
            agent.get(AUTH_URL)
                .set('Authorization', 'Bearer 123')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    
                    done();
                });
        });

        it('should response with 200 and user info if valid auth token was provided', done => {
            agent.post(LOGIN_URL)
                .send({
                    email: "john@example.com",
                    password: "secret"
                })
                .then(res => {
                    const token = res.body.body.data.token.token;

                    agent.get(AUTH_URL)
                        .set('Authorization', `Bearer ${token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status').eql('success');
                            res.body.body.data.user.should.have.property('name');
                            res.body.body.data.user.should.have.property('email');
                            
                            done();
                        });
                });
        });

    });

    // Register tests
    describe(`POST ${REGISTER_URL}`, () => {

        it('should response with 422 if name, email and password were not provided', done => {
            agent.post(REGISTER_URL)
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    res.body.body.data.errors.should.have.property('name');
                    res.body.body.data.errors.should.have.property('email');
                    res.body.body.data.errors.should.have.property('password');
                    
                    done();
                });
        });

        it('should response with 422 if provided email was not valid', done => {
            agent.post(REGISTER_URL)
                .send({
                    name: "John Walker",
                    email: "johnexample.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    res.body.body.data.errors.should.have.property('email');
                    
                    done();
                });
        });

        it('should response with 422 if provided email has already existed', done => {
            agent.post(REGISTER_URL)
                .send({
                    name: "John Walker",
                    email: "john@example.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    res.body.body.data.errors.should.have.property('email');
                    
                    done();
                });
        });

        it('should response with 422 if provided password was less then 6 characters', done => {
            agent.post(REGISTER_URL)
                .send({
                    name: "John Walker",
                    email: "johnunique@example.com",
                    password: "secre"
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    res.body.body.data.errors.should.have.property('password');
                    
                    done();
                });
        });

        it('should response with 422 if provided name was less then 6 characters', done => {
            agent.post(REGISTER_URL)
                .send({
                    name: "John",
                    email: "johnunique@example.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    res.body.body.data.errors.should.have.property('name');
                    
                    done();
                });
        });

        it('should response with 200 if name, email and password were correctly provided', done => {
            agent.post(REGISTER_URL)
                .send({
                    name: "John Walker",
                    email: "johnunique@example.com",
                    password: "secret"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.body.data.user.should.have.property('id');
                    res.body.body.data.user.should.have.property('name');
                    res.body.body.data.user.should.have.property('email');
                    
                    done();
                });
        });

    });

    // Logout tests
    describe(`DELETE ${AUTH_URL}`, () => {

        it('should response with 401 if auth token was not provided', done => {
            agent.delete(AUTH_URL)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('failed');
                    
                    done();
                });
        });

        it('should response with 200 if valid auth token was provided', done => {
            agent.post(LOGIN_URL)
                .send({
                    email: "john@example.com",
                    password: "secret"
                })
                .then(res => {
                    const token = res.body.body.data.token.token;

                    agent.delete(AUTH_URL)
                        .set('Authorization', `Bearer ${token}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('status').eql('success');
                            
                            done();
                        });
                });
        });

    });
});