// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';

class Counter extends React.Component {
  static defaultProps = {
    name: 'at'
  }

  constructor(props) {
    super(props)
    this.state = {
      number: 0
    }
    console.log('Counter 1. constructor');
  }

  componentWillMount() {
    console.log('Counter 2. componentWillMount');
  }

  componentDidMount() {
    console.log('Counter 4. componentDidMount');
  }

  // 组件（页面）是否要更新
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5. shouldComponentUpdate');
    // 奇数不更新页面，偶数更新页面，不管页面更不更新，this.state 都会被更新
    return nextState.number % 2 === 0
  }

  componentWillUpdate() {
    console.log('Counter 6. componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('Counter 7. componentDidUpdate');
  }

  handlerClick = () => {
    this.setState({
      number: this.state.number + 1
    })
  }

  render() {
    console.log('Counter 3 .render');
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handlerClick}>+</button>
      </div>
    )
  }
}

const element = <Counter />

ReactDOM.render(
  element,
  document.getElementById('root')
);
