const db = require('../models/index');
const Todo = require('../models/todo')(db.sequelize, db.Sequelize);
const ValidationErrorsSerializer = require('../serializers/ValidationErrorsSerializer');

const TodoController = {
    index(req, res, next) {
        Todo.findAll()
            .then(todos => {
                res.send({
                    status: 'success',
                    body: {
                        data: {
                            todos
                        }
                    }
                });
            });
    },
    show(req, res, next) {
        const id = req.params.id;
    
        Todo.findById(id)
            .then(todo => {
                if (!todo) {
                    res.send({
                        status: 'failed',
                        body: {
                            text: `Todo with id ${id} doesn't exist.`
                        }
                    }, 404);

                    return;
                }

                res.send({
                    status: 'success',
                    body: {
                        data: {
                            todo
                        }
                    }
                });
            });
    },
    store(req, res, next) {
        const body = req.body;
    
        Todo.create({
                title: body.title,
                description: body.description
            })
            .then(todo => {
                res.send({
                    status: 'success',
                    body: {
                        text: "Todo was successfully added.",
                        data: {
                            todo
                        }
                    }
                });
            })
            .catch(error => {
                res.send({
                    status: 'failed',
                    body: {
                        text: "Validation error.",
                        data: {
                            errors: ValidationErrorsSerializer.serialize(error.errors)
                        }
                    }
                }, 422)
            });
    },
    destroy(req, res, next) {
        const id = req.params.id;
    
        Todo.findById(id)
            .then(todo => {
                if (!todo) {
                    return Promise.reject();
                }

                return todo.destroy();
            })
            .then(() => {
                res.send({
                    status: 'success',
                    body: {
                        text: `Todo with id ${id} was successfully deleted.`
                    }
                });
            })
            .catch(error => {
                res.send({
                    status: 'failed',
                    body: {
                        text: `Todo with id ${id} doesn't exist.`
                    }
                }, 404);
            });
    }
};

module.exports = TodoController;