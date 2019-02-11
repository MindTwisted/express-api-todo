'use strict';

const randomstring = require("randomstring");
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('Token', {
        token: {
            type: DataTypes.STRING,
            defaultValue: randomstring.generate()
        },
        userId: {
            type: DataTypes.INTEGER
        },
        expiredAt: {
            type: DataTypes.DATE,
            defaultValue: moment().add(1, 'hours').format("YYYY-MM-DD HH:mm:ss")
        }
    }, {});

    Token.associate = function (models) {
        Token.belongsTo(models.User);
    };

    return Token;
};