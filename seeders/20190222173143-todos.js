'use strict';

const faker = require('faker');

module.exports = {
    up: (queryInterface, Sequelize) => {
        const sequelize = queryInterface.sequelize;

        return sequelize.query('SELECT id FROM Users', {type: sequelize.QueryTypes.SELECT})
            .then(users => {
                const todos = [];

                users.map(user => {
                    Array.from(Array(10)).map(() => {
                        todos.push({
                            userId: user.id,
                            title: faker.lorem.words(3),
                            description: faker.lorem.words(10),
                            createdAt: new Date(),
                            updatedAt: new Date()
                        });
                    });
                });

                return queryInterface.bulkInsert('Todos', todos, {});
            });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Todos', null, {});
    }
};