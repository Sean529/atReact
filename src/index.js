import React from "react"
import ReactDOM from "react-dom"
// import React from "./react"
// import ReactDOM from "./react-dom"

class Counter extends React.Component {
  static defaultProps = {
    name: "at",
  }

  constructor(props) {
    super(props)
    this.state = {
      number: 0,
    }
  }
  handlerClick = () => {
    this.setState({
      number: this.state.number + 1,
    })
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <ChildCounter count={this.state.number} />
        <button onClick={this.handlerClick}>+</button>
      </div>
    )
  }
}

class ChildCounter extends React.Component {
  constructor() {
    super()
    this.state = {
      number: 0,
    }
  }
  // 当子组件接收到新属性时会触发
  static getDerivedStateFromProps(nextProps, prevState) {
    const { count } = nextProps
    if (count % 2 === 0) {
      return {
        number: count * 2,
      }
    } else if (count % 3 === 0) {
      return {
        number: count * 3,
      }
    }
    return null
  }

  render() {
    return <div>{this.state.number}</div>
  }
}

const element = <Counter />

ReactDOM.render(element, document.getElementById("root"))
