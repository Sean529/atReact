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

  handleClick = (event) => {
    console.log('handleButtonClick');
    this.setState(state => ({ number: state.number + 1 }))
    console.log(this.state.number);
    this.setState(state => ({ number: state.number + 1 }))
    console.log(this.state.number);
    setTimeout(() => {
      this.setState({
        number: this.state.number + 1
      })
      console.log(this.state.number);
      this.setState({
        number: this.state.number + 1
      })
      console.log(this.state.number);
    })
  }

  handleDivClick = () => {
    console.log('handleDivClick');
  }

  render() {
    return (
      <div onClick={this.handleDivClick}>
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
