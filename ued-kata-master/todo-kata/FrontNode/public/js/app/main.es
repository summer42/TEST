import addTodo from './add-todo.es';

const ENTER_KEY = 13;
const ESC_KEY = 27;

let slice = [].slice;

let app = new BaseView({
	api: {
		query: '/todos/',
		add: '/todos/add',
		toggle: '/todos/toggle',
		destroy: '/todos/destroy',
		modify: '/todos/modify'
	},

	element: 'body',

	events: {
		'change .toggle-all': 'toggleAll',
		'click .filters li': 'filter',

		'change .toggle': 'toggle',
		'click .destroy': 'destroy',
		'click .clear-completed': 'clearCompleted',
		'dblclick .todo-list li': 'beginEdit',
		'keydown .edit': 'finishEdit'
	},

	model: {
		todos: [],
		filter: 'all',
		filters: {
			isAll: false,
			isActive: false,
			isCompleted: false
		},
		filteredTodos: []
	},

	use: 'templateAutoRender',

	subViews: {
		addTodo: null,
		todoList: null
	},

	initialize() {
		this.subViews.addTodo = new BaseView(
			_.extend({}, addTodo, {
				parent: this
			})
		);

		this.on('new-todo', this.onNewTodo);
		this.on('toggle-todo', this.onToggle);

		this.query();
	},

	render() {
		this.doFilter();
		let { todos } = this.model;
		this.model.uncompletedCount = todos.filter(todo => !todo.isComplete).length;
		this.model.showClearComplete = todos.length - this.model.uncompletedCount > 0;

		this.autoRender();

		let allIsChecked = this.model.todos.every(todo => todo.isComplete);
		this.$('.toggle-all').prop('checked', allIsChecked);

		return this;
	},

	query() {
		Promise.resolve(
			$.postJSON(this.api.query)
		).then(result => {
			this.model.todos = result.todos;
			this.render();
		});
	},

	clearEdit() {
		this.$('.todo-list li').removeClass('editing');
	},

	beginEdit(e) {
		this.clearEdit();

		let $todo = this.$(e.currentTarget);
		let id = $todo.addClass('editing').attr('data-id');
		let todo = this.model.todos.find(todo => todo.id == id);
		this.model.editing = todo;
	},

	finishEdit(e) {
		if (e.keyCode === ESC_KEY) {
			this.clearEdit();
		}
		else if (e.keyCode === ENTER_KEY) {
			let $newTitle = this.$(e.currentTarget);
			let newTitle = $newTitle.val().trim();
			this.model.editing.title = newTitle;
			Promise.resolve(
				$.postJSON(this.api.modify, {
					todo: this.model.editing
				})
			).then(result => {
				if (result.code !== 1) {
					toastr.error(result.errorMsg);
					return;
				}
				this.render();
			});
		}
	},

	onToggle({ all, value: isChecked, todo }) {
		let { todos } = this.model;
		let promise;
		if (all) {
			promise = Promise.all(
				todos.map(todo => {
					todo.isComplete = isChecked;
					return $.postJSON(this.api.toggle, {
						todo
					});
				})
			);
		}
		else {
			promise = Promise.resolve(
				$.postJSON(this.api.toggle, {
					todo
				})
			);
		}

		promise.then(result => {
			if (result.code === 0) {
				toastr.error(result.errorMsg);
				return;
			}
			this.render();
		});
	},

	toggleAll(e) {
		let $target = this.$(e.currentTarget);
		let isChecked = $target.prop('checked');
		this.trigger('toggle-todo', {
			all: true,
			value: isChecked
		});
	},

	toggle(e) {
		let $target = this.$(e.currentTarget);
		let isChecked = $target.prop('checked');
		let $todo = $target.parents('[data-id]');
		let id = $todo.attr('data-id');

		let todo = this.model.todos.find(todo => todo.id == id);
		todo.isComplete = isChecked;
		this.trigger('toggle-todo', {
			todo
		});
	},

	filter(e) {
		let $target = this.$(e.currentTarget);
		let filter = $target.attr('data-filter');
		this.model.filter = filter;
		this.render();
	},

	doFilter() {
		let { todos, filter, filteredTodos } = this.model;
		let { isAll, isActive, isCompleted } = [ false, false, false ];
		switch (filter) {
			case 'all':
			default:
				filteredTodos = todos;
				isAll = true;
				break;
			case 'active':
				filteredTodos = todos.filter(todo => !todo.isComplete);
				isActive = true;
				break;
			case 'completed':
				filteredTodos = todos.filter(todo => todo.isComplete);
				isCompleted = true;
				break;
		}
		this.model.filteredTodos = filteredTodos;
		this.model.filters = {
			isAll,
			isActive,
			isCompleted
		};
	},

	destroy(e) {
		let $todo = this.$(e.currentTarget).parents('[data-id]');
		let id = $todo.attr('data-id');
		let { todos } = this.model;
		let todo = todos.find(todo => todo.id == id);
		if (todo) {
			let index = todos.indexOf(todo);
			this.model.todos = todos.slice(0, index).concat(todos.slice(index - 1 + 2));

			this._destroy(todo);
		}
	},

	_destroy(todo) {
		Promise.resolve(
			$.postJSON(this.api.destroy, {
				todo
			})
		).then(result => {
			if (result.code !== 1) {
				toastr.error(result.errorMsg);
				return;
			}
			this.render();
		});
	},

	clearCompleted() {
		let { todos } = this.model;
		let completed = todos.filter(todo => todo.isComplete);
		let uncompletedTodos = todos.filter(todo => !todo.isComplete);
		this.model.todos = uncompletedTodos;
		completed.forEach(this._destroy, this);
	},

	onNewTodo(todo = {}, sender) {
		let { todos } = this.model;
		if (todo.title) {
			todos.unshift(todo);
			Promise.resolve(
				$.postJSON(this.api.add, {
					todo
				})
			).then(result => {
				if (result.code === 1) {
					todo.id = result.id;
					this.render();
					sender.trigger('added-todo');
				}
				else {
					toastr.warning(result.errorMsg);
				}
			});
		}
	}
});

export default app;
