const entrance = (
  <header className="header">
    <h1>todos</h1>
    <input className="new-todo" placeholder="What needs to be done?" autofocus></input>
  </header>
);
const rootEle = (
  <section className="todoapp">
    <entrance></entrance>

    <section className="main">
      <input className="toggle-all" type="checkbox"></input>
      <label for="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        <li className="completed">
          <div className="view">
            <input className="toggle" type="checkbox" checked></input>
            <input type="text" className="input_edit none"></input>
            <label>Taste JavaScript</label>
            <button className="destroy"></button>
          </div>
          <input className="edit" value="Create a TodoMVC template"></input>
        </li>
        <li>
          <div className="view">
            <input className="toggle" type="checkbox"></input>
            <input type="text" className="input_edit none"></input>
            <label>Buy a unicorn</label>
            <button className="destroy"></button>
          </div>
          <input className="edit" value="Rule the web"></input>
        </li>
      </ul>
    </section>
  </section>
);

ReactDOM.render(
  rootEle, document.getElementById('root')
);
