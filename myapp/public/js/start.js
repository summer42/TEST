(function () {

  //按键代码
  let KEYCODES = {
    Enter: 13,
    ESC: 27
  };

  //初始待办项列表
  // let this.state.list = [];
  // if (window.localStorage.dataJSON) {
  //   this.state.list = JSON.parse(window.localStorage.dataJSON)
  // }
  // this.state.list.type = '';

  //初始id
  // let id = this.state.list.length || 0;



  //新建待办项
  const Entrance = React.createClass({
    getInitialState: function () {
      return {
        list: this.props.list,
        id: this.props.id
      }
    },
    componentWillReceiveProps: function (nextProps) {
      console.log(nextProps, "Entrance")
      this.setState(nextProps);
    },
    confirmInput: function (e) {
      let value = this.refs.entranceInput.value;
      if (e.keyCode == KEYCODES.Enter && value != '') {
        //完整属性
        this.state.list.push({
          text: value,
          id: ++this.state.id,
          showEdit: false,
          completed: false
        });
        // window.localStorage.dataJSON = JSON.stringify(this.state.list);
        this.refs.entranceInput.value = "";
        this.props.dataChange(this.state.list);
      }
    },
    completeAll: function () {
      if (this.state.list.filter(x => !x.completed).length == 0) {
        this.state.list.forEach(x => x.completed = false);
      }
      else {
        this.state.list.forEach(x => x.completed = true);
      }
      this.state.list.type = '';
      this.props.dataChange(this.state.list);
    },
    render: function () {
      return (
        <header className="header">
          <input className="toggle-all" onClick={this.completeAll} type="checkbox"></input>
          <h1>todos</h1>
          <input className="new-todo" ref="entranceInput" onKeyUp={this.confirmInput} placeholder="What needs to be done?" autoFocus></input>
        </header>
      );
    }
  });

  //编辑待办项
  const Edit = React.createClass({
    getInitialState: function () {
      return {
        list: this.props.list
      }
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState(nextProps)
    },
    componentDidMount:() => {
      console.log("mounted")
    },
    componentWillUnmount: () => {
      console.log("unmounted");      
    },
    cancelEdit: function () {
      this.state.list.find(x => x.id == this.props.item.id).showEdit = false;
      this.props.dataChange(this.state.list);
    },
    eidtItem: function (e) {
      let value = this.refs.editItemInput.value;
      if (e.keyCode == KEYCODES.Enter && value != '') {
        let preItem = this.state.list.find(x => x.id == this.props.item.id);
        preItem.text = this.refs.editItemInput.value;
        console.log(this.state.list.map(x => x.text));
        this.refs.editItemInput.value = "";
        //脱离编辑状态
        this.props.item.showEdit = false;
        //同步到最外层组件
        this.props.dataChange(this.state.list);
      }
      if (e.keyCode == KEYCODES.ESC) {
        this.refs.editItemInput.value = "";
        //脱离编辑状态
        this.props.item.showEdit = false;
        //同步到最外层组件
        this.props.dataChange(this.props.list);
      }
    },
    render: function () {
      return (
        <input type="text" className="input_edit none" autoFocus="autofocus" defaultValue={this.props.item.text} onKeyUp={this.eidtItem} ref="editItemInput" onBlur={this.cancelEdit}></input>
      )
    }
  });

  //待办项列表
  const List = React.createClass({
    getInitialState: function () {
      return {
        list: this.props.list
      }
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState(nextProps)
    },
    display: function (item, type) {
      if (type === "label") {
        return item.showEdit ? "hide" : ""
      }
    },
    edit: function (item) {
      if (!item.completed) {
        item.showEdit = true;
        this.props.dataChange(this.props.list);
      }
    },
    del: function (item) {
      this.state.list = this.state.list.filter(x => x.id != item.id)
      // window.localStorage.dataJSON = JSON.stringify(this.state.list);
      this.props.dataChange(this.state.list);
    },
    switchComplete: function (item) {
      item.completed = !item.completed;
      this.state.list.find(x => {
        return x.id == item.id
      }).completed = item.completed;
      //同步到最外层组件
      this.props.dataChange(this.state.list);
    },
    displayComplete: function (item) {
      return item.completed ? "completed" : ""
    },
    render: function () {
      const arrLi = this.props.list.filter(x => {
        if (this.props.list.type === "active") {
          return !x.completed
        }
        if (this.props.list.type === "completed") {
          return x.completed
        }
        else {
          return true
        }
      }).map((x, idx) => (
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
      return <ul className="todo-list">{arrLi}</ul>
    }
  });

  //底部筛选
  const Footer = React.createClass({
    getInitialState: function () {
      return {
        list: this.props.list
      }
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState(nextProps)
    },
    displayState: function (btnType) {
      if (btnType == this.state.list.type) {
        return "selected"
      }
    },
    clearComplete: function () {
      this.state.list.forEach(x => x.completed = false);
      this.state.list.type = '';
      this.props.dataChange(this.state.list);
    },
    filterByState: function (type) {
      this.state.list.type = type;
      this.props.dataChange(this.state.list);
    },
    render: function () {
      return (
        <footer className="footer">
          <span className="todo-count"> <strong>{this.state.list.filter(x => !x.completed).length || 0}</strong>
          </span>
          <ul className="filters">
            <li>
              <a className="all" className={this.displayState("all")} onClick={() => this.filterByState("all")} href="#/">All</a>
            </li>
            <li>
              <a className="all" className={this.displayState("active")} onClick={() => this.filterByState("active")} href="#/active">Active</a>
            </li>
            <li>
              <a className="all" className={this.displayState("completed")} onClick={() => this.filterByState("completed")} href="#/completed">Completed</a>
            </li>
          </ul>
          <button className="clear-completed none" onClick={this.clearComplete}>Clear completed</button>
        </footer>
      )
    }
  });

  //顶级容器
  const RootContainer = React.createClass({
    getInitialState: function () {
      var arr = [];
      arr.type = '';
      return {
        list: arr,
        id: 0
      }
    },
    changeList: function (innerArr) {
      this.setState({
        list: innerArr,
        id: innerArr.length + this.state.id
      })
    },
    shouldComponentUpdate: (nextProps, nextState) => {
      console.log(nextProps, nextState);
      // if (nextState.list[nextState.list.length - 1].text === "dont render") {
      //   return false
      // }
      return true
    },
    componentWillUpdate: (nextProps, nextState) => {
      console.log(nextProps, nextState);

      return false
    },
   
    render: function () {
      return (
        <section className="todoapp">
          <Entrance list={this.state.list} id={this.state.id} dataChange={this.changeList} />
          <section className="main">
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