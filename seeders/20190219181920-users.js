'use strict';

const bcrypt = require('bcrypt');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                name: 'John Walker',
                email: 'john@example.com',
                password: bcrypt.hashSync('secret', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'William Smith',
                email: 'smith@example.com',
                password: bcrypt.hashSync('secret', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};