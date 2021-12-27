// import React from "react"
// import ReactDOM from "react-dom"
import React from "./react"
import ReactDOM from "./react-dom"

function Counter() {
  const [number, setNumber] = React.useState(0)
  // 此函数会在组件和DOM渲染之后执行,可以执行一些副作用的代码
  React.useEffect(() => {
    console.log('开启定时器');
    const timer = setInterval(() => {
      setNumber(number => number + 1)
    }, 1000)
    // 返回一个函数，会在下次执行 useEffect 回调之前执行
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div>
      {number}
    </div >
  )
}

ReactDOM.render(<Counter />, document.getElementById("root"))
