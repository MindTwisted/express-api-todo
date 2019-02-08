const bcrypt = require('bcrypt');
const db = require('../models/index');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');
const View = require('../views/index');

const AuthController = {
    me(req, res, next) {
        res.send('me');
    },
    login(req, res, next) {
        res.send('login');
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
                bcrypt.hash(body.password, 10, function(err, hash) {
                    user.password = hash;

                    user.save()
                        .then(user => {
                            const text = 'User was successfully registered.';
                            const data = {
                                name: user.name,
                                email: user.email
                            };

                            res.status(200).send(View.generate(text, data));
                        })
                        .catch(error => {
                            const text = "Unexpected error occurred. Please try again later.";

                            res.status(500).send(View.generate(text, null, false));
                        });
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