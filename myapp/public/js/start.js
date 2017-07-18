(function () {

  //按键代码
  let KEYCODES = {
    Enter: 13,
    ESC: 27
  };

  //初始待办项列表
  let dataArr = [];
  // if (window.localStorage.dataJSON) {
  //   dataArr = JSON.parse(window.localStorage.dataJSON)
  // }
  dataArr.type = '';

  //初始id
  let id = dataArr.length || 0;

  //筛选规则
  const filterFuncs = function () {
    let _this = this;
    return {
      "active": function () {
        _this.props.dataChange(dataArr.filter(x => !x.completed))
      },

      "completed": function () {
        _this.props.dataChange(dataArr.filter(x => x.completed))
      },

      "all": function () {
        _this.props.dataChange(dataArr)
      },

      "": function () {
        _this.props.dataChange(dataArr)
      }
    }
  }

  //新建待办项
  const Entrance = React.createClass({
    componentWillReceiveProps:function(nextProps){
      console.log(nextProps)
    },
    confirmInput: function (e) {
      let value = this.refs.entranceInput.value;
      if (e.keyCode == KEYCODES.Enter && value != '') {
        //完整属性
        dataArr.push({
          text: value,
          id: ++id,
          showEdit: false,
          completed: false
        });
        // window.localStorage.dataJSON = JSON.stringify(dataArr);
        this.refs.entranceInput.value = "";
        filterFuncs.bind(this)()[dataArr.type]();
      }
    },
    completeAll: function () {
      if (dataArr.filter(x => !x.completed).length == 0) {
        dataArr.forEach(x => x.completed = false);
      }
      else {
        dataArr.forEach(x => x.completed = true);
      }
      dataArr.type = '';
      this.props.dataChange(dataArr);
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
    // getInitialState:function(){
    //   this.refs.editItemInput.value = this.props.item.text;
    // },
    cancelEdit: function () {
      dataArr.find(x => x.id == this.props.item.id).showEdit = false;
      this.props.dataChange(dataArr);
    },
    eidtItem: function (e) {
      let value = this.refs.editItemInput.value;
      if (e.keyCode == KEYCODES.Enter && value != '') {
        let preItem = dataArr.find(x => x.id == this.props.item.id);
        preItem.text = this.refs.editItemInput.value;
        console.log(dataArr.map(x => x.text));
        this.refs.editItemInput.value = "";
        //脱离编辑状态
        this.props.item.showEdit = false;
        //同步到最外层组件
        filterFuncs.bind(this)()[dataArr.type]();
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
      if (!item.completed) {
        item.showEdit = true;
        this.props.dataChange(this.props.list);
      }

    },
    del: function (item) {
      dataArr = dataArr.filter(x => x.id != item.id)
      // window.localStorage.dataJSON = JSON.stringify(dataArr);
      this.props.dataChange(dataArr);
    },
    switchComplete: function (item) {
      item.completed = !item.completed;
      dataArr.find(x => x.id == item.id).completed = item.completed;
      //同步到最外层组件
      filterFuncs.bind(this)()[dataArr.type]();
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
    displayState: function (btnType) {
      if (btnType == dataArr.type) {
        return "selected"
      }
    },
    clearComplete: function () {
      dataArr.forEach(x => x.completed = false);
      dataArr.type = '';
      this.props.dataChange(dataArr);
    },
    filterByState: function (type) {
      dataArr.type = type;
      filterFuncs.bind(this)()[type]();
    },
    render: function () {
      return (
        <footer className="footer">
          <span className="todo-count"> <strong>{dataArr.filter(x => !x.completed).length || 0}</strong>
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