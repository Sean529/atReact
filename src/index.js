import React from "react"
import ReactDOM from "react-dom"
// import React from "./react"
// import ReactDOM from "./react-dom"

// 1.属性代理
// const withLoading = message => OldComponent => {
//   return class extends React.Component {
//     render() {
//       const state = {
//         show() {
//           let div = document.createElement('div');
//           div.id = 'loadingDiv'
//           div.innerHTML = `<p style="position:absolute;top:100px;z-index:10;background-color:black;color:pink;">${message}</p>`;
//           document.body.appendChild(div);
//         },
//         hide() {
//           document.getElementById('loadingDiv').remove()
//         }
//       }
//       return (
//         <OldComponent {...this.props} {...state} />
//       )
//     }
//   }
// }

// // @withLoading('加载中...')
// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         <p>App</p>
//         <button onClick={this.props.show}>show</button>
//         <button onClick={this.props.hide}>hide</button>
//       </div>
//     )

//   }
// }

// const WithLoadingApp = withLoading('加载中...')(App)

// const element = <WithLoadingApp />

// 2.反向继承
class Button extends React.Component {
  state = { name: '按钮' }
  componentWillMount() {
    console.log('Button componentWillMount');
  }
  componentDidMount() {
    console.log('Button componentDidMount');
  }
  render() {
    console.log('Button render');
    return <button name={this.state.name} title={this.props.title} />
  }
}

const enhancer = OldComponent => {
  return class extends OldComponent {
    state = { number: 0 }
    componentWillMount() {
      console.log('enhancer componentWillMount');
      super.componentWillMount()
    }
    componentDidMount() {
      console.log('enhancer componentDidMount');
      super.componentDidMount()
    }
    handleClick = () => {
      this.setState({ number: this.state.number + 1 })
    }
    render() {
      console.log('enhancer render');
      const renderElement = super.render()
      const newProps = {
        ...renderElement.props,
        ...this.state,
        onClick: this.handleClick
      }
      return React.cloneElement(renderElement, newProps, this.state.number)
    }
  }
}

const EnhanceButton = enhancer(Button)
ReactDOM.render(<EnhanceButton title="标题" />, document.getElementById("root"))
