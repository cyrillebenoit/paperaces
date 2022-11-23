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
                <title>Pape Races</title>

                {/*Fonts*/}
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"}/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,400;0,500;0,600;1,800&display=swap"
                    rel="stylesheet"/>

                {/*Favicon*/}
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png"/>
                <link rel="manifest" href="/icons/site.webmanifest"/>
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#dd4bc4"/>
                <link rel="shortcut icon" href="/icons/favicon.ico"/>
                <meta name="apple-mobile-web-app-title" content="Pape Races"/>
                <meta name="application-name" content="Pape Races"/>
                <meta name="msapplication-TileColor" content="#dd4bc4"/>
                <meta name="msapplication-config" content="/icons/browserconfig.xml"/>
                <meta name="theme-color" content="#ffffff"/>

                {/*Analytics*/}
                <script async defer data-domain="paperaces.com"
                        src="https://analytics.papaccino.gg/js/plausible.js"/>
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
