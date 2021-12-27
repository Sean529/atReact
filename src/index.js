import React from "react"
import ReactDOM from "react-dom"
// import React from "./react"
// import ReactDOM from "./react-dom"

function withTracker(OldComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = { x: 0, y: 0 }
    }

    handleMouseMove = (event) => {
      this.setState({ x: event.clientX, y: event.clientY })
    }

    render() {
      return (<div onMouseMove={this.handleMouseMove} style={{ border: '1px solid red' }}>
        <OldComponent {...this.state} />
      </div>)
    }
  }
}

function show(props) {
  return (
    <div>
      <h1>移动鼠标</h1>
      <p>当前鼠标位置 {props.x},{props.y}</p>
    </div>
  )
}

const ShowWithTracker = withTracker(show)
ReactDOM.render(<ShowWithTracker />, document.getElementById("root"))
