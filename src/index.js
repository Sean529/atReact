// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';

class ClassComponent extends React.Component {
  render() {
    return (<h1 className="title" style={{ color: 'red' }}>
      <span>{this.props.name}</span>
      <span>{this.props.children}</span>
    </h1>)
  }
}

const element = <ClassComponent name='title'>hello</ClassComponent>
ReactDOM.render(
  element,
  document.getElementById('root')
);
