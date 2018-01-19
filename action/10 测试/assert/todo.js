class Todo {
    constructor() {
        this.todos = [];
    }

    add(item) {
        if (!item) throw Error('Todo#ass requires an item');
        this.todos.push(item)
    }

    deleteAll() {
        this.todos.length = 0;
    }

    getCount() {
        return this.todos.length;
    }

     doAsync(cb) {
        setTimeout(cb, 2000, true)
    }

}

module.exports = Todo;