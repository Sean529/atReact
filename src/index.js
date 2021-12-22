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
        {this.state.number}
        {this.state.number === 4 ? null : <ChildCounter count={this.state.number} />}
        <button onClick={this.handlerClick}>+</button>
      </div>
    )
  }
}

class ChildCounter extends React.Component {
  constructor(props) {
    super(props)
    console.log('ChildCounter 1. constructor');
  }
  componentWillMount() {
    console.log('ChildCounter 2. componentWillMount');
  }

  componentDidMount() {
    console.log('ChildCounter 4. componentDidMount');
  }

  componentReceiveProps() {
    console.log('ChildCounter 5. componentReceiveProps');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('ChildCounter 6. shouldComponentUpdate');
    return nextProps.count % 3 === 0
  }

  componentWillUnmount() {
    console.log('ChildCounter 7. componentWillUnmount');
  }

  render() {
    console.log('ChildCounter 3. render');
    return (
      <div>
        {this.props.count}
      </div>
    )
  }
}

const element = <Counter />

ReactDOM.render(
  element,
  document.getElementById('root')
);
