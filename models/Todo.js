'use strict';

module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 6
                },
                isUnique(value, next) {
                    Todo.find({
                        where: {title: value},
                        attributes: ['id']
                    }).then(todo => {
                        if (todo) {
                            return next('This title is already in use.');
                        }

                        next();
                    });
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    min: 20
                }
            }
        }
    }, {});

    Todo.associate = function (models) {
        // associations can be defined here
    };

    return Todo;
};