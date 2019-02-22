'use strict';

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 6
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                isUnique(value, next) {
                    User.find({
                            where: {email: value},
                            attributes: ['id']
                        })
                        .then(user => {
                            if (user) {
                                return next('This email is already in use.');
                            }

                            next();
                        })
                        .catch(() => next('Unexpected error occurred. Please try again later.'));
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 6
                }
            }
        }
    }, {
        hooks: {
            beforeSave(instance, options) {
                return bcrypt.hash(instance.password, 10)
                    .then(hash => {
                        instance.password = hash;
                    });
            }
        }
    });

    User.associate = function (models) {
        models.User.hasMany(models.Token);
        models.User.hasMany(models.Todo);
    };

    User.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());

        delete values.password;
        delete values.createdAt;
        delete values.updatedAt;

        return values;
    };

    return User;
};