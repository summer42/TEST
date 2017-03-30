var express = require('express');
var router = express.Router();

var todos = [
	{
		id: 1,
		title: 'Finish 85ido library.',
		isComplete: false
	},
	{
		id: 2,
		title: 'This is the 2th todo.',
		isComplete: false
	},
	{
		id: 3,
		title: 'This is the thrid todo.',
		isComplete: true
	},
	{
		id: 4,
		title: 'This is the 4th todo.',
		isComplete: false
	},
	{
		id: 5,
		title: 'This is the 5th todo.',
		isComplete: false
	},
	{
		id: 6,
		title: 'This is the 6th todo.',
		isComplete: false
	},
	{
		id: 7,
		title: 'This is the 7th todo.',
		isComplete: false
	},
	{
		id: 8,
		title: 'This is the 8th todo.',
		isComplete: false
	}
];
var maxId = todos.length;

router.get('/', function(req, res, next) {
	res.send({
		code: 1,
		todos: todos
	});
});

router.post('/add', function(req, res, next) {
	var todo = req.body.todo;
	if (!todo) {
		res.status(500)
			.send({
				code: 0,
				errorMsg: 'Todo is empty.'
			});
		return;
	}
	todo.id = ++maxId;
	todos.push(todo);
	res.send({
		code: 1,
		id: todo.id
	});
});

router.post('/remove', function(req, res, next) {
	var id = req.body.id;
	if (!id) {
		res.status(500).send({
			code: 0,
			errorMsg: 'Without argument: id'
		});
	}
	for (var i = 0, len = todos.length; i < len; i++) {
		var todo = todos[i];
		if (todo.id == id) {
			todos = todos.slice(0, i).concat(todos.slice(i - 1 + 2));
			res.send({
				code: 1
			});
			return;
		}
	}
	res.status(500).send({
		code: 0,
		errorMsg: 'Have not a todo with id:' + id
	});
});

router.post('/update', function(req, res, next) {
	var todo = req.body.todo;
	if (!todo) {
		res.status(500).send({
			code: 0,
			errorMsg: 'Without argument: todo'
		});
	}
	todos = todos.map(function(item) {
		if (item.id == todo.id) {
			return todo;
		}
		return item;
	});
	res.send({
		code: 1
	});
});

module.exports = router;
