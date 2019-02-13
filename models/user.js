'use strict';

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
                    }).then(user => {
                        if (user) {
                            return next('This email is already in use.');
                        }

                        next();
                    })
                    .catch(error => {
                        return next("Unexpected error occurred. Try again later.");
                    });
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
    }, {});

    User.associate = function (models) {
        models.User.hasMany(models.Token);
        models.User.hasMany(models.Todo);
    };

    return User;
};