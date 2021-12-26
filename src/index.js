// import React from "react"
// import ReactDOM from "react-dom"
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [
        ["A", "B"],
        ["C", "D"],
        ["E", "F"],
      ],
    }
  }

  handlerClick = () => {
    this.setState({
      list: ["A", "C", "E", "B", "G"],
    })
  }

  render() {
    return (
      <div>
        <ul>
          {React.Children.map(this.state.list, (item) => (
            <li key={item}>{item}</li>
          ))}
          {/* {this.state.list.map(item => <li key={item}>{item}</li>)} */}
        </ul>
        <button onClick={this.handlerClick}>+</button>
      </div>
    )
  }
}

const element = <Counter />

ReactDOM.render(element, document.getElementById("root"))
