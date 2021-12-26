// import React from "react"
// import ReactDOM from "react-dom"
import React from "./react"
import ReactDOM from "./react-dom"

const ThemeContext = React.createContext()
const { Provider, Consumer } = ThemeContext
const style = { margin: '10px', padding: '5px', }
function Title() {
  return (
    <Consumer>
      {
        (contentValue) => (
          <div style={{ ...style, border: `5px solid ${contentValue.color}` }}>
            Title
          </div>
        )
      }
    </Consumer>
  )
}
class Head extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ ...style, border: `5px solid ${this.context.color}` }}>
        Head
        <Title />
      </div>)
  }
}
function Content() {
  return (
    <Consumer>
      {
        (contextValue) => (
          <div style={{ ...style, border: `5px solid ${contextValue.color}` }}>
            Content
            <button onClick={() => contextValue.changeColor('red')}>变红</button>
            <button onClick={() => contextValue.changeColor('green')}>变绿</button>
          </div>
        )
      }
    </Consumer>
  )
}
class Main extends React.Component {
  static contextType = ThemeContext
  render() {
    return (
      <div style={{ ...style, border: `5px solid ${this.context.color}` }}>
        Main
        <Content />
      </div>)
  }
}
class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = { color: 'red' }
  }

  changeColor = (color) => {
    this.setState({ color })
  }

  render() {
    const contextValue = { color: this.state.color, changeColor: this.changeColor }
    return (
      <Provider value={contextValue}>
        <div style={{ ...style, width: '250px' }}>
          <Head />
          <Main />
        </div>
      </Provider >
    )
  }
}

const element = <Page />

ReactDOM.render(element, document.getElementById("root"))
