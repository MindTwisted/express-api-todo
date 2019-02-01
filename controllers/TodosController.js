const todoModel = require('../models/Todo');

function index(req, res, next) {
    todoModel
        .queryAll()
        .then(function (data) {
            res.send({
                status: 'success',
                body: {
                    data: {
                        todos: data
                    }
                }
            });
        });
}

function store(req, res, next) {
    const body = req.body;

    todoModel
        .store({
            title: body.title,
            description: body.description
        })
        .then(function (data) {
            res.send({
                status: 'success',
                body: {
                    text: "Todo was successfully added.",
                    data: {
                        todo: data
                    }
                }
            });
        });

}

function destroy(req, res, next) {
    const id = req.params.id;

    todoModel
        .destroy(id)
        .then(function(data) {
            res.send({
                status: 'success',
                body: {
                    text: `Todo with id ${id} was successfully deleted.`
                }
            });
        });
}

module.exports = {
    index,
    store,
    destroy
};