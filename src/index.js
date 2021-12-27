// import React from "react"
// import ReactDOM from "react-dom"
import React from "./react"
import ReactDOM from "./react-dom"

function Children({ data, handleClick }) {
  console.log('Children render');
  return (
    <button onClick={handleClick}>{data.number}</button>
  )
}

const MemoChildren = React.memo(Children)

function App() {
  console.log('App render');
  const [name, setName] = React.useState('AT')
  const [number, setNumber] = React.useState(0)
  // 希望data在App组件重新渲染的时候，如果number变了就变成新的data，如果number没有变，就返回老的data
  const data = React.useMemo(() => ({ number }), [number])
  // handleClick在App组件重新渲染的时候，如果number变了就返回新的handleClick，如果number没有变，就返回旧的handleClick
  const handleClick = React.useCallback(() => setNumber(number + 1), [number])
  return (
    <div>
      <input type="text" value={name} onChange={event => setName(event.target.value)} />
      <MemoChildren data={data} handleClick={handleClick} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
