(function () {

  //按键代码
  let KEYCODES = {
    Enter: 13,
    ESC: 27
  };

  //初始待办项列表
  let dataArr = [
    { text: '1', id: 0, completed: false },
    { text: '2', id: 1, completed: false },
    { text: '3', id: 2, completed: false }
  ];

  //初始id
  let id = dataArr.length || 0;

  //新建待办项
  const Entrance = React.createClass({
    confirmInput: function (e) {
      if (e.keyCode == KEYCODES.Enter) {
        let value = this.refs.entranceInput.value;
        //完整属性
        this.props.list.push({
          text: value,
          id: id++,
          showEdit: false,
          completed: false
        });
        this.refs.entranceInput.value = "";
        // this.setState({ list: list });
        console.log(this.props.list.map(x => x.text));
        this.props.dataChange.call(this, this.props.list);
      }
    },
    render: function () {
      return (
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo" ref="entranceInput" onKeyUp={this.confirmInput} placeholder="What needs to be done?" autoFocus></input>
        </header>
      );
    }
  });

  //编辑待办项
  const Edit = React.createClass({
    // getInitialState:function(){
    //   this.refs.editItemInput.value = this.props.item.text;
    // },
    cancelEdit: function () {
      this.props.item.showEdit = false;
      this.props.dataChange(this.props.list);
    },
    eidtItem: function (e) {
      if (e.keyCode == KEYCODES.Enter) {
        let value = this.refs.editItemInput.value;
        let preItem = this.props.list.find(x => x.id == this.props.item.id);
        preItem.text = this.refs.editItemInput.value;
        console.log(this.props.list.map(x => x.text));
        this.refs.editItemInput.value = "";
        //脱离编辑状态
        this.props.item.showEdit = false;
        //同步到最外层组件
        this.props.dataChange(this.props.list);
      }
    },
    render: function () {
      return (
        <input type="text" className="input_edit none" defaultValue={this.props.item.text} onKeyUp={this.eidtItem} ref="editItemInput" onBlur={this.cancelEdit}></input>
      )
    }
  });

  //待办项列表
  const List = React.createClass({
    display: function (item, type) {
      if (type === "label") {
        return item.showEdit ? "hide" : ""
      }
    },
    edit: function (item) {
      item.showEdit = true;
      this.props.dataChange(this.props.list);
    },
    del: function (item) {
      this.props.dataChange(this.props.list.filter(x => x.id != item.id));
    },
    switchComplete: function (item) {
      item.completed = !item.completed;
      this.props.dataChange(this.props.list);
    },
    displayComplete: function (item) {
      return item.completed ? "completed" : ""
    },
    render: function () {
      const dataArrLi = this.props.list.map((x, idx) => (
        <li key={x.id} className={this.displayComplete(x)}>
          <div className="view" >
            <input className="toggle" type="checkbox" onClick={() => this.switchComplete(x)}></input>
            {x.showEdit ? <Edit dataChange={this.props.dataChange} list={this.props.list} item={x} /> : null}
            <label className={this.display(x, "label")} onDoubleClick={() => this.edit(x)}>{x.text}</label>
            <button className="destroy" onClick={() => this.del(x)}></button>
          </div>
          <input className="edit" defaultValue="Rule the web"></input>
        </li>
      ))
      return <ul className="todo-list">{dataArrLi}</ul>
    }
  });

  //底部筛选
  const Footer = React.createClass({
    clearComplete: function () {
       dataArr.forEach(x => x.completed = false);
       this.props.dataChange(dataArr);
    },
    filterByState: function (type) {
      if (type === "active") {
        this.props.dataChange(dataArr.filter(x => !x.completed));
      }
      if (type === "completed") {
        this.props.dataChange(dataArr.filter(x => x.completed));
      }
      if (type === "all") {
        this.props.dataChange(dataArr);
      }
      else {
        return
      }
    },
    render: function () {
      return (
        <footer className="footer">
          <span className="todo-count"> <strong>{this.props.list.filter(x => !x.completed).length || 0}</strong>
          </span>
          <ul className="filters">
            <li>
              <a className="selected all" onClick={() => this.filterByState("all")} href="#/">All</a>
            </li>
            <li>
              <a className="selected all" onClick={() => this.filterByState("active")} href="#/active">Active</a>
            </li>
            <li>
              <a className="selected all" onClick={() => this.filterByState("completed")} href="#/completed">Completed</a>
            </li>
          </ul>
          <button className="clear-completed none" onClick={ this.clearComplete }>Clear completed</button>
        </footer>
      )
    }
  });

  //顶级容器
  const RootContainer = React.createClass({
    getInitialState: function () {
      return {
        list: dataArr
      }
    },
    changeList: function (innerArr) {
      this.setState({
        list: innerArr
      })
    },
    render: function () {
      return (
        <section className="todoapp">
          <Entrance list={this.state.list} dataChange={this.changeList} />
          <section className="main">
            <input className="toggle-all" type="checkbox"></input>
            <label htmlFor="toggle-all">Mark all as complete</label>
            <List list={this.state.list} dataChange={this.changeList}></List>
          </section>
          <Footer list={this.state.list} dataChange={this.changeList}></Footer>
        </section>
      );
    }
  });

  //渲染页面
  ReactDOM.render(
    <RootContainer />, document.getElementById('root')
  );

})()