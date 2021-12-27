// import React from "react"
// import ReactDOM from "react-dom"
import React from "./react"
import ReactDOM from "./react-dom"

class ClassCounter extends React.PureComponent {
  render() {
    console.log('ClassCounter render');
    return <div>ClassCounter: {this.props.counter}</div>
  }
}

function FunctionCounter(props) {
  console.log('FunctionCounter render');
  return <div>FunctionCounter: {props.counter}</div>
}

const MemoFunctionCounter = React.memo(FunctionCounter)

class App extends React.Component {
  constructor() {
    super()
    this.state = { number: 0 }
    this.amountRef = React.createRef()
  }
  handleClick = () => {
    const number = this.state.number + parseInt(this.amountRef.current.value)
    this.setState({ number })
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <ClassCounter counter={this.state.number} />
        <MemoFunctionCounter counter={this.state.number} />
        <input ref={this.amountRef} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))
