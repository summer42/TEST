(function () {

    let alt = new Alt();

    let mockData = [];

    let services = {
        query: () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ list: mockData, id: mockData.length })
                }, 1000)
            })
        },
        add: data => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    mockData = data.list;
                    resolve({ success: true })
                }, 0)
            })
        }
    };


    function LocationActions() {
        this.generateActions('updateList', 'errorHandler');
        this.addItem = function (data) {
            var that = this;
            services.add(data)
                .then(data => {
                    that.queryData();
                })
        }
        this.queryData = function () {
            var that = this;
            return function(dispatch){
                dispatch();
                services.query()
                .then(data => {
                    that.updateList(data);
                })
                .catch(err => {
                    that.errorHandler(err);
                })
            }
        }
    };


    // class LocationActions {
    //     addItem(data) {
    //         return () => {
    //             services.add(data)
    //                 .then(data => {
    //                     this.queryData();
    //                 })
    //         }

    //     }
    //     updateList(data) {
    //         return data;
    //     }
    //     queryData() {
    //         let that = this;            
    //         return function (dispatch) {
    //             dispatch();
    //             services.query()
    //                 .then(data => {
    //                     that.updateList(data);
    //                 })
    //                 .catch(err => {
    //                     that.errorHandler(err);
    //                 })
    //         }
    //     }
    //     errorHandler(err) {
    //         return err;
    //     }
    // }
    const actions = alt.createActions(LocationActions);
    class LocationStore {
        constructor() {
            this.on('bootstrap', () => {
            });
            this.on('snapshot', () => {
            });
            this.on('init', () => {
            });
            this.on('rollback', () => {
            });

            this.list = [];
            this.list.type = '';
            this.id = 0;
            this.bindListeners({
                handleUpdateList: actions.UPDATE_LIST,
                handleFetchLocations: actions.QUERY_DATA,
                handleAddItem: actions.ADD_ITEM
            });
        }

        handleUpdateList(data) {
            const { list, id } = data;
            this.list = list;
            this.id = list.length > 0 ? list[list.length - 1].id + 1 : 0;
        }
        handleFetchLocations() {
            this.list = [{
                text: "isLoading",
                id: 1,
                completed: true,
                showEdit: false
            }];
        }
        handleAddItem() {
            this.list = [{
                text: "isAddding",
                id: 1,
                completed: true,
                showEdit: false
            }];
        }
    };

    const store = alt.createStore(LocationStore, 'LocationStore');

    //按键代码
    let KEYCODES = {
        Enter: 13,
        ESC: 27
    };


    //新建待办项
    class Entrance extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                list: props.list,
                id: props.id
            }
            this.confirmInput = this.confirmInput.bind(this);
            this.completeAll = this.completeAll.bind(this);
            this.onChange = this.onChange.bind(this);
        }

        componentWillReceiveProps(nextProps) {
            this.setState(nextProps);
        }

        componentDidMount() {
            console.log("mounted and listenning")
            store.listen(this.onChange);
        }

        componentWillUnmount() {
            store.unlisten(this.onChange);
        }

        onChange(state) {
            this.setState(state);
        }

        confirmInput(e) {
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
                actions.addItem(this.state);
            }
        }

        completeAll() {
            if (this.state.list.filter(x => !x.completed).length == 0) {
                this.state.list.forEach(x => x.completed = false);
            }
            else {
                this.state.list.forEach(x => x.completed = true);
            }
            this.state.list.type = '';
            actions.updateList(this.state);
        }

        render() {
            return (
                <header className="header">
                    {this.state.list.length > 0 ? <input className="toggle-all" onClick={this.completeAll} type="checkbox"></input> : null}
                    <h1>todos</h1>
                    <input className="new-todo" ref="entranceInput" onKeyUp={this.confirmInput} placeholder="What needs to be done?" autoFocus></input>
                </header>
            );
        }
    };

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
        componentWillMount: () => {
        },
        componentDidMount: () => {
        },
        shouldComponentUpdate: (nextProps, nextState) => {
            return true
        },
        componentWillUpdate: (nextProps, nextState) => {
            return true
        },
        componentWillUnmount: () => {
        },

        cancelEdit: function () {
            this.state.list.find(x => x.id == this.props.item.id).showEdit = false;
            actions.updateList(this.state);
        },
        eidtItem: function (e) {
            let value = this.editItemInput.value;
            const confirm = () => {
                this.editItemInput.value = "";
                //脱离编辑状态
                this.props.item.showEdit = false;
                //同步到最外层组件
                actions.updateList(this.state);
            }
            if (e.keyCode == KEYCODES.Enter && value != '') {
                let preItem = this.state.list.find(x => x.id == this.props.item.id);
                preItem.text = this.editItemInput.value;
                confirm();
            }
            if (e.keyCode == KEYCODES.ESC) {
                confirm();
            }
        },
        render: function () {
            return (
                <input type="text"
                    className="input_edit none"
                    autoFocus="autofocus"
                    defaultValue={this.props.item.text}
                    onKeyUp={this.eidtItem}
                    ref={input => { console.log(this); return this.editItemInput = input }}
                    onBlur={this.cancelEdit}></input>
            )
        }
    });

    //待办项列表
    class List extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                list: props.list,
                id: props.id
            }
            this.cb = this.cb.bind(this);
        }
        componentWillReceiveProps(nextProps) {
            this.setState(nextProps)
        }
        componentWillMount() {
            console.log("'List' mounting")
        }
        componentDidMount() {
            console.log("'List' mounted")
        }
        shouldComponentUpdate(nextProps, nextState) {
            console.log("'List' should update");
            return true
        }
        componentWillUpdate(nextProps, nextState) {
            console.log("'List' updating");
            return true
        }
        componentWillUnmount() {
            console.log("'List' unmounted");
        }

        cb() {
            return this;
        }

        display(item, type) {
            if (type === "label") {
                return item.showEdit ? "hide" : ""
            }
        }
        edit(item) {
            if (!item.completed) {
                item.showEdit = true;
                actions.updateList(this.state);
            }
        }
        del(item) {
            this.state.list = this.state.list.filter(x => x.id != item.id)
            // window.localStorage.dataJSON = JSON.stringify(this.state.list);
            actions.updateList(this.state);
        }
        switchComplete(item) {
            item.completed = !item.completed;
            this.state.list.find(x => {
                return x.id == item.id
            }).completed = item.completed;
            //同步到最外层组件
            actions.updateList(this.state);
        }
        displayComplete(item) {
            return item.completed ? "completed" : ""
        }
        render() {
            console.log("'List' rendering");
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
                        {x.showEdit ? <Edit list={this.props.list} item={x} /> : null}
                        <label className={this.display(x, "label")} onDoubleClick={() => this.edit(x)}>{x.text}</label>
                        <button className="destroy" onClick={() => this.del(x)}></button>
                    </div>
                    <input className="edit" defaultValue="Rule the web"></input>
                </li>
            ))
            return <ul className="todo-list">{arrLi}</ul>
        }
    };

    List.defaultProps = {
        list: [{
            text: "已完成", id: 1, showEdit: false, completed: true
        }],
        id: 1
    };

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
            actions.updateList(this.state);
        },
        filterByState: function (type) {
            this.state.list.type = type;
            actions.updateList(this.state);
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
    class RootContainer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                list: store.state.list,
                id: 0
            }
            this.changeList = this.changeList.bind(this);
            this.onChange = this.onChange.bind(this);

        }
        changeList(innerArr) {
            this.setState({
                list: innerArr,
                id: innerArr.length + this.state.id
            })
        }
        query() {
            actions.queryData(() => { });
        }
        componentDidMount() {
            store.listen(this.onChange);
        }

        componentWillUnmount() {
            store.unlisten(this.onChange);
        }
        onChange(state) {
            this.setState(state);
        }
        render() {
            return (
                <section className="todoapp">
                    <Entrance list={this.state.list} id={this.state.id} />
                    {/* <span onClick={ this.query.bind(this)  }>查询</span> */}
                    <section className="main">
                        <label htmlFor="toggle-all">Mark all as complete</label>
                        <List list={this.state.list} ref={com => this.foo = com}></List>
                        {/* <List></List> */}
                    </section>
                    {this.state.list.length > 0 ? <Footer list={this.state.list}></Footer> : null}

                </section>
            );
        }
    };

    //渲染页面
    ReactDOM.render(
        <RootContainer />, document.getElementById('root')
    );

})()