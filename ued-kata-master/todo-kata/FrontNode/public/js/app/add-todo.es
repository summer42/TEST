
export default {
	element: '.header',

	events: {
		'keypress .new-todo': 'newTodoKeyPress'
	},

	model: {
		newTodo: ''
	},

	use: '',

	initialize() {
		this.on('added-todo', () => {
			this.model.newTodo = '';
			this.render();
		});
	},

	render() {
		this.$('.new-todo').val(this.model.newTodo);
	},

	newTodoKeyPress(e) {
		if (e.keyCode === 13) {
			let $newTodo = this.$(e.currentTarget);
			let newTodo = $newTodo.val();
			if (newTodo) {
				this.parent.trigger('new-todo', {
					title: newTodo,
					isComplete: false
				}, this);
			}
			return false;
		}
	}
};
