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

    Todo.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());

        delete values.UserId;
        delete values.createdAt;
        delete values.updatedAt;

        return values;
    };

    return Todo;
};