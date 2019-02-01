const express = require('express');
const router = express.Router();
const TodosController = require('../controllers/TodosController');

router.get('/api/todos', TodosController.index);
router.post('/api/todos', TodosController.store);
router.delete('/api/todos/:id', TodosController.destroy);

module.exports = router;