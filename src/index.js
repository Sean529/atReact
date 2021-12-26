// import React from "react"
// import ReactDOM from "react-dom"
import React from "./react"
import ReactDOM from "./react-dom"

class ScrollList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      message: [],
    }
    this.wrapper = React.createRef()
  }

  addMessage = () => {
    this.setState({
      message: [`${this.state.message.length}`, ...this.state.message]
    })
  }

  componentDidMount() {
    setInterval(() => {
      this.addMessage()
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.wrapper.current.scrollTop,
      prevScrollHeight: this.wrapper.current.scrollHeight
    }
  }

  componentDidUpdate(prevProps, prevState, { prevScrollTop, prevScrollHeight }) {
    this.wrapper.current.scrollTop = prevScrollTop + (this.wrapper.current.scrollHeight - prevScrollHeight)
  }

  render() {
    const style = {
      width: '200px',
      height: '100px',
      border: '1px solid red',
      overflow: 'auto',
    }
    return (
      <div style={style} ref={this.wrapper}>
        {
          this.state.message.map((message, index) => {
            return <div key={index}>{message}</div>
          })
        }
      </div>
    )
  }
}

const element = <ScrollList />

ReactDOM.render(element, document.getElementById("root"))
