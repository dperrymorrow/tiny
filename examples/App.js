import { Component } from "../lib/index.js";

class App extends Component {
  data = {
    header: {
      title: "Things that need to get done",
      description: "Just a simple todo app",
    },

    todos: [
      {
        id: 1,
        title: "Grocery store",
        done: true,
        createdAt: new Date(),
        tags: ["food", "chores"],
      },
      {
        id: 2,
        title: "buy presents",
        done: false,
        createdAt: null,
        tags: ["food", "chores"],
      },
    ],
  };

  get nextId() {
    const ids = this.data.todos.map(({ id }) => id);
    return Math.max(...ids) + 1;
  }

  addTodo() {
    const title = this.refs.newInput.value;
    this.data.todos.push({
      id: this.nextId,
      title,
      done: false,
      tags: ["freddy"],
    });
    this.refs.newInput.value = "";
  }
  destroy(event, id) {
    this.data.todos = this.data.todos.filter((todo) => todo.id !== id);
  }
  updateTitle({ target }) {
    this.data.header.title = target.value;
  }
  toggle({ target }, todo) {
    debugger;
    todo.done = target.checked;
  }
}

export default App;
