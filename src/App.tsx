import React from 'react'
import {Root, Routes, addPrefetchExcludes, Head} from 'react-static'
import {Router} from '@reach/router'

import Dynamic from 'containers/Dynamic'

import './App.css'
import LoadingScreen from "components/LoadingScreen";

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic'])

function App() {
    return (
        <Root>
            <Head>
                <script async defer data-domain="paperaces.com" src="https://analytics.papaccino.gg/js/plausible.js"/>
                <title>Pape Races</title>
            </Head>
            <div className="App">
                <React.Suspense fallback={<LoadingScreen/>}>
                    <Router>
                        <Dynamic path="dynamic"/>
                        <Routes path="*"/>
                    </Router>
                </React.Suspense>
            </div>
        </Root>
    )
}

export default App
