(function () {
    class RootContainer extends React.Component {
        constructor(props) {
            super(props)
            // this.state = props || {};
            this.state = {
                value: '2',
                value2: '',
                list: [
                    {
                        text: "a",
                        value: 1
                    },
                    {
                        text: "b",
                        value: 2
                    },
                    {
                        text: "c",
                        value: 3
                    }
                ]
            }
        }
        handleChange(e) {
            console.log(e.target.value);
            const target = e.target;
            const value = e.type == "check"?targget.checked:target.value;
            const name = target.name;
            this.setState({                
                [name]:value
            });
            console.log(this.state)
        }
        handleSubmit(e) {
            console.log("submitting");
            e.preventDefault();
        }
        render() {
            const options = this.state.list.map((x, idx) => (
                <option value={x.value}
                    key={idx}
                >{x.text}</option>
            ));
            return (
                <form style={{ width: "70%", margin: "50px auto", textAlign: "center" }} onSubmit={this.handleSubmit}>
                    <label htmlFor="">select</label>
                    <input type="text"
                        value={this.state.select}
                        >
                    </input>
                    <br />
                    <br />
                    <label htmlFor="">age:<span >{this.state.age}</span></label>
                    <input type="text"
                        name="age"
                        onChange={this.handleChange.bind(this)}>
                    </input>
                    <br />
                    <br />
                    <label htmlFor="">tele:<span>{this.state.tele}</span></label>
                    <input type="text"
                        name="tele"
                        onChange={this.handleChange.bind(this)}>
                    </input>
                    <br />
                    <br />
                    <select
                        name="select"
                        onChange={this.handleChange.bind(this)}>
                        {options}
                    </select>
                    <br />
                    <br />
                    <button type="submit">提交</button>
                </form>
            )
        }
    }
    RootContainer.defaultProps = {
        value: "initilize"
    }
    ReactDOM.render(
        <RootContainer />,
        document.querySelector("#app")
    )
}())