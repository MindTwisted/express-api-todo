'use strict';

module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 6
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    min: 10
                }
            }
        }
    }, {});

    Todo.associate = function (models) {
        models.Todo.belongsTo(models.User, {
            onDelete: "CASCADE"
        });
    };

    return Todo;
};