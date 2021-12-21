// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';

class Sum extends React.Component {
  constructor() {
    super()
    this.a = React.createRef()
    this.b = React.createRef()
    this.result = React.createRef()
  }

  handleClick = (event) => {
    const valueA = this.a.current.value
    const valueB = this.b.current.value
    this.result.current.value = valueA + valueB
  }

  render() {
    return (
      <div onClick={this.handleDivClick}>
        <input ref={this.a} />
        <input ref={this.b} />
        <button onClick={this.handleClick}>+</button>
        <input ref={this.result} />
      </div>
    )
  }
}

const element = <Sum />

ReactDOM.render(
  element,
  document.getElementById('root')
);
