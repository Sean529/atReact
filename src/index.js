import React from './react';
import ReactDOM from './react-dom';

function FunctionComponent(props) {
  return (
    <h1 className="title" style={{ color: 'red' }}>
      <span>{props.name}</span>
      <span>{props.children}</span>
    </h1>
  )
}

const element = <FunctionComponent name='title'>hello</FunctionComponent>
ReactDOM.render(
  element,
  document.getElementById('root')
);
