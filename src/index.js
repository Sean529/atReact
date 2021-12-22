// import React from 'react';
// import ReactDOM from 'react-dom';
import React from './react';
import ReactDOM from './react-dom';

function TextInput(props, forwardRef) {
  return (
    <input ref={forwardRef} />
  )
}

const ForwardTextInput = React.forwardRef(TextInput)

class Form extends React.Component {
  constructor() {
    super()
    this.textInputRef = React.createRef()
  }

  handler = () => {
    this.textInputRef.current.focus()
  }

  render() {
    const element = <ForwardTextInput ref={this.textInputRef} />
    return (
      <div>
        {element}
        <button onClick={this.handler}>获取焦点</button>
      </div>
    )
  }
}

const element = <Form />

ReactDOM.render(
  element,
  document.getElementById('root')
);
