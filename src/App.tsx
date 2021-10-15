import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
import { Router } from '@reach/router'

// import FancyDiv from 'components/FancyDiv'
import Dynamic from 'containers/Dynamic'

import './App.css'
import logo from './logo24.png'

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
  return (
    <Root>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" style={{imageRendering: 'pixelated'}}/>
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <Dynamic path="dynamic" />
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </header>
      </div>
    </Root>
  )
}

export default App
