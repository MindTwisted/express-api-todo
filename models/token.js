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

    return Token;
};