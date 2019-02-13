'use strict';

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        token: {
            type: DataTypes.STRING
        },
        expiredAt: {
            type: DataTypes.DATE
        }
    }, {});

    Token.associate = function (models) {
        models.Token.belongsTo(models.User, {
            onDelete: "CASCADE"
        });
    };

    Token.prototype.toJSON = function() {
        const values = Object.assign({}, this.get());

        delete values.id;
        delete values.UserId;
        delete values.createdAt;
        delete values.updatedAt;

        return values;
    };

    return Token;
};