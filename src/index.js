import React from 'react'
import ReactDOM from 'react-dom'
import CheckFlight from './components/CheckFlight'

import './styles.css'

function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <h3 id="obs">a</h3>
      <CheckFlight />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
