const fs = require('fs');
const path = require('path');
const todosPath = path.join(__dirname, '../todos.json');
const uuidv1 = require('uuid/v1');

function queryAll() {
    return new Promise(function(resolve, reject) {
        fs.readFile(todosPath, function(err, data) {
            if (err) throw err;
    
            const todos = JSON.parse(data.toString());
    
            resolve(todos);
        });
    });
}

function store(todo) {
    return new Promise(function(resolve, reject) {
        fs.readFile(todosPath, function(err, data) {
            if (err) throw err;
    
            const todos = JSON.parse(data.toString());
            const newTodo = {
                id: uuidv1(),
                ...todo
            };

            todos.push(newTodo);

            fs.writeFile(todosPath, JSON.stringify(todos), function(err) {
                if (err) throw err;

                resolve(newTodo);
            });
        });
    });
}

function destroy(id) {
    return new Promise(function(resolve, reject) {
        fs.readFile(todosPath, function(err, data) {
            if (err) throw err;

            const todos = JSON.parse(data.toString());
            const newTodos = todos.filter(function(item) {
                return item.id != id;
            });

            fs.writeFile(todosPath, JSON.stringify(newTodos), function(err) {
                if (err) throw err;

                resolve();
            });
        });
    });
}

module.exports = {
    queryAll,
    store,
    destroy
};