// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
    console.log(this.state);
  }

  render() {
    return (
      <div>
        <p>number: {this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

const element = <Counter />

ReactDOM.render(
  element,
  document.getElementById('root')
);
