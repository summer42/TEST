(function () {
    //按键代码
    let KEYCODES = {
        Enter: 13
    };
    // const handleFuncs = function () {
    //     let _this = this;
    //     Array.prototype.forEach.call(arguments, function (x) {
    //         x = x.bind(_this);
    //     });
    // }
    //添加输入框
    class FieldInput extends React.Component {
        constructor(props) {
            super(props);
            const { id, list, dataChange } = props
            this.state = {
                id, list, dataChange, warning: false
            };

            // handleFuncs.call(this,this.confirmInput, this._add, this.confirmAdd);
            // this.confirmInput = this.confirmInput.bind(this);
            // this.confirmAdd = this.confirmAdd.bind(this);
            this._add = this._add.bind(this);
        }

        componentWillReceiveProps(newVal) {
            this.setState(newVal);
        }

        //内部用添加方法
        _add() {
            let input = this.refs.fieldInput;
            if (input.value != '') {
                if (this.state.list.filter(x => x.text == input.value).length == 0) {
                    this.state.list.unshift({
                        text: input.value,
                        id: this.state.id
                    })
                    input.value = "";
                    this.state.dataChange(this.state.list);
                }

                else {
                    this.state.warning = true;
                    this.setState(this.state)
                    setTimeout(() => {
                        this.state.warning = false;
                        this.setState(this.state)
                    }, 2000)
                }
            }
        }

        confirmInput(e) {
            let input = this.refs.fieldInput;
            if (e.keyCode == KEYCODES.Enter) {
                this._add();
            }
        }

        confirmAdd() {
            let input = this.refs.fieldInput;
            this._add();
        }
        displayWarning() {            
            if (this.state.warning) {
                return ""
            }
            else {
                return "hide"
            }
        }
        render() {
            return (
                <div className="field-input-container">
                    <input className="field-input" type="text"
                        onKeyUp={this.confirmInput.bind(this)}
                        ref="fieldInput" >
                    </input>
                    <p className={this.displayWarning()} >配置信息已存在</p>
                    <span className="btn" onClick={ () => this.confirmAdd() }>添加</span>
                </div>
            )
        }
    }

    class List extends React.Component {
        constructor(props) {
            super(props);
            this.state = props;
        }

        componentWillReceiveProps(newVal) {
            this.setState(newVal);
        }

        del(item) {
            let list = this.state.list.filter(x => x.id != item.id);
            this.state.dataChange(list);
        }

        render() {
            const listEle = this.state.list.map(x => (
                <li key={x.id}>
                    <p>{x.text}</p>
                    <span className="btn btn-remove"
                        onClick={() => this.del(x)}>
                    </span>
                </li>
            ))
            if (this.state.list && this.state.list.length > 0) {
                return (
                    <ul className="list-container">
                        {listEle}
                    </ul>
                )
            }
            else {
                return (
                    <p style={{ textAlign: "center" }}>暂无数据</p>
                )
            }
        }
    }

    class RootContainer extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                list: [],
                id: 0
            }
            this.dataChange = this.dataChange.bind(this);
        }

        dataChange(innerList) {
            this.setState({
                list: innerList,
                id: innerList.length + 1
            })
        }

        render() {
            return (
                <div className="field-container">
                    <h3>行业管理</h3>
                    <List list={this.state.list} id={this.state.id} dataChange={this.dataChange} ></List>
                    <FieldInput list={this.state.list} id={this.state.id} dataChange={this.dataChange}></FieldInput>
                </div>
            )
        }
    }


    //渲染页面
    ReactDOM.render(
        <RootContainer />, document.getElementById('app')
    );

}())