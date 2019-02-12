const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const moment = require('moment');
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');
const View = require('../views/index');
const db = require('../models/index');
const User = db.User;
const Token = db.Token;

const AuthController = {
    me(req, res, next) {
        const user = req.user;
        const data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        };

        res.status(200).send(View.generate(null, data));
    },
    logout(req, res, next) {
        const user = req.user;

        Token.destroy({
                where: {
                    userId: user.id
                }
            })
            .then(() => {
                const text = `User ${user.name} was successfully logged out.`;
                        
                res.status(200).send(View.generate(text));
            })
            .catch(error => {
                const text = "Unexpected error occurred. Please try again later.";

                res.status(500).send(View.generate(text, null, false));
            });
    },
    login(req, res, next) {
        const body = req.body;
        const email = body.email;
        const password = body.password;

        User.findOne({
                where: {email}
            })
            .then(user => {
                if (!user) {
                    return res.status(403).send(View.generate("Invalid credentials.", null, false));
                }

                return bcrypt.compare(password, user.password)
                    .then(result => {
                        if (!result) {
                            return Promise.resolve(null);
                        }

                        return Token.create({
                            token: randomstring.generate(),
                            expiredAt: moment().add(1, 'hours').format("YYYY-MM-DD HH:mm:ss"),
                            userId: user.id
                        });
                    })
                    .then(token => {
                        if (!token) {
                            return res.status(403).send(View.generate("Invalid credentials.", null, false));
                        }

                        const text = `User ${user.name} was successfully logged in.`;
                        const data = {
                            name: user.name,
                            email: user.email,
                            token: token.token,
                            expiredAt: token.expiredAt
                        };

                        res.status(200).send(View.generate(text, data));
                    });
            })
            .catch(error => {
                const text = "Unexpected error occurred. Please try again later.";

                res.status(500).send(View.generate(text, null, false));
            });
    },
    register(req, res, next) {
        const body = req.body;

        User.build({
                name: body.name,
                email: body.email,
                password: body.password
            })
            .validate()
            .then(user => {
                bcrypt.hash(body.password, 10)
                    .then(hash => {
                        user.password = hash;

                        return user.save();
                    })
                    .then(user => {
                        const text = 'User was successfully registered.';
                        const data = {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        };

                        res.status(200).send(View.generate(text, data));
                    })
                    .catch(error => {
                        const text = "Unexpected error occurred. Please try again later.";

                        res.status(500).send(View.generate(text, null, false));
                    });
            })
            .catch(error => {
                const text = "Validation failed.";
                const data = {
                    errors: ValidationErrorsSerializer.serialize(error.errors)
                };

                res.status(422).send(View.generate(text, data, false));
            });

    }
}

module.exports = AuthController;